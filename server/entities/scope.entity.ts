import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from './application.entity';
import { AuthCode } from './auth_code.entity';

@Entity('scope')
export class Scope {
  @PrimaryGeneratedColumn('increment')
  scope_id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  scope_name: string;

  @Column({ type: 'varchar', nullable: false })
  scope_info: string;

  @OneToMany(() => Application, (application) => application.scope)
  applications: Application[];

  @OneToMany(() => AuthCode, (authCode) => authCode.scope)
  authCodes: AuthCode[];
}