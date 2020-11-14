import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';

(async () => {
  const orm = await MikroORM.init();
  await orm.getMigrator().up();

  const data = orm.em.create(Post, { title: 'hello' });
  await orm.em.persistAndFlush(data);
})();
