import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DepartamentoDto } from './dto/departamentos.dto';

@Injectable()
export class DepartamentoService {
    constructor(private prisma: PrismaService) {}
    
    async getDepartamentos() {
        return this.prisma.departamento.findMany();
    }

    async createDepartamento(departamentoData: DepartamentoDto) {
        return this.prisma.departamento.create({
            data: {
                nombre: departamentoData.nombre,
            },
        });
    }
}