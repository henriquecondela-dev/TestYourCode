/*
  Warnings:

  - You are about to drop the column `participants` on the `Challenge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Challenge` DROP COLUMN `participants`;

-- CreateTable
CREATE TABLE `ChallengeParticipants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `challengeId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `ChallengeParticipants_challengeId_userId_key`(`challengeId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChallengeParticipants` ADD CONSTRAINT `ChallengeParticipants_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChallengeParticipants` ADD CONSTRAINT `ChallengeParticipants_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenge`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
