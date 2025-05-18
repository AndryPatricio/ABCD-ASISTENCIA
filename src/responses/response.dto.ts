import { ApiProperty } from "@nestjs/swagger";


export class LoginResponseDto {
	@ApiProperty({ description: 'Mensaje de respuesta', example: '' })
	message: string;

	@ApiProperty({ description: 'Datos del empleado', example: { id_empleado: 1, nombre: 'Juan Ignacio Perez Gomez', id_departamento: 1, id_rol: 1 } })
	data: {
		id_empleado: number;
		nombre: string;
		id_departamento: number;
		id_rol: number;
	};
}