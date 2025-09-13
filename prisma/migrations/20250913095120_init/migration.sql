/*
  Warnings:

  - Added the required column `description` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."tasks" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "completed" DROP NOT NULL;
