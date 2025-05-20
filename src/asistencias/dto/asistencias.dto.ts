import { ApiProperty } from "@nestjs/swagger";

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