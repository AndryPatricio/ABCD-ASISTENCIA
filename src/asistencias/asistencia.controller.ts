import { Body, Controller, Get, Post } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaDto } from './dto/asistencias.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('asistencias')
export class AsistenciaController {
    constructor(private readonly asistenciasService: AsistenciaService) {}

    @Get()
    @ApiOperation({ summary: 'Obtiene todas las asistencias', description: 'Obtiene todas las asistencias de la base de datos.' })
    @ApiResponse({ status: 200, description: 'Lista de asistencias obtenida exitosamente.' })
    @ApiResponse({ status: 500, description: 'Error al obtener la lista de asistencias.' })
    getAsistencias() {
        return this.asistenciasService.getAsistencias();
    }
}
