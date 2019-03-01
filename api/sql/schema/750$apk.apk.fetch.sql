ALTER PROCEDURE [apk].[apk.fetch] -- List information for apks
    @filterBy [apk].filterByTT READONLY,-- information for filters
    @orderBy [apk].orderByTT READONLY,-- information for ordering
    @paging [apk].[pagingTT] READONLY,--information for paging
    @meta core.metaDataTT READONLY -- information for the user that makes the operation
AS
    SET NOCOUNT ON

    DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)

    DECLARE
        @statusId TINYINT,
        @apkName NVARCHAR(200),
        @businessUnitId BIGINT,
        @pageSize int,
        @pageNumber int,
        @sortBy varchar(50) = 'createdOn',
        @sortOrder varchar(4) = 'ASC'



    SELECT
        @statusId = statusId,
        @apkName = apkName,
        @businessUnitId = businessUnitId
    FROM @filterBy

    SELECT
        @sortBy = ISNULL([column],'createdOn'),
        @sortOrder=ISNULL([direction],'ASC')
    FROM @orderBy

    SELECT
        @pageNumber = ISNULL(pageNumber,1),
        @pageSize = ISNULL([pageSize], 20)
    FROM @paging

    DECLARE @startRow INT = ( @pageNumber - 1) * @pageSize + 1
    DECLARE @endRow INT = @startRow + @pageSize - 1

    DECLARE @actionID VARCHAR(100) =  OBJECT_SCHEMA_NAME(@@PROCID) + '.' +  OBJECT_NAME(@@PROCID), @return INT = 0
    EXEC @return = [user].[permission.check] @actionId =  @actionID, @objectId = NULL, @meta = @meta
    IF @return != 0
     BEGIN
         RETURN 55555
    END

    IF OBJECT_ID('tempdb..#Org') IS NOT NULL
        DROP TABLE  #Org

    CREATE TABLE #Org (actorId BIGINT Primary KEY)

    IF @businessUnitId IS NOT NULL
    BEGIN
        INSERT INTO #Org SELECT DISTINCT o.actorId FROM customer.organizationsVisibleFor(@businessUnitId) AS o
    END
    ELSE
    BEGIN
        INSERT #Org SELECT cur.actorId FROM agent.branchesVisibleFor(@userId) cur
    END

    IF OBJECT_ID('tempdb..#Apk') IS NOT NULL
        DROP TABLE #Apk

    CREATE TABLE #Apk (
          apkId BIGINT,
          apkName NVARCHAR(200),
          statusId NVARCHAR(200) ,
          createdOn DATETIME,
		  updatedOn DATETIME,
          mappingBranchName NVARCHAR(100),
          mappingBranchId BIGINT,
          devices NVARCHAR(1000),
          androidVersions NVARCHAR(1000),
          systemId BIGINT,
          rowNum int, recordsTotal int)


    ;WITH CTE AS
    (
        SELECT
            apkId,
            apkName,
            statusId,
            createdOn,
            updatedOn,
            mappingBranchName,
            mappingBranchId,
            devices,
            androidVersions,
            systemId,
            ROW_NUMBER() OVER(ORDER BY
                            CASE WHEN @sortOrder = 'ASC' THEN
                                CASE
                                    WHEN @sortBy = 'apkName' THEN a.apkName
                                    WHEN @sortBy = 'statusId' THEN a.statusId
                                    WHEN @sortBy = 'createdOn' THEN a.createdOn
									WHEN @sortBy = 'updatedOn' THEN a.updatedOn
                                    WHEN @sortBy = 'apkId' THEN convert(nvarchar(100),apkId)
                                END
                            END,
                            CASE WHEN @sortOrder = 'DESC' THEN
                                CASE
                                    WHEN @sortBy = 'apkName' THEN a.apkName
                                    WHEN @sortBy = 'statusId' THEN a.statusId
                                    WHEN @sortBy = 'createdOn' THEN a.createdOn
									WHEN @sortBy = 'updatedOn' THEN a.updatedOn
                                    WHEN @sortBy = 'apkId' THEN convert(nvarchar(100),apkId)
                                END
                            END DESC) rowNum,
            COUNT(*) OVER(PARTITION BY 1) AS recordsTotal
        FROM
        (
            SELECT
                apkId,
                apkName,
                statusId,
                createdOn,
                updatedOn,
                mappingBranchName,
                mappingBranchId,
                devices,
                androidVersions,
                systemId
            FROM  apk.apk ap
            WHERE
                ( @statusId IS NULL OR ap.statusId = @statusId ) AND
                ( @apkName IS NULL OR ap.apkName like '%' + @apkName +'%' )
                AND ap.isDeleted = 0
        ) a
    )

    INSERT INTO #Apk( apkId ,apkName, statusId, createdOn,updatedOn, mappingBranchName, mappingBranchId, devices, androidVersions,systemId, rowNum, recordsTotal)
    SELECT apkId ,apkName, statusId, createdOn, updatedOn, mappingBranchName, mappingBranchId, devices, androidVersions,systemId, rowNum, recordsTotal
    FROM CTE
    WHERE rowNum BETWEEN @startRow AND  @endRow


    SELECT 'apk' AS resultSetName

    SELECT apkId ,apkName, statusId, CONVERT(varchar, createdOn, 0) as createdOn, CONVERT(varchar, updatedOn, 0) as updatedOn, mappingBranchName, mappingBranchId, devices, androidVersions,systemId
    FROM #Apk a
    ORDER BY rowNum

    SELECT 'pagination' AS resultSetName

    SELECT TOP 1 @pageSize AS pageSize, recordsTotal AS recordsTotal, @pageNumber AS pageNumber, (recordsTotal - 1) / @pageSize + 1 AS pagesTotal
    FROM #Apk

    DROP TABLE #Apk