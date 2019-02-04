CREATE TYPE [apk].[filterByTT] AS TABLE(
    apkName  VARCHAR(100),
    statusId VARCHAR(20),
    createdOn DATE,
    apkId BIGINT,
    businessUnitId BIGINT
)