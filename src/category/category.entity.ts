import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,OneToMany } from "typeorm";
import { Menu } from '../menu/menu.entity'

@Entity()
export class Category{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({unique:true})
    name:string;

    @Column({nullable:true})
    description:string;

    @Column({default:true})
    isActive:boolean

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @OneToMany(()=>Menu, menu=>menu.category)
    menus:Menu[];

}