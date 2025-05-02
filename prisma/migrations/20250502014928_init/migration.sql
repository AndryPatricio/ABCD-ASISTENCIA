BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Empleado] (
    [id_empleado] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    [id_departamento] INT NOT NULL,
    [contrasena] NVARCHAR(1000) NOT NULL,
    [id_rol] INT NOT NULL,
    [fecha_eliminacion] DATETIME2,
    CONSTRAINT [Empleado_pkey] PRIMARY KEY CLUSTERED ([id_empleado])
);

-- CreateTable
CREATE TABLE [dbo].[Departamento] (
    [id_departamento] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    [descripcion] NVARCHAR(1000),
    [fecha_registro] DATETIME2 NOT NULL,
    CONSTRAINT [Departamento_pkey] PRIMARY KEY CLUSTERED ([id_departamento])
);

-- CreateTable
CREATE TABLE [dbo].[TurnoCompleto] (
    [id_turno] INT NOT NULL IDENTITY(1,1),
    [id_empleado] INT NOT NULL,
    [fecha_inicio] DATETIME2 NOT NULL,
    [fecha_fin] DATETIME2,
    [tiempo_total_minutos] INT NOT NULL,
    [tiempo_comida_minutos] INT NOT NULL,
    [minutos_retardo] INT NOT NULL,
    CONSTRAINT [TurnoCompleto_pkey] PRIMARY KEY CLUSTERED ([id_turno])
);

-- CreateTable
CREATE TABLE [dbo].[Rol] (
    [id_rol] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Rol_pkey] PRIMARY KEY CLUSTERED ([id_rol])
);

-- CreateTable
CREATE TABLE [dbo].[Advertencia] (
    [id_advertencia] INT NOT NULL IDENTITY(1,1),
    [id_empleado_remitente] INT NOT NULL,
    [id_empleado_destinatario] INT NOT NULL,
    [asunto] NVARCHAR(1000),
    [mensaje] NVARCHAR(1000),
    [fecha] DATETIME2 NOT NULL,
    [leido] BIT NOT NULL,
    CONSTRAINT [Advertencia_pkey] PRIMARY KEY CLUSTERED ([id_advertencia])
);

-- CreateTable
CREATE TABLE [dbo].[Dia] (
    [id_dia] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Dia_pkey] PRIMARY KEY CLUSTERED ([id_dia])
);

-- CreateTable
CREATE TABLE [dbo].[Horario] (
    [id_horario] INT NOT NULL IDENTITY(1,1),
    [id_empleado] INT,
    [id_dia] INT NOT NULL,
    [hora_entrada_estandar] TIME NOT NULL,
    [hora_salida_estandar] TIME NOT NULL,
    [laborable] BIT NOT NULL,
    CONSTRAINT [Horario_pkey] PRIMARY KEY CLUSTERED ([id_horario])
);

-- CreateTable
CREATE TABLE [dbo].[EventoAsistencia] (
    [id_evento] INT NOT NULL IDENTITY(1,1),
    [id_empleado] INT NOT NULL,
    [fecha_hora] DATETIME2 NOT NULL,
    [tipo_evento] INT NOT NULL,
    CONSTRAINT [EventoAsistencia_pkey] PRIMARY KEY CLUSTERED ([id_evento])
);

-- CreateTable
CREATE TABLE [dbo].[TiposEventos] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [TiposEventos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Empleado] ADD CONSTRAINT [Empleado_id_departamento_fkey] FOREIGN KEY ([id_departamento]) REFERENCES [dbo].[Departamento]([id_departamento]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Empleado] ADD CONSTRAINT [Empleado_id_rol_fkey] FOREIGN KEY ([id_rol]) REFERENCES [dbo].[Rol]([id_rol]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TurnoCompleto] ADD CONSTRAINT [TurnoCompleto_id_empleado_fkey] FOREIGN KEY ([id_empleado]) REFERENCES [dbo].[Empleado]([id_empleado]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Advertencia] ADD CONSTRAINT [Advertencia_id_empleado_remitente_fkey] FOREIGN KEY ([id_empleado_remitente]) REFERENCES [dbo].[Empleado]([id_empleado]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Advertencia] ADD CONSTRAINT [Advertencia_id_empleado_destinatario_fkey] FOREIGN KEY ([id_empleado_destinatario]) REFERENCES [dbo].[Empleado]([id_empleado]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Horario] ADD CONSTRAINT [Horario_id_empleado_fkey] FOREIGN KEY ([id_empleado]) REFERENCES [dbo].[Empleado]([id_empleado]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Horario] ADD CONSTRAINT [Horario_id_dia_fkey] FOREIGN KEY ([id_dia]) REFERENCES [dbo].[Dia]([id_dia]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EventoAsistencia] ADD CONSTRAINT [EventoAsistencia_id_empleado_fkey] FOREIGN KEY ([id_empleado]) REFERENCES [dbo].[Empleado]([id_empleado]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EventoAsistencia] ADD CONSTRAINT [EventoAsistencia_tipo_evento_fkey] FOREIGN KEY ([tipo_evento]) REFERENCES [dbo].[TiposEventos]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
