import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EmpleadoDto, LoginEmpleadoDto } from 'src/empleados/dto/empleados.dto';
import { AdvertenciaDto, CrearAdvertenciaDto } from './dto/advertencias.dto';

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

    async createAdvertencia(advertenciaData: CrearAdvertenciaDto) {
        const fecha = new Date();
        fecha.setHours(fecha.getHours() - 6);

        const advertencia = await this.prisma.advertencia.create({
            data: {
                id_empleado_destinatario: +advertenciaData.id_empleado_destinatario,
                id_empleado_remitente: +advertenciaData.id_empleado_remitente,
                asunto: advertenciaData.asunto,
                mensaje: advertenciaData.mensaje,
                fecha: fecha,
                leido: false,
            }
        });

        return advertencia;
    }
}
