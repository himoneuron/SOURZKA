/*
  Warnings:

  - Added the required column `manufacturerId` to the `LegalDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LegalDocument" ADD COLUMN     "manufacturerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Manufacturer" ADD COLUMN     "isViewedByStaff" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "keywords" TEXT[],
ALTER COLUMN "companyName" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LegalDocument" ADD CONSTRAINT "LegalDocument_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
