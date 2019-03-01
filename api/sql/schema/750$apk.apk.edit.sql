ALTER PROCEDURE [apk].[apk.edit] -- edits an apk with provided parameters
    @apk [apk].apkTT READONLY,-- apk data
    @meta core.metaDataTT READONLY, -- information for the user that makes the operation
    @noResultSet bit = 0 -- a flag to show if result is expected
AS
DECLARE @callParams XML
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta) -- the id of the user adding the customer
DECLARE @today datetime2(0) = SYSDATETIMEOFFSET()

BEGIN TRY
    -- checks if the user has a right to edit apks
    DECLARE @actionID varchar(100) =  OBJECT_SCHEMA_NAME(@@PROCID) + '.' +  OBJECT_NAME(@@PROCID), @return INT = 0
    EXEC @return = [user].[permission.check] @actionId =  @actionID, @objectId = null, @meta = @meta
    IF @return != 0
    BEGIN
        RETURN 55555
    END

    IF NOT EXISTS (SELECT 1 FROM [apk].[apk] WHERE apkFileName = (select apkFileName FROM @apk))
    BEGIN
        RAISERROR('apk.add.apkNotExists', 16, 1);
    END

    DECLARE @TranCounter INT = @@TRANCOUNT
    IF @TranCounter = 0
        BEGIN TRANSACTION;

    UPDATE a
    SET
        a.apkName = ag.apkName,
        a.devices = ag.devices,
        a.imeis = ag.imeis,
        a.androidVersions = ag.androidVersions,
        a.apkFileName = ag.apkFileName,
        a.apkSize = ag.apkSize,
        a.systemId = ag.systemId,
        a.organizationId = ag.organizationId,
        a.organizationName = ag.organizationName,
        a.mappingBranchId = ag.mappingBranchId,
        a.mappingBranchName = ag.mappingBranchName,
        a.statusId = ag.statusId,
        a.updatedOn = @today,
        a.updatedBy = @userId
    FROM apk.apk a
    INNER JOIN @apk ag ON ag.apkid = a.apkid

    EXEC core.auditCall @procid = @@PROCID, @params = @callParams

    IF @TranCounter = 0
        COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@trancount > 0
        ROLLBACK TRANSACTION;
    EXEC [core].[error]
END CATCH;
