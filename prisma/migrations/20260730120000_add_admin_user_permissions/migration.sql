ALTER TABLE `User`
  ADD COLUMN `isSuperAdmin` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `permissions` JSON NULL,
  ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN `sessionVersion` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- Todos os administradores existentes mantêm acesso integral.
UPDATE `User` SET `isSuperAdmin` = true;
