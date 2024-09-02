import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Application } from './application.entity';

@Entity('permission')
export class Permission {
    @OneToMany(() => User, (user) => user.user_id) //권한 사용자
    permission_user: User;

    @OneToMany(() => Application, (application) => application.app_id) //권한 애플리케이션
    permission_app: Application;

    @Column() //인증메시지
    permission_message: string;

    @Column({ type: 'boolean', default: false }) //인증상태 (TRUE : 허가,FALSE : 불허가)
    permission_status: boolean;
}