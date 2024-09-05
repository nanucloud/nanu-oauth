import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Application } from '../entities/application.entity';
import { AuthCode } from '../entities/auth_code.entity';
import { Permission } from '../entities/permission.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User, Application, AuthCode,Permission],
  synchronize: true,
  logging: true,
});