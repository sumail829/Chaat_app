import { RestaurantTable } from "./table.entity";
import { CreateTableDto } from "./dto/create-table.dto";
import { UpdateTableDto } from "./dto/update-table.dto";
import { Injectable,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TableStatus } from "./table-status.enum";

@Injectable()
export class RestaurantTableService{
    constructor(
        @InjectRepository(RestaurantTable)
        private tableRepo:Repository<RestaurantTable>,
    ){}


  create(dto: CreateTableDto) {
    const table = this.tableRepo.create(dto);
    return this.tableRepo.save(table);
  }

findall(){
    return this.tableRepo.find();
}

findAvailable(){
    return this.tableRepo.find({
        where: {status:TableStatus.AVAILABLE,isActive:true},
    });
}

update(id:string,dto:UpdateTableDto){
    return this.tableRepo.update(id,dto);
}

remove(id:string){
    return this.tableRepo.update(id,{isActive:false})
}

}