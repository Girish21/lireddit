import { UniqueConstraintViolationException } from '@mikro-orm/core';
import * as argon2 from 'argon2';
import { sendEmail } from '../util/sendEmail';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from '../constants';
import { User } from '../entities/User';
import { ContextType } from '../types';
import { RegisterInput } from '../types/RegisterInput';
import { validateRegister } from '../util/validateRegister';
import { v4 as uuid } from 'uuid';

@InputType()
class LoginInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field({ nullable: true })
  field?: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { em, req }: ContextType): Promise<User | null> {
    if (!req.session.userid) {
      return Promise.resolve(null);
    }
    return em.findOne(User, { id: { $eq: req.session.userid } });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('credentials', () => RegisterInput)
    { username, password, email }: RegisterInput,
    @Ctx() { em }: ContextType,
  ): Promise<UserResponse> {
    const errors = validateRegister({ username, password, email });
    if (errors) return { errors };

    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, { username, email, password: hashedPassword });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err instanceof UniqueConstraintViolationException) {
        const extract = /Key \((.*)\)=(?:.*)/i.exec((err as any).detail);
        let key = 'username';
        if (extract && extract.length > 1) {
          key = extract[1];
        }
        return {
          errors: [
            {
              field: key,
              message: `${key} ${
                key === 'username' ? username : email
              } already exist`,
            },
          ],
        };
      }
    }

    return {
      user,
    };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg('credentials', () => LoginInput)
    { username, password }: LoginInput,
    @Ctx() { em, req }: ContextType,
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User,
      username.includes('@')
        ? { email: { $eq: username } }
        : { username: { $eq: username } },
    );
    if (!user)
      return {
        errors: [{ field: 'username', message: "username dosen't exist" }],
      };
    const passwordVerified = await argon2.verify(user.password, password);
    if (passwordVerified) {
      req.session.userid = user.id;
      return { user };
    }
    return {
      errors: [{ field: 'password', message: 'password incorrect' }],
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: ContextType) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      }),
    );
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { em, redis }: ContextType,
  ) {
    const user = await em.findOne(User, { email: { $eq: email } });
    if (!user) return true;

    const token = uuid();

    await redis.set(
      `${FORGOT_PASSWORD_PREFIX}${token}`,
      user.id,
      'ex',
      1000 * 60 * 60,
    );

    await sendEmail(
      email,
      `<a href='http://localhost:3000/chage-password/${token}'>Change Password</a>`,
    );

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('password') password: string,
    @Ctx() { em, redis, req }: ContextType,
  ): Promise<UserResponse> {
    if (!password.length) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Please enter a password',
          },
        ],
      };
    }

    const cacheKey = `${FORGOT_PASSWORD_PREFIX}${token}`;
    const userId = await redis.get(cacheKey);

    if (!userId)
      return { errors: [{ field: 'token', message: 'Token Expired' }] };

    const user = await em.findOne(User, { id: { $eq: +userId } });

    if (!user)
      return { errors: [{ field: 'token', message: 'User no longer exist' }] };

    user.password = await argon2.hash(password);

    try {
      await em.persistAndFlush(user);
      await redis.del(cacheKey);
    } catch (err) {
      console.log(err);
      return {
        errors: [{ field: 'token', message: 'Password update failed!' }],
      };
    }

    req.session.userid = user.id;

    return { user };
  }
}
