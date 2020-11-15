import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Request, Response } from 'express';

export type ContextType = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: Express.Session }
  res: Response;
};
