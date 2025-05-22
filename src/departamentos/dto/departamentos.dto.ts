import { ApiProperty } from "@nestjs/swagger";

export class DepartamentoDto {
    @ApiProperty({ description: 'ID del departamento', example: 1 })
    idDepartamento: number;
    
    @ApiProperty({  description: 'Nombre del departamento', example: 'Recursos Humanos' })
    nombre: string

    @ApiProperty({ description: 'Descripción del departamento', example: "Departamento de recursos humanos" })
    descripcion: string;
 }