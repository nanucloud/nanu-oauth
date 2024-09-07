import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RefreshToken } from './refresh_token.entity'; // 인증 코드 엔티티
import { Permission } from './permission.entity'; // 권한 엔티티
import { Application } from './application.entity'; // 애플리케이션 엔티티

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string; // 사용자 고유 ID

  @Column({ type: 'varchar', unique: true, nullable: false })
  user_email: string; // 사용자 이메일

  @Column({ type: 'varchar', nullable: false })
  user_password: string; // 사용자 비밀번호

  @Column({ type: 'varchar', nullable: false })
  user_name: string; // 사용자 이름

  @CreateDateColumn()
  created_at: Date; // 사용자 생성일자

  @UpdateDateColumn()
  updated_at: Date; // 사용자 업데이트 일자

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  authCodes: RefreshToken[]; // 사용자의 인증 코드들

  @OneToMany(() => Permission, (permission) => permission.permission_user)
  permission_apps: Permission[]; // 사용자의 권한들

  @OneToMany(() => Application, (application) => application.app_owner)
  ownedApplications: Application[]; // 사용자가 소유한 애플리케이션들
}
