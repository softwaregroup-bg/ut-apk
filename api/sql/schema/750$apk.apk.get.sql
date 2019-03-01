ALTER PROCEDURE apk.[apk.get] -- gets the main information for apk
    @apkId BIGINT, -- this is the apk Id
    @meta core.metaDataTT READONLY -- information for the user that makes the operation
AS
SET NOCOUNT ON;


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

SELECT 'apk' AS resultSetName, 1 as single
        SELECT
                apkId,
                apkName,
                statusId,
                createdOn,
                mappingBranchName,
                mappingBranchId,
                devices,
                androidVersions,
                apkFileName,
                apkSize,
                systemId
            FROM  apk.apk ap
        WHERE ap.apkId = @apkId

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    EXEC [core].[error]
END CATCH

