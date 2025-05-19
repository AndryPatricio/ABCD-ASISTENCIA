import { ApiProperty } from "@nestjs/swagger";

interface DiaHorario {
	laborable: boolean;
	hora_entrada: string;
	hora_salida: string;
}

interface DiasLaborales {
	lunes: DiaHorario;
	martes: DiaHorario;
	miercoles: DiaHorario;
	jueves: DiaHorario;
	viernes: DiaHorario;
	sabado: DiaHorario;
	domingo: DiaHorario;
}

export class EmpleadoDto {
	@ApiProperty({ description: 'Nombres y apellidos del empleado', example: 'Juan Ignacio Perez Gomez' })
	nombre: string;
	
	@ApiProperty({ description: 'Id del departamento', example: 1 })
	idDepartamento: number;
	
	@ApiProperty({ description: 'Contraseña', example: 'ABC123*' })
	contrasena: string;

	@ApiProperty({ description: 'Rol del empleado', example: 1 })
	idRol: number;

	@ApiProperty({ description: 'Días laborales del empleado', example: {
		lunes: { laborable: true, hora_entrada: '08:00', hora_salida: '17:00' },
		martes: { laborable: true, hora_entrada: '08:00', hora_salida: '17:00' },
		miercoles: { laborable: true, hora_entrada: '08:00', hora_salida: '17:00' },
		jueves: { laborable: true, hora_entrada: '08:00', hora_salida: '17:00' },
		viernes: { laborable: true, hora_entrada: '08:00', hora_salida: '17:00' },
		sabado: { laborable: false, hora_entrada: '', hora_salida: '' },
		domingo: { laborable: false, hora_entrada: '', hora_salida: '' },
	} })
	diasLaborales: DiasLaborales;
}

export class LoginEmpleadoDto {
	@ApiProperty({ description: 'Número de empleado', example: 1 })
	numeroEmpleado: number;
	
	@ApiProperty({ description: 'Contraseña', example: 'ABC123*' })
	contrasena: string;
}