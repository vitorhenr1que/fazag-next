CREATE TABLE `JunteSeANos` (
    `id` VARCHAR(191) NOT NULL,
    `nome_aluno` VARCHAR(191) NOT NULL,
    `cpf_aluno` VARCHAR(191) NOT NULL,
    `numero_matricula` VARCHAR(191) NOT NULL,
    `nome_indicado` VARCHAR(191) NOT NULL,
    `curso_indicado` VARCHAR(191) NOT NULL,
    `telefone_indicado` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
