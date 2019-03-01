ALTER PROCEDURE [apk].[apk.add] -- adds an apk with provided parameters
    @apk [apk].apkTT READONLY,-- apk data
    @meta core.metaDataTT READONLY, -- information for the user that makes the operation
    @noResultSet bit = 0 -- a flag to show if result is expected
AS
DECLARE @callParams XML
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta) -- the id of the user adding the apk
DECLARE @today datetime2(0) = SYSDATETIMEOFFSET()

BEGIN TRY
    -- checks if the user has a right to add apks
    DECLARE @actionID varchar(100) =  OBJECT_SCHEMA_NAME(@@PROCID) + '.' +  OBJECT_NAME(@@PROCID), @return INT = 0
    EXEC @return = [user].[permission.check] @actionId =  @actionID, @objectId = null, @meta = @meta
    IF @return != 0
    BEGIN
        RETURN 55555
    END

    IF EXISTS (SELECT 1 FROM [apk].[apk] WHERE apkFileName = (select apkFileName FROM @apk))
    BEGIN
        RAISERROR('apk.add.apkExists', 16, 1);
    END

    DECLARE @TranCounter INT = @@TRANCOUNT
    IF @TranCounter = 0
        BEGIN TRANSACTION;

    INSERT INTO [apk].apk
    (
        apkName, devices, imeis, androidVersions, apkFileName, apkSize,
        systemId, organizationId, organizationName, mappingBranchId, mappingBranchName,
        isDeleted, statusId, udf,  createdBy, createdOn,
        updatedBy, updatedOn
    )
    SELECT
        apkName, devices, imeis, androidVersions, apkFileName, apkSize,
        systemId, organizationId, organizationName, mappingBranchId, mappingBranchName,
        isDeleted, statusId, udf, @userId, @today, @userId, @today
    FROM  @apk

    EXEC core.auditCall @procid = @@PROCID, @params = @callParams

    IF @TranCounter = 0
        COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@trancount > 0
        ROLLBACK TRANSACTION;
    EXEC [core].[error]
END CATCH;
