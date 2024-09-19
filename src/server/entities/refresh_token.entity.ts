import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity'; // 사용자 엔티티
import { Application } from './application.entity'; // 애플리케이션 엔티티

@Entity('refresh-token')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  auth_id: string; // 인증 코드 고유 ID

  @ManyToOne(() => User, (user) => user.authCodes)
  user: User; // 인증 사용자

  @ManyToOne(() => Application, (application) => application.authCodes, { onDelete: "CASCADE" })
  application: Application; // 인증 대상 애플리케이션

  @Column({ type: 'varchar', nullable: false })
  auth_code: string; // 인증 코드

  @CreateDateColumn()
  created_at: Date; // 인증 코드 생성일자

  @Column({ type: 'int', nullable: false })
  valid: number; // 인증 코드 유효 여부

  @Column({ type: 'int' })
  permission_level: number; // 인증 코드 권한 수준
}

export { User };