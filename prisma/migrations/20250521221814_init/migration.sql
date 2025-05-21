-- CreateTable
CREATE TABLE "Empleado" (
    "id_empleado" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_departamento" INTEGER NOT NULL,
    "contrasena" TEXT NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "fecha_eliminacion" TIMESTAMP(3),

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id_empleado")
);

-- CreateTable
CREATE TABLE "Departamento" (
    "id_departamento" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id_departamento")
);

-- CreateTable
CREATE TABLE "TurnoCompleto" (
    "id_turno" SERIAL NOT NULL,
    "id_empleado" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "tiempo_total_minutos" INTEGER NOT NULL,
    "tiempo_comida_minutos" INTEGER NOT NULL,
    "minutos_retardo" INTEGER NOT NULL,

    CONSTRAINT "TurnoCompleto_pkey" PRIMARY KEY ("id_turno")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Advertencia" (
    "id_advertencia" SERIAL NOT NULL,
    "id_empleado_remitente" INTEGER NOT NULL,
    "id_empleado_destinatario" INTEGER NOT NULL,
    "asunto" TEXT,
    "mensaje" TEXT,
    "fecha" TIMESTAMP(3),
    "leido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Advertencia_pkey" PRIMARY KEY ("id_advertencia")
);

-- CreateTable
CREATE TABLE "Dia" (
    "id_dia" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Dia_pkey" PRIMARY KEY ("id_dia")
);

-- CreateTable
CREATE TABLE "Horario" (
    "id_horario" SERIAL NOT NULL,
    "id_empleado" INTEGER,
    "id_dia" INTEGER NOT NULL,
    "hora_entrada_estandar" TIME NOT NULL,
    "hora_salida_estandar" TIME NOT NULL,
    "laborable" BOOLEAN NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id_horario")
);

-- CreateTable
CREATE TABLE "EventoAsistencia" (
    "id_evento" SERIAL NOT NULL,
    "id_empleado" INTEGER NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo_evento" INTEGER NOT NULL,

    CONSTRAINT "EventoAsistencia_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "TiposEventos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TiposEventos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "Departamento"("id_departamento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoCompleto" ADD CONSTRAINT "TurnoCompleto_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "Empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advertencia" ADD CONSTRAINT "Advertencia_id_empleado_remitente_fkey" FOREIGN KEY ("id_empleado_remitente") REFERENCES "Empleado"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Advertencia" ADD CONSTRAINT "Advertencia_id_empleado_destinatario_fkey" FOREIGN KEY ("id_empleado_destinatario") REFERENCES "Empleado"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "Empleado"("id_empleado") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_id_dia_fkey" FOREIGN KEY ("id_dia") REFERENCES "Dia"("id_dia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoAsistencia" ADD CONSTRAINT "EventoAsistencia_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "Empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoAsistencia" ADD CONSTRAINT "EventoAsistencia_tipo_evento_fkey" FOREIGN KEY ("tipo_evento") REFERENCES "TiposEventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
