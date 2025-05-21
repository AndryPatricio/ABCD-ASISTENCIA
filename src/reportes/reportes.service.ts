import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReportesService {
	constructor(private prisma: PrismaService) {}
	
	// El siguiente endpoitn obtiene las asistencias por departamento agrupados por mes
	async getAsistenciasPorDepartamento() {
		const meses = [
			'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
			'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
		];

		const turnosCompletos = await this.prisma.turnoCompleto.findMany({
			include: {
				Empleado: {
					include: {
						Departamento: true,
					},
					omit: {
						contrasena: true,
					}
				}
			}
		});

		const asistenciaPorAnioMesDepartamento = {};

		for (const turno of turnosCompletos) {
			const fecha = new Date(turno.fecha_inicio);
			const anio = fecha.getFullYear();
			const mes = meses[fecha.getMonth()]; // Índice del mes (0-11)
			const departamento = turno.Empleado.Departamento.nombre;

			// Inicializar estructura si no existe
			if (!asistenciaPorAnioMesDepartamento[anio]) {
				asistenciaPorAnioMesDepartamento[anio] = {};
			}

			if (!asistenciaPorAnioMesDepartamento[anio][mes]) {
				asistenciaPorAnioMesDepartamento[anio][mes] = {};
			}

			if (!asistenciaPorAnioMesDepartamento[anio][mes][departamento]) {
				asistenciaPorAnioMesDepartamento[anio][mes][departamento] = 0;
			}

			if(turno.fecha_fin === null){
				// Si la fecha de fin es null, no se cuenta como asistencia
				continue;
			}

			if(new Date(turno.fecha_inicio).getTime() === new Date(turno.fecha_fin).getTime()){
				// Si la fecha de inicio y fin son iguales, no se cuenta como asistencia
				continue;
			}

			// Incrementar asistencia
			asistenciaPorAnioMesDepartamento[anio][mes][departamento]++;
		}



		return asistenciaPorAnioMesDepartamento;
	}

	async getFaltasYRetardosPorMes() {
		const meses = [
			'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
			'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
		];

		const turnosCompletos = await this.prisma.turnoCompleto.findMany({
			include: {
				Empleado: {
					include: {
						Departamento: true,
					},
					omit: {
						contrasena: true,
					}
				}
			}
		});

		const faltasYRetardosPorAnioMes = {};

		for (const turno of turnosCompletos) {
			const fecha = new Date(turno.fecha_inicio);
			const anio = fecha.getFullYear();
			const mes = meses[fecha.getMonth()];

			if (!faltasYRetardosPorAnioMes[anio]) {
				faltasYRetardosPorAnioMes[anio] = {};
			}

			if (!faltasYRetardosPorAnioMes[anio][mes]) {
				faltasYRetardosPorAnioMes[anio][mes] = {
					faltas: 0,
					retardos: 0
				};
			}

			if(turno.fecha_fin === null){
				// Si la fecha de fin es null, no se cuenta como falta o retardo
				continue;
			}

			// Verificar falta
			const esFalta = new Date(turno.fecha_inicio).getTime() === new Date(turno.fecha_fin).getTime();
			if (esFalta) {
				faltasYRetardosPorAnioMes[anio][mes].faltas++;
			}

			// Verificar retardo
			if (turno.minutos_retardo > 0) {
				faltasYRetardosPorAnioMes[anio][mes].retardos++;
			}
		}

		return faltasYRetardosPorAnioMes;
	}

	async getFaltasPorEmpleado() {
		const turnosCompletos = await this.prisma.turnoCompleto.findMany({
			include: {
				Empleado: {
					include: {
						Departamento: true,
					},
					omit: {
						contrasena: true,
					}
				}
			}
		});

		const faltasPorEmpleado = {};

		for (const turno of turnosCompletos) {
			const empleadoId = turno.Empleado.id_empleado;
			const empleadoNombre = `${turno.Empleado.nombre}`;

			if (!faltasPorEmpleado[empleadoId]) {
				faltasPorEmpleado[empleadoId] = {
					nombre: empleadoNombre,
					faltas: 0
				};
			}

			if(turno.fecha_fin === null){
				// Si la fecha de fin es null, no se cuenta como falta
				continue;
			}

			const esFalta = new Date(turno.fecha_inicio).getTime() === new Date(turno.fecha_fin).getTime();
			if (esFalta) {
				faltasPorEmpleado[empleadoId].faltas++;
			}
		}

		return faltasPorEmpleado;
	}

	async getDistribucionHorarios() {
		const horarios = await this.prisma.horario.findMany({
			include: {
				Empleado: {
					omit: {
						contrasena: true
					}
				}
			},
			where: { laborable: true }
		});

		const distribucion = {};

		function formatearHora(dateObj) {
			const hora = new Date(dateObj).getUTCHours();
			const minutos = new Date(dateObj).getUTCMinutes();
			return `${hora}:${minutos.toString().padStart(2, '0')}`;
		}

		for (const h of horarios) {
			const entrada = formatearHora(h.hora_entrada_estandar);
			const salida = formatearHora(h.hora_salida_estandar);

			const rango = `${entrada}-${salida}`;

			if (!distribucion[rango]) {
				distribucion[rango] = 0;
			}
			distribucion[rango]++;
		}

		return distribucion;
	}
}
