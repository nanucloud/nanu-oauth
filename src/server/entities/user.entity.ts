import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { AuthCode } from './auth_code.entity';
import { Permission } from './permission.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  user_email: string;

  @Column({ type: 'varchar', nullable: false })
  user_password: string;

  @Column({ type: 'varchar', nullable: false })
  user_name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => AuthCode, (authCode) => authCode.user)
  authCodes: AuthCode[];

  @OneToMany  (() => Permission, (permission) => permission.permission_user)
  permission_apps: Permission[];
}