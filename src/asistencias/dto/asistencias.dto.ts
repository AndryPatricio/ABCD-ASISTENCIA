import { ApiProperty } from "@nestjs/swagger";

export class AsistenciaDto {
    @ApiProperty({  description: 'Nombre de la asistencia', example: 'Asistencia 1',  })
    nombre: string
 }

export class MarcarEventoAsistenciaDto {
    @ApiProperty({ description: 'ID del empleado', example: 1 })
    idEmpleado: number;
}