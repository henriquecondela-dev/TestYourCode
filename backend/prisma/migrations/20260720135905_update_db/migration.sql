/*
  Warnings:

  - You are about to drop the column `maxParticipants` on the `Challenge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Challenge` DROP COLUMN `maxParticipants`,
    ADD COLUMN `participants` INTEGER NULL;
