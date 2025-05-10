import { Body, Controller, Get, Post } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { DepartamentoData } from './dto/departamentos.dto';

@Controller('departamentos')
export class DepartamentoController {
    constructor(private readonly departamentosService: DepartamentoService) {}

    @Get()
    getDepartamentos() {
        return this.departamentosService.getDepartamentos();
    }

    @Post('/createDepartamento')
    createDepartamento(@Body() departamentoData: DepartamentoData ) {
        return this.departamentosService.createDepartamento(departamentoData);
    }
}
