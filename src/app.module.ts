import { Module } from '@nestjs/common';
import { EmpleadoModule } from './empleados/empleado.module';
import { DepartamentoModule } from './departamentos/departamento.module';
import { RolModule } from './Roles/rol.module';
import { AdvertenciaModule } from './advertencias/advertencia.module';
import { AsistenciaModule } from './asistencias/asistencia.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [EmpleadoModule,DepartamentoModule,RolModule,AdvertenciaModule,AsistenciaModule,ReportesModule],
})
export class AppModule {}
