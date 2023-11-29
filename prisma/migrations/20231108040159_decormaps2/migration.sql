/*
  Warnings:

  - The primary key for the `Listing` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ownerId` on the `ToDo` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Pin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[placeId]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ToDo` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `A` on the `_ListingToUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Pin" DROP CONSTRAINT "Pin_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Pin" DROP CONSTRAINT "Pin_placeId_fkey";

-- DropForeignKey
ALTER TABLE "ToDo" DROP CONSTRAINT "ToDo_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_ListingToUser" DROP CONSTRAINT "_ListingToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ListingToUser" DROP CONSTRAINT "_ListingToUser_B_fkey";

-- AlterTable
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_pkey",
ADD COLUMN     "addressId" INTEGER NOT NULL,
ADD CONSTRAINT "Listing_pkey" PRIMARY KEY ("addressId");

-- AlterTable
ALTER TABLE "ToDo" DROP COLUMN "ownerId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "_ListingToUser" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Pin";

-- CreateTable
CREATE TABLE "Review" (
    "reviewId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "addressId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("reviewId")
);

-- CreateTable
CREATE TABLE "Image" (
    "imageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "addressId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("imageId")
);

-- CreateTable
CREATE TABLE "Season" (
    "seasonId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("seasonId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Listing_placeId_key" ON "Listing"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "_ListingToUser_AB_unique" ON "_ListingToUser"("A", "B");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Listing"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("seasonId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Listing"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("seasonId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToDo" ADD CONSTRAINT "ToDo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingToUser" ADD CONSTRAINT "_ListingToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Listing"("addressId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingToUser" ADD CONSTRAINT "_ListingToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
