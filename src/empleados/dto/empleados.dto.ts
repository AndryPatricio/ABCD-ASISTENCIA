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

export class LoginEmpleadoResponseDto {
	@ApiProperty({ description: 'Mensaje de respuesta', example: 'Inicio de sesión exitoso.' })
  message: string;
	@ApiProperty({ description: 'Empleado', example: { id_empleado: 1, nombre: 'Juan Ignacio Perez Gomez', id_departamento: 1, id_rol: 1 } })
  empleado?: {
    id_empleado: number;
    nombre: string;
    id_departamento: number;
    id_rol: number;
  };
}