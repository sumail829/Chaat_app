import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from './dto/create-user.dto';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;


  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole; // ✅ MUST be here
}
