import { Module } from '@nestjs/common';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoService } from './empleado.service';
import { PrismaService } from 'src/prisma.service';

@Module({
	imports: [],
	controllers: [EmpleadoController],
	providers: [EmpleadoService, PrismaService],
})
export class EmpleadoModule {}
