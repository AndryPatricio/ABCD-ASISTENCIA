import { ApiProperty } from "@nestjs/swagger";
import { DepartamentoDto } from "src/departamentos/dto/departamentos.dto";

export class AsistenciaDto {
    @ApiProperty({  description: 'Nombre de la asistencia', example: 'Asistencia 1',  })
    nombre: string
 }

export class MarcarEventoAsistenciaDto {
    @ApiProperty({ description: 'ID del empleado', example: 1 })
    idEmpleado: number;
}

export class ActualizarAsistenciaDto {
    @ApiProperty({ description: 'ID del evento de asistencia', example: 1 })
    idEventoAsistencia: number;

    @ApiProperty({ description: 'Hora de entrada', example: '2023-10-01T08:00:00Z' })
    fechaHora: Date;
}

export class TurnoCompletoDto {
    idTurno: number;
    idEmpleado: number;
    fechaInicio: Date;
    fechaFin: Date;
    tiempoTotalMinutos: number;
    tiempoComidaMinutos: number;
    minutosRetardo: number;
}

export class TurnoCompletoDtoResponse {
    idEmpleado: number;
    nombreEmpleado: string;
    minutosRetardo: number;
    cantidadRetardos: number;
    cantidadFaltas: number;
    cantidadSalidasTemprano: number;
    asistenciasTotales: number;
    horasTrabajadas: number;
}

export class TurnoCompletoEmpleadoDtoResponse {
    idTurnoCompleto: number;
    idEmpleado:number;
    dia: Date
    horaEntrada: Date;
    horaSalida: Date;
    minutosTrabajados: number;
    departamento: DepartamentoDto;
}