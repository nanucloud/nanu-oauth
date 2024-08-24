import { DataSource } from 'typeorm';
import { User } from '../entity/User';

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'sqlite',  
  database: 'db.sqlite', 
  entities: [User],
  synchronize: !isProduction , // 손실 가능성이 있어 개발 환경에서만 사용하게 함
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
