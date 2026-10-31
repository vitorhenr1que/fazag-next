-- Preserve existing submissions without assigning them an unknown course.
ALTER TABLE `JunteSeANos`
    ADD COLUMN `curso_aluno` VARCHAR(191) NOT NULL DEFAULT '';

-- New submissions must explicitly supply the student's course.
ALTER TABLE `JunteSeANos`
    ALTER COLUMN `curso_aluno` DROP DEFAULT;
