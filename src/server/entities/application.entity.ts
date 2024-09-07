import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { RefreshToken } from './refresh_token.entity'; // 인증 코드 엔티티
import { User } from './user.entity'; // 사용자 엔티티
import { Permission } from './permission.entity'; // 권한 엔티티

@Entity('application')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  app_id: string; // 애플리케이션 고유 ID

  @Column({ type: 'varchar', nullable: false, unique: true })
  app_name: string; // 애플리케이션 이름

  @ManyToOne(() => User, (user) => user.ownedApplications)
  app_owner: User; // 애플리케이션 소유자

  @CreateDateColumn()
  created_at: Date; // 애플리케이션 생성일자

  @UpdateDateColumn()
  updated_at: Date; // 애플리케이션 업데이트 일자

  @Column({ type: 'varchar', nullable: false })
  client_key: string; // 애플리케이션 클라이언트 키

  @Column({ type: 'varchar', nullable: false })
  client_secret: string; // 애플리케이션 비밀 키

  @Column({ type: 'int', nullable: false ,default:0 })
  permission_mode: number; // 애플리케이션 보안 모드 (0:비보호 / 1:권한유저만 인증)

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.application)
  authCodes: RefreshToken[]; // 애플리케이션의 인증 코드들

  @OneToMany(() => Permission, (permission) => permission.permission_app)
  permissions: Permission[]; // 애플리케이션의 권한들
}
