import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmpleadoService {
	constructor(private prisma: PrismaService) {}
	
	async getEmpleados() {
		return this.prisma.empleado.findMany();
	}

	async createEmpleado(empleadoData: {
		nombre: string;
		idDepartamento: number;
		contrasena: string;
		idRol: number;
	}) {
		return this.prisma.empleado.create({
			data: {
				nombre: empleadoData.nombre,
				id_departamento: empleadoData.idDepartamento,
				contrasena: empleadoData.contrasena,
				id_rol: empleadoData.idRol,
			},
		});
	}
}