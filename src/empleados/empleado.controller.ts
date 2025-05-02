import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';

@Controller('empleados')
export class EmpleadoController {
	constructor(private readonly empleadosService: EmpleadoService) {}

	@Get()
	getEmpleados() {
		return this.empleadosService.getEmpleados();
	}

	@Post('/createEmpleado')
	createEmpleado(@Body() empleadoData: {
		nombre: string;
		idDepartamento: number;
		contrasena: string;
		idRol: number;
	}) {
		return this.empleadosService.createEmpleado(empleadoData);
	}
}