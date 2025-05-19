import { ApiProperty } from "@nestjs/swagger";

export class AdvertenciaDto {
    @ApiProperty({  description: 'ID del empleado destinatario', example: 1 })
    id_empleado_destinatario: number;
 }