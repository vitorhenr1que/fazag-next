CREATE TABLE `OrganizationNode` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `personName` VARCHAR(191) NULL,
  `description` TEXT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'DEPARTMENT',
  `parentId` VARCHAR(191) NULL,
  `order` INTEGER NOT NULL DEFAULT 0,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `OrganizationNode_parentId_order_idx` (`parentId`, `order`),
  INDEX `OrganizationNode_type_active_order_idx` (`type`, `active`, `order`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `OrganizationNode`
  ADD CONSTRAINT `OrganizationNode_parentId_fkey`
  FOREIGN KEY (`parentId`) REFERENCES `OrganizationNode` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO `OrganizationNode`
(`id`, `title`, `personName`, `description`, `type`, `parentId`, `order`, `active`, `createdAt`, `updatedAt`)
VALUES
('org-mantenedora', 'Sociedade Educacional Zacarias de Góes Vasconcelos', NULL, 'Sócio Diretor Presidente — Nelson Cerqueira\nSócia Diretora — Michelle de Melo Almeida', 'ENTITY', NULL, 0, true, NOW(3), NOW(3)),
('org-diretoria-geral', 'Diretora Geral', 'Profª. Alandra Rejane Pereira Bruno', NULL, 'LEADERSHIP', 'org-mantenedora', 0, true, NOW(3), NOW(3)),
('org-pesquisa-institucional', 'Pesquisadora Institucional', 'Caroline Queiroz', NULL, 'ADVISORY', 'org-diretoria-geral', 0, true, NOW(3), NOW(3)),
('org-auxiliar-institucional', 'Auxiliar Institucional', 'Joseval Borges', NULL, 'ADVISORY', 'org-diretoria-geral', 1, true, NOW(3), NOW(3)),
('org-registros-academicos', 'Secretaria de Registros Acadêmicos', 'Mirlane Santos', NULL, 'DEPARTMENT', 'org-diretoria-geral', 2, true, NOW(3), NOW(3)),
('org-coordenacao-academica', 'Coordenação Acadêmica', 'Caroline Queiroz', NULL, 'DEPARTMENT', 'org-diretoria-geral', 3, true, NOW(3), NOW(3)),
('org-coordenacao-financeira', 'Coordenação Financeira', 'Weslley Aguiar', NULL, 'DEPARTMENT', 'org-diretoria-geral', 4, true, NOW(3), NOW(3)),
('org-marketing-relacionamento', 'Coordenação de Marketing e Relacionamentos', 'Vitor Henrique', NULL, 'DEPARTMENT', 'org-diretoria-geral', 5, true, NOW(3), NOW(3)),
('org-biblioteca', 'Biblioteca', 'Dr. Makson Reis', NULL, 'SECTOR', 'org-registros-academicos', 0, true, NOW(3), NOW(3)),
('org-registro-diplomas', 'Registro de Diplomas', NULL, NULL, 'SECTOR', 'org-registros-academicos', 1, true, NOW(3), NOW(3)),
('org-nupex', 'Núcleo de Pós-Graduação, Pesquisa e Extensão (NUPEX)', NULL, NULL, 'SECTOR', 'org-coordenacao-academica', 0, true, NOW(3), NOW(3)),
('org-cpa', 'Comissão Própria de Avaliação (CPA)', NULL, NULL, 'SECTOR', 'org-coordenacao-academica', 1, true, NOW(3), NOW(3)),
('org-nusp', 'Núcleo Sociopsicopedagógico (NUSP)', NULL, NULL, 'SECTOR', 'org-coordenacao-academica', 2, true, NOW(3), NOW(3)),
('org-central-carreiras', 'Central de Carreiras', NULL, NULL, 'SECTOR', 'org-coordenacao-academica', 3, true, NOW(3), NOW(3)),
('org-financeiro', 'Financeiro', NULL, NULL, 'SECTOR', 'org-coordenacao-financeira', 0, true, NOW(3), NOW(3)),
('org-departamento-pessoal', 'Departamento Pessoal', NULL, NULL, 'SECTOR', 'org-coordenacao-financeira', 1, true, NOW(3), NOW(3)),
('org-juridica', 'Jurídica', NULL, NULL, 'SECTOR', 'org-coordenacao-financeira', 2, true, NOW(3), NOW(3)),
('org-processo-seletivo', 'Processo Seletivo', NULL, NULL, 'SECTOR', 'org-marketing-relacionamento', 0, true, NOW(3), NOW(3)),
('org-processamento-dados', 'Central de Processamento de Dados', NULL, NULL, 'SECTOR', 'org-marketing-relacionamento', 1, true, NOW(3), NOW(3)),
('org-ouvidoria', 'Ouvidoria', NULL, NULL, 'SECTOR', 'org-marketing-relacionamento', 2, true, NOW(3), NOW(3));
