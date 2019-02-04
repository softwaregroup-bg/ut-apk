CREATE TABLE [apk].[status]
(
    statusId tinyint  IDENTITY(1, 1) NOT NULL,
    statusName varchar(50) NOT NULL,
    CONSTRAINT [pkApkStatus] PRIMARY KEY CLUSTERED (statusId)
)