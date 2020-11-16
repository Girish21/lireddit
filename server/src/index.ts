import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import redis from 'redis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { COOKIE_NAME, __prod__ } from './constants';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/posts';
import { UserResolver } from './resolvers/user';
import { ContextType } from './types';

const main = async () => {
  const orm = await MikroORM.init();
  await orm.getMigrator().up();

  const app = express();

  app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

  const RedisStore = connectRedis(session);
  const RedisClient = redis.createClient();
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: RedisClient,
        ttl: 14 * 24 * 60 * 60 * 1000,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: __prod__,
        sameSite: 'lax',
      },
      secret: 'my strong secret',
      saveUninitialized: false,
      resave: false,
    }),
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): ContextType => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log('server started in port 4000');
  });
};

if (process.env.EXECUTE) main().catch((e) => console.log(e));
