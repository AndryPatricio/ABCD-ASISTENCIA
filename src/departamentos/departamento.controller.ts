import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
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

    @Post('/updateDepartamento')
    @ApiOperation({ summary: 'Actualiza un departamento existente', description: 'Actualiza un departamento existente en la base de datos.' })
    @ApiResponse({ status: 200, description: 'Departamento actualizado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Error al actualizar el departamento. Datos inválidos.' })
    @ApiResponse({ status: 500, description: 'Error al actualizar el departamento. Parámetros inválidos.' })
    updateDepartamento(@Body() departamentoData: DepartamentoDto) {
        return this.departamentosService.updateDepartamento(departamentoData.idDepartamento, departamentoData);
    }

    @Delete('/deleteDepartamento')
    @ApiOperation({ summary: 'Elimina un departamento existente', description: 'Elimina un departamento existente en la base de datos.' })
    @ApiResponse({ status: 200, description: 'Departamento eliminado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Error al eliminar el departamento. Datos inválidos.' })
    @ApiResponse({ status: 500, description: 'Error al eliminar el departamento. Parámetros inválidos.' })
    deleteDepartamento(@Body() departamentoData: DepartamentoDto) {
        return this.departamentosService.deleteDepartamento(departamentoData.idDepartamento);
    }
}
