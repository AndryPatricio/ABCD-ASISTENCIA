BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Advertencia] ALTER COLUMN [fecha] DATETIME2 NULL;
ALTER TABLE [dbo].[Advertencia] ADD CONSTRAINT [Advertencia_leido_df] DEFAULT 0 FOR [leido];

-- AlterTable
ALTER TABLE [dbo].[Departamento] ADD CONSTRAINT [Departamento_fecha_registro_df] DEFAULT CURRENT_TIMESTAMP FOR [fecha_registro];

-- AlterTable
ALTER TABLE [dbo].[EventoAsistencia] ADD CONSTRAINT [EventoAsistencia_fecha_hora_df] DEFAULT CURRENT_TIMESTAMP FOR [fecha_hora];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
