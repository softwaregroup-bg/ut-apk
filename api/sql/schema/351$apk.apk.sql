CREATE TABLE [apk].[apk](
    apkId BIGINT NOT NULL,
    apkName NVARCHAR(100) NOT NULL,
    devices NVARCHAR(1000) NULL,
    imeis NVARCHAR(1000) NULL,
    androidVersions NVARCHAR(1000) NULL,
    apkFileName NVARCHAR(200) NOT NULL,
    apkSize NVARCHAR(50) NOT NULL,
    systemId BIGINT NOT NULL,
    organizationId BIGINT NULL,
    organizationName NVARCHAR(100) NULL,
    mappingBranchId BIGINT NULL,
    mappingBranchName NVARCHAR(100) NULL,
    isDeleted BIT NOT NULL DEFAULT(0),
    statusId NVARCHAR(200) NOT NULL,
    udf XML NULL,
    createdBy BIGINT NOT NULL,
    createdOn DATETIME2(0) NOT NULL,
    updatedBy BIGINT NULL,
    updatedOn DATETIME2(0) NULL,
CONSTRAINT pk_apk PRIMARY KEY CLUSTERED (apkId),
CONSTRAINT fkApk_apkOrganizationId FOREIGN KEY (mappingBranchId) REFERENCES customer.organization (actorId)
)


