import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ActualizarAsistenciaDto, AsistenciaDto, MarcarEventoAsistenciaDto } from './dto/asistencias.dto';

@Injectable()
export class AsistenciaService {
    constructor(private prisma: PrismaService) {}

    async marcarAsistencia(asistenciaData: MarcarEventoAsistenciaDto) {
        let empleadoId = +asistenciaData.idEmpleado;
        let tipoEvento = 1;

        if (isNaN(empleadoId)) {
            throw new Error('El ID del empleado no es un número válido: ' + asistenciaData.idEmpleado);
        }

        const ultimaAsistencia = await this.obtenerUltimaAsistenciaPorIdEmpleado(asistenciaData.idEmpleado);
        const horario = await this.obtenerHorarioPorIdEmpleado(asistenciaData.idEmpleado);

        if (!horario) {
            throw new Error('No se encontró el horario para el empleado con ID: ' + asistenciaData.idEmpleado);
        }

        tipoEvento = ultimaAsistencia ? ultimaAsistencia.tipo_evento + 1 : 1;

        console.log({ ultimaAsistencia, tipoEvento })

        if(tipoEvento > 4) tipoEvento = 1;

        const date = new Date();
        date.setHours(date.getHours() - 6);

        const asistencia = await this.prisma.eventoAsistencia.create({
            data: {
                id_empleado: asistenciaData.idEmpleado,
                fecha_hora: date,
                tipo_evento: tipoEvento,
            },
        });

        return asistencia;
    }

    async getAsistencias() {
        return this.prisma.eventoAsistencia.findMany({
            include: { Empleado: { select: { id_empleado: true } } },
            where: {
                Empleado: {
                    fecha_eliminacion: null,
                }
            }
        });
    }

    async getAsistenciaDiaria() {
        const date = new Date();
        date.setHours(date.getHours() - 6);

        const resultado = await this.prisma.eventoAsistencia.findMany({
            where: {
                fecha_hora: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lte: new Date(date.setHours(23, 59, 59, 999)),
                },
                tipo_evento: {
                    in: [1, 2, 3, 4],
                },
                Empleado: {
                    fecha_eliminacion: null,
                },
                OR: [
                    { tipo_evento: 1 },
                    { tipo_evento: 4 },
                ],
            },
            select: {
                id_evento: true,
                fecha_hora: true,
                tipo_evento: true,
                Empleado: {
                    select: {
                        id_empleado: true,
                        nombre: true,
                        Departamento: {
                            select: { id_departamento: true, nombre: true }
                        },
                        Rol: {
                            select: { id_rol: true, nombre: true }
                        },
                    },
                }
            }
        });

        return resultado;
    }

    async eliminarAsistencia(idEventoAsistencia: number) {
        const asistencia = await this.prisma.eventoAsistencia.findUnique({
            where: { id_evento: +idEventoAsistencia },
        });

        if (!asistencia) {
            throw new Error('Asistencia no encontrada');
        }

        await this.prisma.eventoAsistencia.update({
            where: { id_evento: +idEventoAsistencia },
            data: {
                tipo_evento: 5,
            },
        })
        return asistencia;
    }

    async updateAsistencia(asistenciaData: ActualizarAsistenciaDto) {
        const { idEventoAsistencia, fechaHora } = asistenciaData;
        
        if (!idEventoAsistencia || !fechaHora) {
            throw new Error('Faltan datos para actualizar la asistencia');
        }

        const asistencia = await this.prisma.eventoAsistencia.findUnique({
            where: { id_evento: +idEventoAsistencia },
        });

        if (!asistencia) {
            throw new Error('Asistencia no encontrada');
        }

        // Resta 6 horas
        const nuevaFechaHora = new Date(fechaHora);
        nuevaFechaHora.setHours(nuevaFechaHora.getHours() - 6);

        // Obtiene la hora actual de la asistencia obtenida, y cambia la hora de entrada según el parámetro        
        const updatedAsistencia = await this.prisma.eventoAsistencia.update({
            where: { id_evento: +idEventoAsistencia },
            data: {
                fecha_hora: new Date(nuevaFechaHora),
            },
        });

        return updatedAsistencia;
    }

    async obtenerUltimaAsistenciaPorIdEmpleado(idEmpleado: number) {
        return this.prisma.eventoAsistencia.findFirst({
            include: {
                TiposEventos: {
                    select: {
                        nombre: true,
                    },
                }
            },
            where: {
                id_empleado: idEmpleado,
            },
            orderBy: {
                fecha_hora: 'desc',
            },
        });
    }

    async obtenerHorarioPorIdEmpleado(idEmpleado: number) {
        return this.prisma.horario.findFirst({
            where: {
                id_empleado: idEmpleado,
            },
        });
    }
}