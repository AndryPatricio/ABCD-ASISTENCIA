import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EmpleadoDto, LoginEmpleadoDto } from 'src/empleados/dto/empleados.dto';
import { AdvertenciaDto } from './dto/advertencias.dto';

@Injectable()
export class AdvertenciaService {
    constructor(private prisma: PrismaService) {}

    async getAdvertenciasByEmpleado(empleadoData: AdvertenciaDto) {
        let idEmpleado = +empleadoData.id_empleado_destinatario;

        if( isNaN(idEmpleado) ) {
            idEmpleado = 0;
        }

        const advertencias = await this.prisma.advertencia.findMany({
            where: {
                id_empleado_destinatario: idEmpleado,
            }
        });

        return advertencias;
    }
}
