import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { ActualizarAsistenciaDto, AsistenciaDto, MarcarEventoAsistenciaDto } from './dto/asistencias.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('asistencias')
export class AsistenciaController {
    constructor(private readonly asistenciasService: AsistenciaService) {}

    @Post('marcar-asistencia')
    @ApiOperation({ summary: 'Marca la asistencia de un empleado', description: 'Marca la asistencia de un empleado en la base de datos.' })
    @ApiResponse({ status: 200, description: 'Asistencia marcada exitosamente.' })
    @ApiResponse({ status: 500, description: 'Error al marcar la asistencia.' })
    marcarAsistencia(@Body() asistenciaData: MarcarEventoAsistenciaDto) {
        return this.asistenciasService.marcarAsistencia(asistenciaData);
    }

    @Get('obtener-asistencias')
    @ApiOperation({ summary: 'Obtiene todas las asistencias', description: 'Obtiene todas las asistencias de la base de datos.' })
    @ApiResponse({ status: 200, description: 'Lista de asistencias obtenida exitosamente.' })
    @ApiResponse({ status: 500, description: 'Error al obtener la lista de asistencias.' })
    getAsistencias() {
        return this.asistenciasService.getAsistencias();
    }

    @Get('obtener-asistencia-diaria')
    @ApiOperation({ summary: 'Obtiene la asistencia diaria', description: 'Obtiene la asistencia diaria de la base de datos.' })
    @ApiResponse({ status: 200, description: 'Asistencia diaria obtenida exitosamente.' })
    @ApiResponse({ status: 500, description: 'Error al obtener la asistencia diaria.' })
    getAsistenciaDiaria() {
        return this.asistenciasService.getAsistenciaDiaria();
    }

    @Delete('eliminar-asistencia/:id')
    @ApiOperation({ summary: 'Elimina una asistencia', description: 'Elimina una asistencia de la base de datos.' })
    @ApiResponse({ status: 200, description: 'Asistencia eliminada exitosamente.' })
    @ApiResponse({ status: 500, description: 'Error al eliminar la asistencia.' })
    eliminarAsistencia(@Query('id') id: number) {;
        return this.asistenciasService.eliminarAsistencia(id);
    }

    @Post('actualizar-asistencia')
    @ApiOperation({ summary: 'Actualiza una asistencia', description: 'Actualiza una asistencia en la base de datos.' })
    @ApiResponse({ status: 200, description: 'Asistencia actualizada exitosamente.' })
    @ApiResponse({ status: 500, description: 'Error al actualizar la asistencia.' })
    actualizarAsistencia(@Body() asistenciaData: ActualizarAsistenciaDto) {
        return this.asistenciasService.updateAsistencia(asistenciaData);
    }

}
