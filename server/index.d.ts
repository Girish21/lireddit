import { User } from './src/entities/User';

declare global {
  namespace Express {
    interface Session {
      userid?: number;
    }
  }
}
