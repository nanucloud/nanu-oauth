import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Application } from './application.entity';

@Entity('permission')
export class Permission {
    @OneToMany(() => User, (user) => user.user_id)
    permission_user: User;

    @OneToMany(() => Application, (application) => application.app_id)
    permission_app: Application;

    @Column()
    permission_method: string;

    @Column({ type: 'boolean', default: false })
    permission_stats: boolean;
}