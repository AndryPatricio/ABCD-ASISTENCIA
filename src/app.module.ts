import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpleadoModule } from './empleados/empleado.module';
import { DepartamentoModule } from './departamentos/departamento.module';

@Module({
  imports: [EmpleadoModule,DepartamentoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
