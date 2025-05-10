import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { EmpleadoData } from './dto/empleados.dto';

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
