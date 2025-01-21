/*
  Warnings:

  - You are about to drop the column `postalCode` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `City` table. All the data in the column will be lost.
  - Added the required column `title` to the `City` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "City" DROP COLUMN "postalCode",
DROP COLUMN "region",
ADD COLUMN     "title" TEXT NOT NULL;
