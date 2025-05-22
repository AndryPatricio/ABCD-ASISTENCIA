import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ActualizarAsistenciaDto, AsistenciaDto, MarcarEventoAsistenciaDto, TurnoCompletoDtoResponse, TurnoCompletoEmpleadoDtoResponse } from './dto/asistencias.dto';

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
        const horarios = await this.obtenerHorarioPorIdEmpleado(asistenciaData.idEmpleado);

        if (!horarios) {
            throw new Error('No se encontró el horario para el empleado con ID: ' + asistenciaData.idEmpleado);
        }

        tipoEvento = ultimaAsistencia ? ultimaAsistencia.tipo_evento + 1 : 1;

        if(tipoEvento > 4) tipoEvento = 1;

        const currentDate = new Date();
        // console.log({ currentDate })
        currentDate.setHours(currentDate.getHours() - 6);
        // console.log({ currentDate })
        const diaActual = currentDate.getUTCDay() === 0 ? 7 : currentDate.getUTCDay();
        const horario = horarios.find(horario => horario.id_dia === diaActual);
        // console.log({ diaActual, currentDate, horario })

        if (!horario) {
            throw new Error('No se encontró el horario para el día actual: ' + diaActual);
        }

        const asistencia = await this.prisma.eventoAsistencia.create({
            data: {
                id_empleado: asistenciaData.idEmpleado,
                fecha_hora: currentDate,
                tipo_evento: tipoEvento,
            },
        });

        if(tipoEvento === 4) {
            const asistenciasTurno = await this.prisma.eventoAsistencia.findMany({
                where: { id_empleado: asistenciaData.idEmpleado, },
                orderBy: { fecha_hora: 'desc' },
                take: 4,
            });

            asistenciasTurno.reverse();

            const fechaInicioTurno = new Date(asistenciasTurno[0].fecha_hora);
            const fechaInicioComida = new Date(asistenciasTurno[1].fecha_hora);
            const fechaFinComida = new Date(asistenciasTurno[2].fecha_hora);
            const fechaFinTurno = new Date(asistenciasTurno[3].fecha_hora);
            const horaEntradaEstandar = new Date(horario.hora_entrada_estandar);

            const tiempoTotalMinutos = Math.floor((fechaFinTurno.getTime() - fechaInicioTurno.getTime()) / (1000 * 60));
            const tiempoComidaMinutos = Math.floor((fechaFinComida.getTime() - fechaInicioComida.getTime()) / (1000 * 60));
            const tiempoExtraComida = tiempoComidaMinutos - 60 > 0 ? tiempoComidaMinutos - 60 : 0;


            // Establecer a horaEntradaEstandar el mismo año, mes y día que fechaInicioTurno
            horaEntradaEstandar.setFullYear(fechaInicioTurno.getFullYear());
            horaEntradaEstandar.setMonth(fechaInicioTurno.getMonth());
            horaEntradaEstandar.setDate(fechaInicioTurno.getDate());


            // Calcula la diferencia entre fechaInicioTurno y horaEntradaEstandar
            let minutosRetardo = Math.floor((fechaInicioTurno.getTime() - horaEntradaEstandar.getTime()) / (1000 * 60));
            if (minutosRetardo < 0) minutosRetardo = 0;
            minutosRetardo += tiempoExtraComida;

            // console.log({
            //     horario,
            //     minutosRetardo,
            //     tiempoComidaMinutos,
            //     tiempoTotalMinutos,
            //     horaEntradaEstandar,
            //     fechaInicioTurno,
            // });

            const turnoCompleto = await this.prisma.turnoCompleto.create({
                data: {
                    id_empleado: asistenciaData.idEmpleado,
                    fecha_inicio: fechaInicioTurno,
                    fecha_fin: fechaFinTurno,
                    tiempo_total_minutos: tiempoTotalMinutos,
                    tiempo_comida_minutos: tiempoComidaMinutos,
                    minutos_retardo: minutosRetardo,
                },
            });
        }

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
        return this.prisma.horario.findMany({
            where: {
                id_empleado: idEmpleado,
            },
        });
    }

    async getHistorialAsistencias() {
        await this.insertarFaltas();

        const turnosCompletos = await this.prisma.turnoCompleto.findMany({
            include: {
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
            },
            where: {
                Empleado: {
                    fecha_eliminacion: null,
                }
            }
        });

        const turnosPorEmpleado = turnosCompletos.reduce((acumulador, turno) => {
        const idEmpleado = turno.id_empleado;
        
        // Si no existe el empleado en el acumulador, lo inicializamos con un array vacío
        if (!acumulador[idEmpleado]) {
            acumulador[idEmpleado] = [];
        }
        
        // Agregamos el turno al array del empleado correspondiente
        acumulador[idEmpleado].push(turno);
        
        return acumulador;
        }, {}); // Inicializamos el acumulador como un objeto vacío

        const resumenEmpleadoPromise = Object.keys(turnosPorEmpleado).map(async (idEmpleado) => {
            
            const turnos = turnosPorEmpleado[idEmpleado];
            const nombreEmpleado = turnos[0].Empleado.nombre;
            const cantidadRetardos = await this.verificarCantidadRetardos(+idEmpleado);
            const cantidadFaltas = turnos.filter(turno => turno.minutos_retardo === 0 && turno.tiempo_total_minutos === 0 && turno.tiempo_comida_minutos === 0).length;
            const cantidadSalidasTemprano = (await this.verificarSalidasTemprano(+idEmpleado)).length;
            const asistenciasTotales = turnos.length - cantidadFaltas;
            const minutosRetardo = turnos.reduce((total, turno) => total + turno.minutos_retardo, 0);
            const tiempoTotalMinutos = turnos.reduce((total, turno) => total + turno.tiempo_total_minutos, 0);
            const tiempoTotalHoras = Math.floor(tiempoTotalMinutos / 60);
            const tiempoTotalMinutosRestantes = tiempoTotalMinutos % 60;

            return {
                idEmpleado: +idEmpleado,
                nombreEmpleado,
                minutosRetardo,
                cantidadRetardos,
                cantidadFaltas,
                cantidadSalidasTemprano,
                asistenciasTotales,
                horasTrabajadas: tiempoTotalHoras + (tiempoTotalMinutosRestantes / 60),
            };
        });

        // // console.log({ resumenEmpleado })

        const resumenEmpleado: TurnoCompletoDtoResponse[] = await Promise.all(resumenEmpleadoPromise);

        return resumenEmpleado;
    }

    // async insertarFaltas() {
    //     await this.prisma.$executeRawUnsafe(`
    //         INSERT INTO TurnoCompleto (
    //             id_empleado, 
    //             fecha_inicio, 
    //             fecha_fin,
    //             minutos_retardo, 
    //             tiempo_total_minutos, 
    //             tiempo_comida_minutos
    //         )
    //         SELECT 
    //             H.id_empleado,
    //             DATEADD(DAY, H.id_dia - 
    //                 CASE 
    //                     WHEN DATEPART(WEEKDAY, GETDATE()) = 1 THEN 7
    //                     ELSE DATEPART(WEEKDAY, GETDATE()) - 1
    //                 END, 
    //                 CAST(GETDATE() AS DATE)
    //             ) AS fecha_inicio,
    //             DATEADD(DAY, H.id_dia - 
    //                 CASE 
    //                     WHEN DATEPART(WEEKDAY, GETDATE()) = 1 THEN 7
    //                     ELSE DATEPART(WEEKDAY, GETDATE()) - 1
    //                 END, 
    //                 CAST(GETDATE() AS DATE)
    //             ) AS fecha_fin,
    //             0 AS minutos_retardo,
    //             0 AS tiempo_total_minutos,
    //             0 AS tiempo_comida_minutos
    //         FROM 
    //             Horario H
    //         LEFT JOIN 
    //             TurnoCompleto TC ON H.id_empleado = TC.id_empleado
    //                             AND CASE 
    //                                     WHEN DATEPART(WEEKDAY, TC.fecha_inicio) = 1 THEN 7
    //                                     ELSE DATEPART(WEEKDAY, TC.fecha_inicio) - 1
    //                                 END = H.id_dia
    //                             AND CAST(TC.fecha_inicio AS DATE) = DATEADD(DAY, H.id_dia - 
    //                                 CASE 
    //                                     WHEN DATEPART(WEEKDAY, GETDATE()) = 1 THEN 7
    //                                     ELSE DATEPART(WEEKDAY, GETDATE()) - 1
    //                                 END, 
    //                                 CAST(GETDATE() AS DATE)
    //                             )
    //         WHERE 
    //             H.laborable = 1
    //             AND (
    //                 H.id_dia < (
    //                     CASE 
    //                         WHEN DATEPART(WEEKDAY, GETDATE()) = 1 THEN 7
    //                         ELSE DATEPART(WEEKDAY, GETDATE()) - 1
    //                     END
    //                 )
    //                 OR (
    //                     H.id_dia = (
    //                         CASE 
    //                             WHEN DATEPART(WEEKDAY, GETDATE()) = 1 THEN 7
    //                             ELSE DATEPART(WEEKDAY, GETDATE()) - 1
    //                         END
    //                     )
    //                     AND CONVERT(TIME, GETDATE()) > H.hora_entrada_estandar
    //                 )
    //             )
    //             AND TC.id_empleado IS NULL;
    //         `);
    // }

    async insertarFaltas() {
        try {
            // console.log('Iniciando insertarFaltas');
            // Obtenemos la fecha actual
            const fechaActual = new Date();
            const fechaActualSinHora = new Date(
                fechaActual.getFullYear(),
                fechaActual.getMonth(),
                fechaActual.getDate()
            );
            
            // Calculamos el día de la semana (1-7, donde 1 es lunes)
            // JavaScript usa 0-6 donde 0 es domingo, convertimos al formato 1-7 donde 1 es lunes
            const diaSemanaActual = fechaActual.getDay() === 0 ? 7 : fechaActual.getDay();
            // console.log('Día de la semana actual:', diaSemanaActual);
            
            // Obtenemos los horarios que cumplen con las condiciones
            // console.log('Consultando horarios...');
            const horarios = await this.prisma.horario.findMany({
                where: {
                    laborable: true,
                    AND: [
                    {
                        OR: [
                        // Días anteriores de la semana
                        { id_dia: { lt: diaSemanaActual } },
                        // Día actual pero ya pasó la hora de entrada
                        {
                            AND: [
                            { id_dia: diaSemanaActual },
                            // No podemos comparar directamente los tiempos en Prisma como en SQL
                            // Esta comparación la haremos luego con JavaScript
                            ]
                        }
                        ]
                    }
                    ]
                },
                select: {
                    id_empleado: true,
                    id_dia: true,
                    hora_entrada_estandar: true
                }
            });
            
            // console.log(`Horarios encontrados: ${horarios.length}`);
            // console.log('Muestra de horarios:', horarios.slice(0, 2));
            
            // Filtramos los horarios del día actual donde ya pasó la hora de entrada
            // console.log('Filtrando horarios por hora...');
            const horariosFiltrados = horarios.filter(h => {
            // console.log(`Evaluando horario: id_dia=${h.id_dia}, hora_entrada=${h.hora_entrada_estandar}`);
            
            if (h.id_dia < diaSemanaActual) {
                // console.log(`  Día anterior (${h.id_dia} < ${diaSemanaActual}): incluido`);
                return true;
            }
            
                if (h.id_dia === diaSemanaActual) {
                    // Verificamos que hora_entrada_estandar sea realmente un objeto Date
                    if (!(h.hora_entrada_estandar instanceof Date)) {
                        // console.log(`  ¡ALERTA! hora_entrada_estandar no es un objeto Date, es: ${typeof h.hora_entrada_estandar}`);
                        // Intentar convertirlo si es una cadena
                        if (typeof h.hora_entrada_estandar === 'string') {
                            try {
                                // Si es una cadena como "08:30:00", convertimos a Date
                                const [horas, minutos, segundos] = (h.hora_entrada_estandar as string).split(':').map(Number);
                                const fechaHora = new Date();
                                fechaHora.setHours(horas, minutos, segundos);
                                
                                const horaEntradaMinutos = fechaHora.getHours() * 60 + fechaHora.getMinutes();
                                const horaActualMinutos = fechaActual.getHours() * 60 + fechaActual.getMinutes();
                                
                                // console.log(`  Comparando hora entrada (${horaEntradaMinutos} min) con hora actual (${horaActualMinutos} min)`);
                                return horaEntradaMinutos < horaActualMinutos;
                            } catch (error) {
                                // console.log(`  Error al convertir la hora: ${error.message}`);
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }
                    
                    // Si es un objeto Date, procedemos normalmente
                    // Ajuste importante: Manejar correctamente la fecha 1970-01-01 o 1969-12-31 según la zona horaria
                    let horaEntradaMinutos;
                    
                    // Tratamos con la peculiaridad de las fechas en JavaScript
                    if (h.hora_entrada_estandar.getFullYear() === 1969 || h.hora_entrada_estandar.getFullYear() === 1970) {
                        // Calculamos los minutos desde la medianoche ajustando por la zona horaria
                        const horas = h.hora_entrada_estandar.getUTCHours();
                        const minutos = h.hora_entrada_estandar.getUTCMinutes();
                        horaEntradaMinutos = horas * 60 + minutos;
                        // console.log(`  Utilizando UTC para la hora: ${horas}:${minutos} (${horaEntradaMinutos} min)`);
                    } else {
                        horaEntradaMinutos = h.hora_entrada_estandar.getHours() * 60 + h.hora_entrada_estandar.getMinutes();
                    }
                    
                    const horaActualMinutos = fechaActual.getHours() * 60 + fechaActual.getMinutes();
                    
                    // console.log(`  Comparando hora entrada (${horaEntradaMinutos} min) con hora actual (${horaActualMinutos} min)`);
                    return horaEntradaMinutos < horaActualMinutos;
                }
            
                return false;
            });
            
            // console.log(`Horarios filtrados: ${horariosFiltrados.length}`);
            
            // Para cada horario, verificamos si ya existe un registro en TurnoCompleto
            // console.log('Verificando registros existentes...');
            const registrosAInsertar: {
                id_empleado: number;
                fecha_inicio: Date;
                fecha_fin: Date;
                minutos_retardo: number;
                tiempo_total_minutos: number;
                tiempo_comida_minutos: number;
            }[] = [];
            
            for (const horario of horariosFiltrados) {
                // Calculamos la fecha correspondiente al día de la semana del horario
                const diferenciaDias = horario.id_dia - diaSemanaActual;
                const fechaHorario = new Date(fechaActualSinHora);
                fechaHorario.setDate(fechaHorario.getDate() + diferenciaDias);
            
                // console.log(`Verificando empleado ${horario.id_empleado} para fecha ${fechaHorario.toISOString()}`);

                if(horario.id_empleado === null) continue;
            
                // Verificamos si ya existe un registro para este empleado en esta fecha
                const turnoExistente = await this.prisma.turnoCompleto.findFirst({
                    where: {
                        id_empleado: horario.id_empleado,
                        fecha_inicio: {
                            gte: new Date(new Date(fechaHorario).setHours(0, 0, 0, 0)),
                            lt: new Date(new Date(fechaHorario).setHours(23, 59, 59, 999))
                        }
                    }
                });
            
                // console.log(`  Turno existente: ${turnoExistente ? 'Sí' : 'No'}`);
            
                // Si no existe, lo agregamos a la lista para insertar
                if (!turnoExistente) {
                    registrosAInsertar.push({
                    id_empleado: horario.id_empleado,
                    fecha_inicio: fechaHorario,
                    fecha_fin: fechaHorario,
                    minutos_retardo: 0,
                    tiempo_total_minutos: 0,
                    tiempo_comida_minutos: 0
                    });
                }
            }
            
            // console.log(`Registros a insertar: ${registrosAInsertar.length}`);
            
            // Insertamos todos los registros en una sola operación
            if (registrosAInsertar.length > 0) {
            // console.log('Insertando registros...');
                await this.prisma.turnoCompleto.createMany({
                    data: registrosAInsertar,
                });
            // console.log('Inserción completada con éxito');
            } else {
            // console.log('No hay registros para insertar');
            }
            
            // console.log(`Proceso completado. ${registrosAInsertar.length} registros insertados`);
            return registrosAInsertar.length; // Retornamos la cantidad de registros insertados
        } catch (error) {
            console.error('Error en insertarFaltas:', error);
            throw error;
        }
    }


    async verificarCantidadRetardos(idEmpleado: number) {
        const turnosPorEmpleado = await this.prisma.turnoCompleto.groupBy({
            by: ['id_empleado'], // Agrupar por id_empleado
            _count: {
                id_turno: true, // Contar el total de registros
                minutos_retardo: true, // Contar solo registros con minutos_retardo
            },
            where: {
                minutos_retardo: {
                    gt: 0, // Filtro para contar los registros con minutos_retardo > 0
                },
            },
        });

        const empleado = turnosPorEmpleado.find(turno => turno.id_empleado === idEmpleado);
        
        if (empleado) {
            return empleado._count.minutos_retardo;
        }
        
        return 0;
    }

    async verificarSalidasTemprano(idEmpleado: number) {
        // 1. Obtener todos los turnos que no son faltas
        const turnos = await this.prisma.turnoCompleto.findMany({
            where: {
                id_empleado: idEmpleado,
                tiempo_total_minutos: {
                    not: 0,
                },
                tiempo_comida_minutos: {
                    not: 0,
                },
                minutos_retardo: {
                    not: 0,
                },
            },
            select: {
                id_turno: true,
                id_empleado: true,
                fecha_inicio: true,
                fecha_fin: true,
                tiempo_comida_minutos: true,
                tiempo_total_minutos: true,
                minutos_retardo: true,
            },
        });

        // 2. Filtrar en JS aquellos cuya duración efectiva < 480 minutos (8h)
        const salidasTemprano = turnos.filter(turno => {
            const fechaInicio = new Date(turno.fecha_inicio);
            const fechaFin = new Date(turno.fecha_fin as Date);

            const totalMinutos = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60);
            const minutosEfectivos = totalMinutos - turno.tiempo_comida_minutos;

            return minutosEfectivos < 480;
        });

        return salidasTemprano;
    }

    async getHistorialAsistenciasPorIdEmpleado(idEmpleado: number): Promise<TurnoCompletoEmpleadoDtoResponse[]> {
        const turnosCompletos = await this.prisma.turnoCompleto.findMany({
            include: {
                Empleado: {
                    select: {
                        id_empleado: true,
                        nombre: true,
                        Departamento: {
                            select: { id_departamento: true, nombre: true, descripcion: true }
                        },
                        Rol: {
                            select: { id_rol: true, nombre: true }
                        },
                    },
                }
            },
            where: {
                Empleado: {
                    fecha_eliminacion: null,
                },
                id_empleado: +idEmpleado,
            }
        });

        let resumenEmpleado: TurnoCompletoEmpleadoDtoResponse[] = [];

        resumenEmpleado = turnosCompletos.map(turno => {
            const fechaInicio = new Date(turno.fecha_inicio);
            const fechaFin = new Date(turno.fecha_fin as Date);

            // const totalMinutos = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60);
            const totalMinutos = turno.tiempo_total_minutos;
            const minutosEfectivos = totalMinutos - turno.tiempo_comida_minutos - turno.minutos_retardo;

            // Ensure departamento includes descripcion and fecha_registro
            const departamento = {
                idDepartamento: turno.Empleado.Departamento.id_departamento,
                nombre: turno.Empleado.Departamento.nombre,
                descripcion: turno.Empleado.Departamento.descripcion ?? '',
            };

            return {
                idTurnoCompleto: turno.id_turno,
                idEmpleado: turno.id_empleado,
                dia: fechaInicio,
                horaEntrada: fechaInicio,
                horaSalida: fechaFin,
                minutosTrabajados: minutosEfectivos,
                departamento,
            };
        })

        return resumenEmpleado;
    }
}