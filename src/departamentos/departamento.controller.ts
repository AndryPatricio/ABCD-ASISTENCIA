import { Body, Controller, Get, Post } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';

@Controller('departamentos')
export class DepartamentoController {
    constructor(private readonly departamentosService: DepartamentoService) {}

    @Get()
    getDepartamentos() {
        return this.departamentosService.getDepartamentos();
    }

    @Post('/createDepartamento')
    createDepartamento(@Body() departamentoData: {
        nombre: string;
        idDepartamento: number;
    }) {
        return this.departamentosService.createDepartamento(departamentoData);
    }
}
