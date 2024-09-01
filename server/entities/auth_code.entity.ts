import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Application } from './application.entity';

@Entity('auth_code')
export class AuthCode {
  @PrimaryGeneratedColumn('uuid') //인증코드 고유 ID
  auth_id: string;

  @ManyToOne(() => User, (user) => user.authCodes) //인증 사용자
  user: User;

  @ManyToOne(() => Application, (application) => application.authCodes) //인증대상 애플리케이션
  application: Application;

  @Column({ type: 'varchar', nullable: false }) //인증코드 Key명
  auth_code: string;

  @CreateDateColumn({ type: 'timestamp' }) //인증코드 생성 시간
  created_at: Date;

  @Column({ type: 'bool', nullable: false }) //인증코드 상태
  vaild: boolean;

  @Column({type:'int'}) //인증코드 부여 권한
  permission_level: number;
}