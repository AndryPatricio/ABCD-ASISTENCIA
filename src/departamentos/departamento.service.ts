import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DepartamentoData } from './dto/departamentos.dto';

@Injectable()
export class DepartamentoService {
    constructor(private prisma: PrismaService) {}
    
    async getDepartamentos() {
        return this.prisma.departamento.findMany();
    }

    async createDepartamento(departamentoData: DepartamentoData) {
        return this.prisma.departamento.create({
            data: {
                nombre: departamentoData.nombre,
            },
        });
    }
}