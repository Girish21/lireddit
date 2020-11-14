import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import * as path from 'path';

export default {
  entities: [Post],
  dbName: 'lireddit',
  type: 'postgresql',
  user: 'postgres',
  debug: !__prod__,
  port: 5432,
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[jt]s$/,
  },
} as Parameters<typeof MikroORM.init>[0];
