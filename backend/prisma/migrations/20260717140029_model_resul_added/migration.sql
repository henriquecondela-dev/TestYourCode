-- DropIndex
DROP INDEX `Challenge_title_key` ON `Challenge`;

-- AlterTable
ALTER TABLE `Challenge` ADD COLUMN `referenceSolution` LONGTEXT NULL;

-- CreateTable
CREATE TABLE `Result` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `submissionId` INTEGER NOT NULL,
    `score` DOUBLE NOT NULL,
    `rank` INTEGER NOT NULL,
    `feedback` VARCHAR(191) NOT NULL,
    `approved` BOOLEAN NOT NULL,

    UNIQUE INDEX `Result_submissionId_key`(`submissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
