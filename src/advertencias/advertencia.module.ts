import { Module } from '@nestjs/common';
import { AdvertenciaController } from './advertencia.controller';
import { AdvertenciaService } from './advertencia.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    imports: [],
    controllers: [AdvertenciaController],
    providers: [AdvertenciaService, PrismaService],
})
export class AdvertenciaModule {}