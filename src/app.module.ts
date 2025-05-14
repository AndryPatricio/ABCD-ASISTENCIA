import { Module } from '@nestjs/common';
import { EmpleadoModule } from './empleados/empleado.module';
import { DepartamentoModule } from './departamentos/departamento.module';

@Module({
  imports: [EmpleadoModule,DepartamentoModule],
})
export class AppModule {}
