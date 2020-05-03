import { Connection } from 'mongoose';
import { UserSchema } from './schemas/user.schemas';
import { CourseSchema } from './schemas/course.schema';
import { WorkerPool } from 'pool-worker-threads';

export const usersProviders = [
  {
    provide: 'USER_MODEL',
    inject: ['DATABASE_CONNECTION'],
    useFactory: (connection: Connection) => connection.model('user', UserSchema)
  },
  {
    provide: 'COURSE_MODEL',
    inject: ['DATABASE_CONNECTION'],
    useFactory: (connection: Connection) => connection.model('cours', CourseSchema)
  },
  {
    provide:'POOL_WORKERS',
    useFactory: ():WorkerPool => {
      const pool = new WorkerPool(4, true);
      process.addListener("exit", () => {
        pool.destroy();
      });
      return pool;
    }
  }
];