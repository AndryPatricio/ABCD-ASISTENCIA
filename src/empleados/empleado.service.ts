import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EmpleadoDto, LoginEmpleadoDto } from './dto/empleados.dto';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';

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
		
		if (empleado === null) {
			return response.status(401).json({
				message: 'Error de autenticación. Usuario o contraseña incorrectos.',
			});
		}

		const jwtToken = process.env.JWT_SECRET as string;

		const payload = {
			id_empleado: empleado.id_empleado,
			nombre: empleado.nombre,
			id_departamento: empleado.id_departamento,
			id_rol: empleado.id_rol,
		}

		const token = jwt.sign(payload, jwtToken)

		return response.status(200).json({
			message: 'Inicio de sesión exitoso.',
			data: {
				token: token,
			},
		});	
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
