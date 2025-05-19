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

	
}
