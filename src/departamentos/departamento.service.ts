import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DepartamentoService {
    constructor(private prisma: PrismaService) {}
    
    async getDepartamentos() {
        return this.prisma.departamento.findMany();
    }

    async createDepartamento(departamentoData: {
        nombre: string;
        idDepartamento: number;
    }) {
        return this.prisma.departamento.create({
            data: {
                nombre: departamentoData.nombre,
                id_departamento: departamentoData.idDepartamento,
            },
        });
    }
}