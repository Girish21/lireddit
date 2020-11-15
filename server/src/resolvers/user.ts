import { UniqueConstraintViolationException } from '@mikro-orm/core';
import * as argon2 from 'argon2';
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
import { User } from '../entities/User';
import { ContextType } from '../types';

@InputType()
class UsernamePasswordInput {
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
    @Arg('credentials', () => UsernamePasswordInput)
    { username, password }: UsernamePasswordInput,
    @Ctx() { em }: ContextType,
  ): Promise<UserResponse> {
    if (!username.length) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Please enter a username',
          },
        ],
      };
    }
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

    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, { username, password: hashedPassword });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err instanceof UniqueConstraintViolationException) {
        return {
          errors: [
            {
              field: 'username',
              message: `username ${username} already exist`,
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
    @Arg('credentials', () => UsernamePasswordInput)
    { username, password }: UsernamePasswordInput,
    @Ctx() { em, req }: ContextType,
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: { $eq: username } });
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
}
