import { Controller,Get,Post,Patch,Delete,Param,Body } from '@nestjs/common'
import { RestaurantTableService } from './table.service'
import { CreateTableDto } from './dto/create-table.dto'
import { UpdateTableDto } from './dto/update-table.dto'

@Controller('tables')
export class TableController{
    constructor(private readonly tableService: RestaurantTableService){}

    @Post()
    create(@Body() dto:CreateTableDto){
        return this.tableService.create(dto)
    }

    @Get()
    findAll(){
        return this.tableService.findall()
    }

    @Get('available')
    findAvailable(){
        return this.tableService.findAvailable();
    }

    @Patch(':id')
    update(@Param('id') id:string,@Body() dto:UpdateTableDto){
        return this.tableService.update(id,dto);
    }

    @Delete(':id')
    remove(@Param('id') id:string){
        return this.tableService.remove(id);
    }


}

