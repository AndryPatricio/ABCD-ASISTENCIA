import { Module } from '@nestjs/common';
import { DepartamentoController } from './departamento.controller';
import { DepartamentoService } from './departamento.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    imports: [],
    controllers: [DepartamentoController],
    providers: [DepartamentoService, PrismaService],
})
export class DepartamentoModule {}