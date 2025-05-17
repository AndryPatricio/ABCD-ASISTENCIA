import { ApiProperty } from "@nestjs/swagger";

export class DepartamentoDto {
    @ApiProperty({  description: 'Nombre del departamento', example: 'Recursos Humanos' })
    nombre: string
 }