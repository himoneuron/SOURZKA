/*
  Warnings:

  - You are about to drop the column `leadTimeDays` on the `Product` table. All the data in the column will be lost.
  - Added the required column `deliveryTimeDays` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "leadTimeDays",
ADD COLUMN     "deliveryTimeDays" INTEGER NOT NULL,
ADD COLUMN     "isPaused" BOOLEAN NOT NULL DEFAULT false;
