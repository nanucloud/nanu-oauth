import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Application } from './application.entity';
import { Scope } from './scope.entity';

@Entity('auth_code')
export class AuthCode {
  @PrimaryGeneratedColumn('uuid')
  auth_id: string;

  @ManyToOne(() => User, (user) => user.authCodes)
  user: User;

  @ManyToOne(() => Application, (application) => application.authCodes)
  application: Application;

  @ManyToOne(() => Scope, (scope) => scope.authCodes)
  scope: Scope;

  @Column({ type: 'bigint', nullable: false })
  auth_code: number;

  @Column({ type: 'time', nullable: false })
  expires_at: string;
}
