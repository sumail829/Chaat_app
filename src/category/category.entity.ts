import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,OneToMany } from "typeorm";


@Entity()
export class Category{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({unique:true})
    name:string;

    @Column({nullable:true})
    descriptiom:string;

    @Column({default:true})
    isActive:boolean

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    // @OneToMany(()=>Menu, menu=>menu.Category)
    // menu:Menu[];

}