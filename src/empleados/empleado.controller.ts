import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';

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
	getEmpleados() {
		return this.empleadosService.getEmpleados();
	}

	@Post('/createEmpleado')
	createEmpleado(@Body() empleadoData: EmpleadoData ) {
		return this.empleadosService.createEmpleado(empleadoData);
	}
}
