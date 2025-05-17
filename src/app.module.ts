import { Module } from '@nestjs/common';
import { EmpleadoModule } from './empleados/empleado.module';
import { DepartamentoModule } from './departamentos/departamento.module';
import { RolModule } from './Roles/rol.module';

@Module({
  imports: [EmpleadoModule,DepartamentoModule,RolModule],
})
export class AppModule {}
