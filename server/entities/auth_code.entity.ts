import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Application } from './application.entity';

@Entity('auth_code')
export class AuthCode {
  @PrimaryGeneratedColumn('uuid')
  auth_id: string;

  @ManyToOne(() => User, (user) => user.authCodes)
  user: User;

  @ManyToOne(() => Application, (application) => application.authCodes)
  application: Application;

  @Column({ type: 'varchar', nullable: false })
  auth_code: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'bool', nullable: false })
  vaild: boolean;

  @Column({type:'int'})
  permission_level: number;
}