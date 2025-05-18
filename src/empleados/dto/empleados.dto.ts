import { ApiProperty } from "@nestjs/swagger";

export class EmpleadoDto {
	@ApiProperty({ description: 'Nombres y apellidos del empleado', example: 'Juan Ignacio Perez Gomez' })
	nombre: string;
	
	@ApiProperty({ description: 'Id del departamento', example: 1 })
	idDepartamento: number;
	
	@ApiProperty({ description: 'Contraseña', example: 'ABC123*' })
	contrasena: string;

	@ApiProperty({ description: 'Rol del empleado', example: 1 })
	idRol: number;
}

export class LoginEmpleadoDto {
	@ApiProperty({ description: 'Número de empleado', example: 1 })
	numeroEmpleado: number;
	
	@ApiProperty({ description: 'Contraseña', example: 'ABC123*' })
	contrasena: string;
}