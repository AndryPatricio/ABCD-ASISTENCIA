import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EmpleadoDto, LoginEmpleadoDto } from 'src/empleados/dto/empleados.dto';
import { AdvertenciaDto } from './dto/advertencias.dto';

@Injectable()
export class AdvertenciaService {
    constructor(private prisma: PrismaService) {}

    async getAdvertencias(empleadoData: AdvertenciaDto) {
        const advertencias = this.prisma.advertencia.findMany({
            where: {
                id_empleado_destinatario: empleadoData.id_empleado_destinatario,
            }
        });
    }
}
