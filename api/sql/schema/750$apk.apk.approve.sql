ALTER PROCEDURE apk.[apk.approve] -- mark apk as approved
    @apkId BIGINT, -- this is the apk Id,
    @meta core.metaDataTT READONLY -- information for the user that makes the operation
AS
SET NOCOUNT ON;
DECLARE @today datetime2(0) = SYSDATETIMEOFFSET()
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta) -- the id of the user approving the apk

BEGIN TRY
    DECLARE @actionID VARCHAR(100) =  OBJECT_SCHEMA_NAME(@@PROCID) + '.' +  OBJECT_NAME(@@PROCID), @return INT = 0
    EXEC @return = [user].[permission.check] @actionId =  @actionID, @objectId = NULL, @meta = @meta
    IF @return != 0
     BEGIN
         RETURN 55555
    END
--Error message
IF @apkId IS NULL
            BEGIN
                RAISERROR('apk.apkNotSubmitted', 16, 1);
            END

IF NOT EXISTS (SELECT * FROM apk.apk WHERE apkId = @apkId)
            BEGIN
                RAISERROR('apk.apkNotExists', 16, 1);
            END

UPDATE apk.apk SET statusId = 'approved', updatedOn = @today, updatedBy = @userId
        WHERE apkId = @apkId

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    EXEC [core].[error]
END CATCH

