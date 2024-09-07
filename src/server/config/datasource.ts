import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Application } from '../entities/application.entity';
import { RefreshToken } from '../entities/refresh_token.entity';
import { Permission } from '../entities/permission.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User, Application, RefreshToken,Permission],
  synchronize: true,
  logging: true,
});