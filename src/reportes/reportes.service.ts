import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ActualizarEmpleadoDto, EliminarEmpleadoDto, EmpleadoDto, LoginEmpleadoDto } from './dto/reportes.dto';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ReportesService {
	constructor(private prisma: PrismaService) {}
	
}
