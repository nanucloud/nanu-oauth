import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Application } from './application.entity';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.permission_apps, { onDelete: "CASCADE" })
  permission_user: User;

  @ManyToOne(() => Application, (app) => app.permissions, { onDelete: "CASCADE" })
  permission_app: Application;

  @Column()
  permission_message: string;

  @Column({ default: false })
  permission_status: number;
}
