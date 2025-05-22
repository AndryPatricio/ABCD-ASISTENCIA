import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ActualizarEmpleadoDto, EliminarEmpleadoDto, EmpleadoDto, LoginEmpleadoDto } from './dto/empleados.dto';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmpleadoService {
	constructor(private prisma: PrismaService) {}
	
	async getEmpleados() {
		return this.prisma.empleado.findMany({
			include: {
				Departamento: true,
				Rol: true,
				Horario: {
					include: {
						Dia: true,
					}
				}
			},
			where: {
				fecha_eliminacion: null,
			},
			omit: {
				contrasena: true,
			}
		});
	}

	async login(empleadoData: LoginEmpleadoDto, response: Response) {
		const empleado = await this.prisma.empleado.findFirst({
			where: {
				id_empleado: empleadoData.numeroEmpleado,
				AND: {
					fecha_eliminacion: null,
				}
			},
		});

		console.log({
			empleadoData,
			empleado,
		})

		const comparePassword = await bcrypt.compare(empleadoData.contrasena, empleado?.contrasena || '');

		if(!comparePassword) {
			return response.status(401).json({
				message: 'Error de autenticación. Usuario o contraseña incorrectos.',
			});
		}
		
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

	async createEmpleado(empleadoData: EmpleadoDto, response: Response) {
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(empleadoData.contrasena, saltRounds);

		try {
			const empleado = await this.prisma.empleado.create({
				data: {
					nombre: empleadoData.nombre,
					id_departamento: empleadoData.idDepartamento,
					contrasena: hashedPassword,
					id_rol: empleadoData.idRol,
				},
			});

			const dias = await this.prisma.dia.findMany();

			await this.prisma.horario.createMany({
				data: [
					{
						id_empleado: empleado.id_empleado,
						id_dia: dias[0].id_dia,
						laborable: empleadoData.diasLaborales.lunes.laborable,
						hora_entrada_estandar: this.obtenerHoras(empleadoData.diasLaborales.lunes.hora_entrada),
						hora_salida_estandar: this.obtenerHoras(empleadoData.diasLaborales.lunes.hora_salida),
					},
					{
						id_empleado: empleado.id_empleado,
						id_dia: dias[1].id_dia,
						laborable: empleadoData.diasLaborales.martes.laborable,
						hora_entrada_estandar: this.obtenerHoras(empleadoData.diasLaborales.martes.hora_entrada),
						hora_salida_estandar: this.obtenerHoras(empleadoData.diasLaborales.martes.hora_salida),
					},
					{
						id_empleado: empleado.id_empleado,
						id_dia: dias[2].id_dia,
						laborable: empleadoData.diasLaborales.miercoles.laborable,
						hora_entrada_estandar: this.obtenerHoras(empleadoData.diasLaborales.miercoles.hora_entrada),
						hora_salida_estandar: this.obtenerHoras(empleadoData.diasLaborales.miercoles.hora_salida),
					},
					{
						id_empleado: empleado.id_empleado,
						id_dia: dias[3].id_dia,
						laborable: empleadoData.diasLaborales.jueves.laborable,
						hora_entrada_estandar: this.obtenerHoras(empleadoData.diasLaborales.jueves.hora_entrada),
						hora_salida_estandar: this.obtenerHoras(empleadoData.diasLaborales.jueves.hora_salida),
					},
					{
						id_empleado: empleado.id_empleado,
						id_dia: dias[4].id_dia,
						laborable: empleadoData.diasLaborales.viernes.laborable,
						hora_entrada_estandar: this.obtenerHoras(empleadoData.diasLaborales.viernes.hora_entrada),
						hora_salida_estandar: this.obtenerHoras(empleadoData.diasLaborales.viernes.hora_salida),
					},
					{
						id_empleado: empleado.id_empleado,
						id_dia: dias[5].id_dia,
						laborable: empleadoData.diasLaborales.sabado.laborable,
						hora_entrada_estandar: this.obtenerHoras(empleadoData.diasLaborales.sabado.hora_entrada),
						hora_salida_estandar: this.obtenerHoras(empleadoData.diasLaborales.sabado.hora_salida),
					},
					{
						id_empleado: empleado.id_empleado,
						id_dia: dias[6].id_dia,
						laborable: empleadoData.diasLaborales.domingo.laborable,
						hora_entrada_estandar: this.obtenerHoras(empleadoData.diasLaborales.domingo.hora_entrada),
						hora_salida_estandar: this.obtenerHoras(empleadoData.diasLaborales.domingo.hora_salida),
					}
				]
			})

			return response.status(201).json({
				message: 'Empleado creado exitosamente.',
				data: empleado,
			});
		} catch (error) {
			console.log(error);
			return response.status(500).json({
				message: 'Error al crear el empleado. Parámetros inválidos.',
			});
		}
	}

	obtenerHoras = (hora: string) => {
		let [horas, minutos] = hora.split(':').map(Number);

		if (isNaN(horas) || isNaN(minutos)) {
			horas = 0;
			minutos = 0;
		}

		const soloHora = new Date(Date.UTC(1970, 0, 1, horas, minutos));

		return soloHora;
	}

	async updateEmpleado(empleadoData: ActualizarEmpleadoDto, response: Response) {
		const empleado = await this.prisma.empleado.update({
			where: {
				id_empleado: empleadoData.idEmpleado,
			},
			data: {
				nombre: empleadoData.nombre,
				id_departamento: empleadoData.idDepartamento,
				id_rol: empleadoData.idRol,
			},
			include: {
				Horario: true,
			}
		});

		const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

		empleado.Horario.forEach(async (horario, index) => {
			await this.prisma.horario.update({
				where: {
					id_horario: horario.id_horario,
				},
				data: {
					laborable: empleadoData.diasLaborales[dias[index]].laborable,
					hora_entrada_estandar: this.obtenerHoras(empleadoData.diasLaborales[dias[index]].hora_entrada),
					hora_salida_estandar: this.obtenerHoras(empleadoData.diasLaborales[dias[index]].hora_salida),
				}
			})
		})

		if (empleadoData.contrasena) {
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(empleadoData.contrasena, saltRounds);

			await this.prisma.empleado.update({
				where: {
					id_empleado: empleadoData.idEmpleado,
				},
				data: {
					contrasena: hashedPassword,
				},
			});
		}
		
		
		return response.status(200).json({
			message: 'Empleado actualizado exitosamente.',
			data: empleado,
		});
	}

	async deleteEmpleado(empleadoData: EliminarEmpleadoDto, response: Response) {
		const empleado = await this.prisma.empleado.update({
			where: {
				id_empleado: empleadoData.idEmpleado,
			},
			data: {
				fecha_eliminacion: new Date(),
			},
		});

		return response.status(200).json({
			message: 'Empleado eliminado exitosamente.',
			data: empleado,
		});
	}
}
