import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AdvertenciaService } from './advertencia.service';
import { AdvertenciaDto } from './dto/advertencias.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('advertencias')
export class AdvertenciaController {
    constructor(private readonly advertenciasService: AdvertenciaService) {}

    @Get()
    @ApiOperation({ summary: 'Obtiene todos las advertencias del empleado', description: 'Obtiene todas las advertencias del empleado de la base de datos.' })
    @ApiResponse({ status: 200, description: 'Lista de advertencias obtenida exitosamente.' })
    @ApiResponse({ status: 500, description: 'Error al obtener la lista de advertencias.' })
    getAdvertencias(@Query() empleadoData: AdvertenciaDto) {
        return this.advertenciasService.getAdvertencias(empleadoData);
    }
}
