import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id : string;

  @Column()
  user_email:string;

  @Column()
  user_password:string;

  @Column()
  user_name:string;

  @CreateDateColumn()
  created_at:Date;
}