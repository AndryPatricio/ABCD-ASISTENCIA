import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ActualizarEmpleadoDto, EliminarEmpleadoDto, EmpleadoDto, LoginEmpleadoDto } from './dto/reportes.dto';
// import { LoginResponseDto } from 'src/responses/response.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginResponseDto } from 'src/responses/response.dto';

@Controller('reportes')
export class ReportesController {
	constructor(private readonly empleadosService: ReportesService) {}

	@ApiOperation({ summary: 'Obtener asistencias por departamento agrupados por mes' })
	@ApiResponse({ status: 200, description: 'Asistencias obtenidas correctamente' })
	@Get('asistencias-por-departamento')
	async getAsistenciasPorDepartamento(@Res() res: Response) {
		const turnosCompletos = await this.empleadosService.getAsistenciasPorDepartamento();
		return res.status(200).json(turnosCompletos);
	}
	
	@ApiOperation({ summary: 'Obtener faltas y retardos por mes' })
	@ApiResponse({ status: 200, description: 'Faltas y retardos obtenidos correctamente' })
	@Get('faltas-y-retardos-por-mes')
	async getFaltasYRetardosPorMes(@Res() res: Response) {
		const turnosCompletos = await this.empleadosService.getFaltasYRetardosPorMes();
		return res.status(200).json(turnosCompletos);
	}

	@ApiOperation({ summary: 'Obtener asistencias por empleado agrupados por mes' })
	@ApiResponse({ status: 200, description: 'Asistencias obtenidas correctamente' })
	@Get('asistencias-por-empleado')
	async getAsistenciasPorEmpleado(@Res() res: Response) {
		const turnosCompletos = await this.empleadosService.getFaltasPorEmpleado();
		return res.status(200).json(turnosCompletos);
	}

	@ApiOperation({ summary: 'Obtener distribución de horarios de entrada y salida' })
	@ApiResponse({ status: 200, description: 'Distribución de horarios obtenida correctamente' })
	@Get('distribucion-horarios')
	async getDistribucionHorarios(@Res() res: Response) {
		const turnosCompletos = await this.empleadosService.getDistribucionHorarios();
		return res.status(200).json(turnosCompletos);
	}
}
