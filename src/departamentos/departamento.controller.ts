import { Body, Controller, Get, Post } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { DepartamentoDto } from './dto/departamentos.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('departamentos')
export class DepartamentoController {
    constructor(private readonly departamentosService: DepartamentoService) {}

    @Get()
    @ApiOperation({ summary: 'Obtiene todos los departamentos', description: 'Obtiene todos los departamentos de la base de datos.' })
    @ApiResponse({ status: 200, description: 'Lista de departamentos obtenida exitosamente.' })
    @ApiResponse({ status: 500, description: 'Error al obtener la lista de departamentos.' })
    getDepartamentos() {
        return this.departamentosService.getDepartamentos();
    }

    @Post('/createDepartamento')
    @ApiOperation({ summary: 'Crea un nuevo departamento', description: 'Crea un nuevo departamento en la base de datos.' })
    @ApiResponse({ status: 201, description: 'Departamento creado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Error al crear el departamento. Datos inválidos.' })
    @ApiResponse({ status: 500, description: 'Error al crear el departamento. Parámetros inválidos.' })
    createDepartamento(@Body() departamentoData: DepartamentoDto) {
        return this.departamentosService.createDepartamento(departamentoData);
    }
}
