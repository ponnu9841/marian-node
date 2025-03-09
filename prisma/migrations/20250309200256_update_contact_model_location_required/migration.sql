/*
  Warnings:

  - Made the column `location` on table `contacts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "contacts" ALTER COLUMN "location" SET NOT NULL;
