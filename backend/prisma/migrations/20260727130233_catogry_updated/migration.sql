/*
  Warnings:

  - The values [PROBBLEM_SOLVING] on the enum `Challenge_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Challenge` MODIFY `category` ENUM('FUNDAMENTALS', 'ARRAYS', 'POO', 'STRINGS', 'ALGORITHMS', 'PROBLEM_SOLVING', 'RANDOM') NOT NULL DEFAULT 'FUNDAMENTALS';
