import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AsistenciaDto } from './dto/asistencias.dto';

@Injectable()
export class AsistenciaService {
    constructor(private prisma: PrismaService) {}

    async getAsistencias() {
        return this.prisma.eventoAsistencia.findMany();
    }
}