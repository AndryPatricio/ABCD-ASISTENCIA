import { Module } from '@nestjs/common';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { PrismaService } from 'src/prisma.service';

@Module({
	imports: [],
	controllers: [ReportesController],
	providers: [ReportesService, PrismaService],
})
export class ReportesModule {}
