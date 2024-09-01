import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { AuthCode } from './auth_code.entity';
import { Permission } from './permission.entity';

@Entity('application')
export class Application {
  @PrimaryGeneratedColumn('uuid') //애플리케이션 고유 ID
  app_id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })  //애플리케이션 이름
  app_name: string;

  @CreateDateColumn({ type: 'timestamp' }) // 애플리케이션 생성일자
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' }) //애플리케이션 설정 업데이트 일자
  updated_at: Date;

  @Column({ type: 'varchar', nullable: false }) //애플리케이션 클라이언트 키
  client_key: string;

  @Column({ type: 'varchar', nullable: false }) //애플리케이션 개인 키
  client_secret: string;

  @OneToMany(() => AuthCode, (authCode) => authCode.application) //애플리케이션 인증코드 외래키
  authCodes: AuthCode[];

  @OneToMany(() => Permission, (permission) => permission.permission_app) //애플리케이션 권한 목록
  permissionApps: Permission[];
}