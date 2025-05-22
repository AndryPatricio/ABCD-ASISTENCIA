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
                descripcion: departamentoData.descripcion,
            },
        });
    }

    async updateDepartamento(id: number, departamentoData: DepartamentoDto) {
        return this.prisma.departamento.update({
            where: { id_departamento: id },
            data: {
                nombre: departamentoData.nombre,
                descripcion: departamentoData.descripcion,
            },
        });
    }

    async deleteDepartamento(id: number) {
        return this.prisma.departamento.update({
            data: {
                fecha_eliminacion: new Date(),
            },
            where: { id_departamento: id },
        });
    }

    
}