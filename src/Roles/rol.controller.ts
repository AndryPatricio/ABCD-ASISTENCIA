import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolData } from './dto/roles.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('roles')
export class RolController {
    constructor(private readonly rolesService: RolService) {}

    @Get()
    @ApiOperation({ summary: 'Obtiene todos los roles', description: 'Obtiene todos los roles de la base de datos.' })
    @ApiResponse({ status: 200, description: 'Lista de roles obtenida exitosamente.' })
    @ApiResponse({ status: 500, description: 'Error al obtener la lista de roles.' })
    getRoles() {
        return this.rolesService.getRoles();
    }
}
