import { ApiProperty } from "@nestjs/swagger";

export class AsistenciaDto {
    @ApiProperty({  description: 'Nombre de la asistencia', example: 'Asistencia 1' })
    nombre: string
 }