/*
  Warnings:

  - You are about to drop the column `addressId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `listingId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listingId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_addressId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "addressId",
ADD COLUMN     "listingId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "addressId",
ADD COLUMN     "listingId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
