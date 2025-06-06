import { Body, Controller, Delete, Get, Post, Res } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { ActualizarEmpleadoDto, EliminarEmpleadoDto, EmpleadoDto, LoginEmpleadoDto } from './dto/empleados.dto';
// import { LoginResponseDto } from 'src/responses/response.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginResponseDto } from 'src/responses/response.dto';

@Controller('empleados')
export class EmpleadoController {
	constructor(private readonly empleadosService: EmpleadoService) {}

	@Get('/siguienteId')
	@ApiOperation({ summary: 'Obtiene el siguiente ID de empleado', description: 'Obtiene el siguiente ID de empleado disponible en la base de datos.' })
	@ApiResponse({ status: 200, description: 'Siguiente ID de empleado obtenido exitosamente.' })
	@ApiResponse({ status: 500, description: 'Error al obtener el siguiente ID de empleado.' })
	getSiguienteId() {
		return this.empleadosService.getSiguienteId();
	}

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

	@Post('/updateEmpleado')
	@ApiOperation({ summary: 'Actualiza un empleado', description: 'Actualiza un empleado en la base de datos.' })
	@ApiResponse({ status: 200, description: 'Empleado actualizado exitosamente.', type: EmpleadoDto })
	@ApiResponse({ status: 400, description: 'Error al actualizar el empleado. Datos inválidos.', schema: { example: { message: 'Error al actualizar el empleado. Datos inválidos.' } } })
	@ApiResponse({ status: 500, description: 'Error al actualizar el empleado. Parámetros inválidos.' })
	updateEmpleado(@Body() empleadoData: ActualizarEmpleadoDto, @Res() response: Response) {
		return this.empleadosService.updateEmpleado(empleadoData, response);
	}

	@Delete('/deleteEmpleado')
	@ApiOperation({ summary: 'Elimina un empleado', description: 'Elimina un empleado de la base de datos.' })
	@ApiResponse({ status: 200, description: 'Empleado eliminado exitosamente.', type: EliminarEmpleadoDto })
	@ApiResponse({ status: 400, description: 'Error al eliminar el empleado. Datos inválidos.', schema: { example: { message: 'Error al eliminar el empleado. Datos inválidos.' } } })
	@ApiResponse({ status: 500, description: 'Error al eliminar el empleado. Parámetros inválidos.' })
	deleteEmpleado(@Body() empleadoData: EliminarEmpleadoDto, @Res() response: Response) {
		return this.empleadosService.deleteEmpleado(empleadoData, response);
	}
}
