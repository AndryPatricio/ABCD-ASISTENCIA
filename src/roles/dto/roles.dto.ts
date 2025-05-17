import { ApiProperty } from "@nestjs/swagger";

export class RolDto {
	@ApiProperty({ description: 'Id del rol', example: 0 })
	id: string;

	@ApiProperty({ description: 'Nombre del rol', example: ['asd', 'dsa'] })
	name: string;
}