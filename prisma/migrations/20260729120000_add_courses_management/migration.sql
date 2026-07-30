CREATE TABLE `Course` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `summary` TEXT NULL,
    `description` LONGTEXT NULL,
    `degree` VARCHAR(191) NULL,
    `modality` VARCHAR(191) NULL,
    `duration` VARCHAR(191) NULL,
    `shift` VARCHAR(191) NULL,
    `coordinator` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Course_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CourseDocument` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileKey` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CourseDocument_courseId_category_order_idx`(`courseId`, `category`, `order`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `CourseDocument` ADD CONSTRAINT `CourseDocument_courseId_fkey`
FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO `Course`
(`id`, `name`, `slug`, `summary`, `description`, `degree`, `modality`, `duration`, `shift`, `active`, `featured`, `order`, `createdAt`, `updatedAt`)
VALUES
('course-administracao', 'Administração', 'administracao', 'Formação para planejar, organizar e liderar negócios e organizações.', 'O curso prepara profissionais autônomos para atuar em gestão, planejamento, marketing, finanças e nos diversos setores de empresas e organizações.', 'Bacharelado', 'Presencial', '4 anos', 'Noturno', true, false, 0, NOW(3), NOW(3)),
('course-ciencias-contabeis', 'Ciências Contábeis', 'ciencias-contabeis', 'Formação sólida para transformar dados contábeis em decisões estratégicas.', 'O curso prepara profissionais para contabilidade, controladoria, auditoria, perícia e análise econômico-financeira em organizações públicas e privadas.', 'Bacharelado', 'Presencial', '4 anos', 'Noturno', true, false, 1, NOW(3), NOW(3)),
('course-educacao-fisica', 'Educação Física', 'educacao-fisica', 'Conhecimento do corpo em movimento para promover saúde e qualidade de vida.', 'A formação integra teoria e prática para atuação com atividades físicas, esportes, recreação, educação e promoção do bem-estar.', 'Bacharelado e Licenciatura', 'Presencial', '4 anos', 'Noturno', true, false, 2, NOW(3), NOW(3)),
('course-engenharia-civil', 'Engenharia Civil', 'engenharia-civil', 'Formação para projetar, construir e transformar espaços com responsabilidade.', 'O curso oferece formação generalista para atuação em projetos, obras, estruturas, transportes, saneamento, consultoria e gestão na construção civil.', 'Bacharelado', 'Presencial', '5 anos', 'Noturno', true, false, 3, NOW(3), NOW(3)),
('course-enfermagem', 'Enfermagem', 'enfermagem', 'Cuidado humano apoiado por conhecimento científico e prática profissional.', 'O curso forma profissionais generalistas, críticos e éticos para promover a saúde integral em hospitais, clínicas, unidades de saúde e atendimento domiciliar.', 'Bacharelado', 'Presencial', '5 anos', 'Noturno', true, false, 4, NOW(3), NOW(3)),
('course-estetica', 'Estética e Cosmética', 'estetica', 'Especialização em beleza, bem-estar e cuidados estéticos.', 'A formação reúne conhecimentos teóricos e práticos para tratamentos faciais e corporais e para a promoção da autoestima e da saúde estética.', 'Tecnólogo', 'Presencial', '2,5 anos', 'Noturno', true, false, 5, NOW(3), NOW(3)),
('course-farmacia', 'Farmácia', 'farmacia', 'Formação generalista com foco no medicamento e no cuidado em saúde.', 'O curso prepara para assistência farmacêutica, farmácia hospitalar, manipulação, drogarias, laboratórios e trabalho integrado a equipes multiprofissionais.', 'Bacharelado', 'Presencial', '5 anos', 'Noturno', true, false, 6, NOW(3), NOW(3)),
('course-fisioterapia', 'Fisioterapia', 'fisioterapia', 'Ciência do movimento aplicada à prevenção, recuperação e qualidade de vida.', 'O curso prepara para atuação em clínicas, hospitais, centros de reabilitação, unidades de saúde, esporte, atendimento domiciliar, gestão e pesquisa.', 'Bacharelado', 'Presencial', '5 anos', 'Noturno', true, false, 7, NOW(3), NOW(3)),
('course-nutricao', 'Nutrição', 'nutricao', 'Alimentação, saúde e ciência para transformar a qualidade de vida.', 'A formação prepara profissionais para compreender a relação entre alimentação e saúde e atuar nos diferentes campos da Nutrição.', 'Bacharelado', 'Presencial', '4 anos', 'Noturno', true, false, 8, NOW(3), NOW(3)),
('course-pedagogia', 'Pedagogia', 'pedagogia', 'Formação para ensinar, gerir e transformar realidades por meio da educação.', 'O curso prepara profissionais para Educação Infantil, anos iniciais, gestão educacional, projetos educativos e pesquisa em espaços escolares e não escolares.', 'Licenciatura', 'Presencial', '4 anos', 'Noturno', true, false, 9, NOW(3), NOW(3)),
('course-psicologia', 'Psicologia', 'psicologia', 'Compreensão da mente, do comportamento e das relações humanas.', 'A formação oferece estudo aprofundado das teorias, métodos e práticas psicológicas para uma atuação ética e comprometida com o cuidado humano.', 'Bacharelado', 'Presencial', '5 anos', 'Vespertino e noturno', true, true, 10, NOW(3), NOW(3)),
('course-servico-social', 'Serviço Social', 'servico-social', 'Formação comprometida com direitos, cidadania e transformação social.', 'O curso prepara para atuação em políticas sociais, saúde, educação, justiça, assistência social, organizações não governamentais e empresas.', 'Bacharelado', 'Presencial', '4 anos', 'Noturno', true, false, 11, NOW(3), NOW(3));

INSERT INTO `CourseDocument`
(`id`, `courseId`, `title`, `category`, `fileName`, `fileKey`, `fileUrl`, `mimeType`, `size`, `order`, `createdAt`, `updatedAt`)
VALUES
('doc-grade-administracao', 'course-administracao', 'Grade e corpo docente', 'GRADE_DOCENTE', 'grade-administracao.pdf', '', '/static/horarios/grade-administracao.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-matriz-administracao', 'course-administracao', 'Matriz curricular', 'MATRIZ_CURRICULAR', 'administracao.pdf', '', '/static/matrizes/administracao.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-grade-ciencias-contabeis', 'course-ciencias-contabeis', 'Grade e corpo docente', 'GRADE_DOCENTE', 'grade-ciencias-contabeis.pdf', '', '/static/horarios/grade-ciencias-contabeis.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-matriz-ciencias-contabeis', 'course-ciencias-contabeis', 'Matriz curricular', 'MATRIZ_CURRICULAR', 'ciencias-contabeis.pdf', '', '/static/matrizes/ciencias-contabeis.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-grade-educacao-fisica-lic', 'course-educacao-fisica', 'Grade e corpo docente — Licenciatura', 'GRADE_DOCENTE', 'grade-educacao-fisica-licenciatura.pdf', '', '/static/horarios/grade-educacao-fisica-licenciatura.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-grade-educacao-fisica-bac', 'course-educacao-fisica', 'Grade e corpo docente — Bacharelado', 'GRADE_DOCENTE', 'grade-educacao-fisica-bacharelado.pdf', '', '/static/horarios/grade-educacao-fisica-bacharelado.pdf', 'application/pdf', 0, 1, NOW(3), NOW(3)),
('doc-matriz-educacao-fisica-lic', 'course-educacao-fisica', 'Matriz curricular — Licenciatura', 'MATRIZ_CURRICULAR', 'educacao-fisica-licenciatura.pdf', '', '/static/matrizes/educacao-fisica-licenciatura.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-matriz-educacao-fisica-bac', 'course-educacao-fisica', 'Matriz curricular — Bacharelado', 'MATRIZ_CURRICULAR', 'educacao-fisica-bacharelado.pdf', '', '/static/matrizes/educacao-fisica-bacharelado.pdf', 'application/pdf', 0, 1, NOW(3), NOW(3)),
('doc-matriz-educacao-fisica-comp', 'course-educacao-fisica', 'Matriz curricular — Complementação', 'MATRIZ_CURRICULAR', 'educacao-fisica-complementacao.pdf', '', '/static/matrizes/educacao-fisica-complementacao.pdf', 'application/pdf', 0, 2, NOW(3), NOW(3)),
('doc-grade-engenharia-civil', 'course-engenharia-civil', 'Grade e corpo docente', 'GRADE_DOCENTE', 'grade-engenharia-civil.pdf', '', '/static/horarios/grade-engenharia-civil.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-matriz-engenharia-civil', 'course-engenharia-civil', 'Matriz curricular', 'MATRIZ_CURRICULAR', 'engenharia-civil.pdf', '', '/static/matrizes/engenharia-civil.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-grade-enfermagem', 'course-enfermagem', 'Grade e corpo docente', 'GRADE_DOCENTE', 'grade-enfermagem.pdf', '', '/static/horarios/grade-enfermagem.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-matriz-enfermagem', 'course-enfermagem', 'Matriz curricular', 'MATRIZ_CURRICULAR', 'enfermagem.pdf', '', '/static/matrizes/enfermagem.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-grade-estetica', 'course-estetica', 'Grade e corpo docente', 'GRADE_DOCENTE', 'grade-estetica.pdf', '', '/static/horarios/grade-estetica.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-matriz-estetica', 'course-estetica', 'Matriz curricular', 'MATRIZ_CURRICULAR', 'estetica.pdf', '', '/static/matrizes/estetica.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-grade-farmacia', 'course-farmacia', 'Grade e corpo docente', 'GRADE_DOCENTE', 'grade-farmacia.pdf', '', '/static/horarios/grade-farmacia.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-matriz-farmacia', 'course-farmacia', 'Matriz curricular', 'MATRIZ_CURRICULAR', 'farmacia.pdf', '', '/static/matrizes/farmacia.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-grade-fisioterapia', 'course-fisioterapia', 'Grade e corpo docente', 'GRADE_DOCENTE', 'grade-fisioterapia.pdf', '', '/static/horarios/grade-fisioterapia.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-matriz-fisioterapia', 'course-fisioterapia', 'Matriz curricular', 'MATRIZ_CURRICULAR', 'fisioterapia.pdf', '', '/static/matrizes/fisioterapia.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-grade-nutricao', 'course-nutricao', 'Grade e corpo docente', 'GRADE_DOCENTE', 'grade-nutricao.pdf', '', '/static/horarios/grade-nutricao.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-matriz-nutricao', 'course-nutricao', 'Matriz curricular', 'MATRIZ_CURRICULAR', 'nutricao.pdf', '', '/static/matrizes/nutricao.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-grade-pedagogia', 'course-pedagogia', 'Grade e corpo docente', 'GRADE_DOCENTE', 'grade-pedagogia.pdf', '', '/static/horarios/grade-pedagogia.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-matriz-pedagogia', 'course-pedagogia', 'Matriz curricular', 'MATRIZ_CURRICULAR', 'pedagogia.pdf', '', '/static/matrizes/pedagogia.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-grade-psicologia', 'course-psicologia', 'Grade e corpo docente', 'GRADE_DOCENTE', 'grade-psicologia.pdf', '', '/static/horarios/grade-psicologia.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-matriz-psicologia', 'course-psicologia', 'Matriz curricular', 'MATRIZ_CURRICULAR', 'psicologia.pdf', '', '/static/matrizes/psicologia.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-grade-servico-social', 'course-servico-social', 'Grade e corpo docente', 'GRADE_DOCENTE', 'grade-servico-social.pdf', '', '/static/horarios/grade-servico-social.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3)),
('doc-matriz-servico-social', 'course-servico-social', 'Matriz curricular', 'MATRIZ_CURRICULAR', 'servico-social.pdf', '', '/static/matrizes/servico-social.pdf', 'application/pdf', 0, 0, NOW(3), NOW(3));
