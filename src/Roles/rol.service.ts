import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RolData } from './dto/roles.dto';

@Injectable()
export class RolService {
    constructor(private prisma: PrismaService) {}
    
    async getRoles() {
        return this.prisma.rol.findMany();
    }
}