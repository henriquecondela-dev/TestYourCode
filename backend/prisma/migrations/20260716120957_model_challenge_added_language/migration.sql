-- DropIndex
DROP INDEX `Challenge_problem_key` ON `Challenge`;

-- AlterTable
ALTER TABLE `Challenge` MODIFY `problem` LONGTEXT NOT NULL;
