import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';

export type ContextType = {
  em: EntityManager<IDatabaseDriver<Connection>>;
};
