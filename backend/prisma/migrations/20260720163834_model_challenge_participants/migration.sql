/*
  Warnings:

  - Added the required column `challengeId` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Result` ADD COLUMN `challengeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenge`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
