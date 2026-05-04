ALTER TABLE `InstitutionalPublication`
  ADD COLUMN `alwaysPublished` BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN `publishAt` DATETIME(3) NULL,
  ADD COLUMN `unpublishAt` DATETIME(3) NULL;
