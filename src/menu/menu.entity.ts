import { Entity, PrimaryGeneratedColumn, Column ,CreateDateColumn, UpdateDateColumn,OneToMany ,ManyToOne} from 'typeorm';
import { Category } from '../category/category.entity';

@Entity()
export class Menu{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({ unique:true })
    name: string;

    @Column({ nullable:true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ default:true })
    isAvailable: boolean;

    @ManyToOne(() => Category, category => category.menus, {
    onDelete: 'CASCADE',
    })
    category: Category;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
