import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EmpleadoDto, LoginEmpleadoDto } from './dto/empleados.dto';
import { Response } from 'express';

@Injectable()
export class EmpleadoService {
	constructor(private prisma: PrismaService) {}
	
	async getEmpleados() {
		return this.prisma.empleado.findMany();
	}

	async login(empleadoData: LoginEmpleadoDto, response: Response) {
		const empleado = await this.prisma.empleado.findFirst({
			where: {
				id_empleado: empleadoData.numeroEmpleado,
				contrasena: empleadoData.contrasena,
				AND: {
					fecha_eliminacion: null,
				}
			},
		});
		
		if (!empleado) {
			return response.status(401).json({
				message: 'Error de autenticación. Usuario o contraseña incorrectos.',
			});
		}

		console.log({ empleado })

		return response.status(200).json({
			message: 'Inicio de sesión exitoso.',
			empleado: {
				id_empleado: empleado.id_empleado,
				nombre: empleado.nombre,
				id_departamento: empleado.id_departamento,
				id_rol: empleado.id_rol,
			},
		});
		
		// return empleado;
	}

	async createEmpleado(empleadoData: EmpleadoDto) {
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