import { Module } from '@nestjs/common';
import { RolController } from './rol.controller';
import { RolService } from './rol.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    imports: [],
    controllers: [RolController],
    providers: [RolService, PrismaService],
})
export class RolModule {}