import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

interface EmpleadoData {
	nombre: string;
	idDepartamento: number;
	contrasena: string;
	idRol: number;
}

@Controller('empleados')
export class EmpleadoController {
	constructor(private readonly empleadosService: EmpleadoService) {}

	@Get()
	@ApiOperation({ summary: 'Obtiene todos los empleados', description: 'Obtiene todos los empleados de la base de datos.' })
	@ApiResponse({ status: 200, description: 'Lista de empleados obtenida exitosamente.' })
	@ApiResponse({ status: 500, description: 'Error al obtener la lista de empleados.' })
	getEmpleados() {
		return this.empleadosService.getEmpleados();
	}

	@Post('/createEmpleado')
	@ApiOperation({ summary: 'Crea un nuevo empleado', description: 'Crea un nuevo empleado en la base de datos.' })
	@ApiResponse({ status: 201, description: 'Empleado creado exitosamente.' })
	@ApiResponse({ status: 400, description: 'Error al crear el empleado. Datos inválidos.' })
	@ApiResponse({ status: 500, description: 'Error al crear el empleado. Parámetros inválidos.' })
	createEmpleado(@Body() empleadoData: EmpleadoData ) {
		return this.empleadosService.createEmpleado(empleadoData);
	}
}
