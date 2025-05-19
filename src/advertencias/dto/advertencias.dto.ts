import { ApiProperty } from "@nestjs/swagger";

export class AdvertenciaDto {
    @ApiProperty({  description: 'ID del empleado destinatario', example: 1 })
    id_empleado_destinatario: number;
}

export class CrearAdvertenciaDto {
    @ApiProperty({ description: 'ID del empleado destinatario', example: 1 })
    id_empleado_destinatario: number;

    @ApiProperty({ description: 'ID del empleado remitente', example: 2 })
    id_empleado_remitente: number;

    @ApiProperty({ description: 'Asunto de la advertencia', example: 'Inasistencia' })
    asunto: string;

    @ApiProperty({ description: 'Descripción de la advertencia', example: 'No asistió al trabajo el día 01/10/2023' })
    mensaje: string;
}