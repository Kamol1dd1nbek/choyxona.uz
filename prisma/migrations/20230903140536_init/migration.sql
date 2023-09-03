/*
  Warnings:

  - You are about to drop the column `body` on the `contents` table. All the data in the column will be lost.
  - Added the required column `url` to the `contents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contents" DROP COLUMN "body",
ADD COLUMN     "url" TEXT NOT NULL;
