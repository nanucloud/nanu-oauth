import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { AuthCode } from './auth_code.entity';

@Entity('application')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  app_id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  app_name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'varchar', nullable: false })
  client_key: string;

  @Column({ type: 'varchar', nullable: false })
  client_secret: string;

  @OneToMany(() => AuthCode, (authCode) => authCode.application)
  authCodes: AuthCode[];
}