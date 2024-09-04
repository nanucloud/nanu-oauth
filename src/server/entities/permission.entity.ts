import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Application } from './application.entity';

@Entity('permission')
export class Permission {
    @PrimaryGeneratedColumn() // 기본 키(primary key)
    id: number;

    @ManyToOne(() => User, user => user.permission_apps) // 사용자와의 관계 설정
    permission_user: User;

    @ManyToOne(() => Application, app => app.permission) // 애플리케이션과의 관계 설정
    permission_app: Application;

    @Column() // 인증 메시지
    permission_message: string;

    @Column({ type: 'boolean', default: false }) // 인증 상태 (TRUE: 허가, FALSE: 불허가)
    permission_status: boolean;
}
