import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { EmpleadoDto, LoginEmpleadoDto } from './dto/empleados.dto';
// import { LoginResponseDto } from 'src/responses/response.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginResponseDto } from 'src/responses/response.dto';

@Controller('empleados')
export class EmpleadoController {
	constructor(private readonly empleadosService: EmpleadoService) {}

	@Get()
	@ApiOperation({ summary: 'Obtiene todos los empleados', description: 'Obtiene todos los empleados de la base de datos.' })
	@ApiResponse({ status: 200, description: 'Lista de empleados obtenida exitosamente.' })
	@ApiResponse({ status: 500, description: 'Error al obtener la lista de empleados.' })
	@ApiBearerAuth()
	getEmpleados() {
		return this.empleadosService.getEmpleados();
	}

	@Post('/login')
	@ApiOperation({ summary: 'Inicia sesión', description: 'Inicia sesión con el nombre de usuario y contraseña.' })
	@ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.', type: LoginResponseDto })
	@ApiResponse({ status: 401, description: 'Error de autenticación. Usuario o contraseña incorrectos.', schema: { example: { message: 'Error de autenticación. Usuario o contraseña incorrectos.' } } })
	@ApiResponse({ status: 500, description: 'Error al iniciar sesión. Parámetros inválidos.' })
	login(@Body() loginData: LoginEmpleadoDto, @Res() response: Response) {
		return this.empleadosService.login(loginData, response);
	}


	@Post('/createEmpleado')
	@ApiOperation({ summary: 'Crea un nuevo empleado', description: 'Crea un nuevo empleado en la base de datos.' })
	@ApiResponse({ status: 201, description: 'Empleado creado exitosamente.', type: EmpleadoDto })
	@ApiResponse({ status: 400, description: 'Error al crear el empleado. Datos inválidos.', schema: { example: { message: 'Error al crear el empleado. Datos inválidos.' } } })
	@ApiResponse({ status: 500, description: 'Error al crear el empleado. Parámetros inválidos.' })
	createEmpleado(@Body() empleadoData: EmpleadoDto, @Res() response: Response ) {
		return this.empleadosService.createEmpleado(empleadoData, response);
	}
}
