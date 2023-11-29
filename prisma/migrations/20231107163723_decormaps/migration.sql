/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Pin" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "placeId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "image" BYTEA NOT NULL,
    "season" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Pin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "placeId" TEXT NOT NULL,
    "blacklisted" BOOLEAN NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("placeId")
);

-- CreateTable
CREATE TABLE "_ListingToUser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ListingToUser_AB_unique" ON "_ListingToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ListingToUser_B_index" ON "_ListingToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Pin" ADD CONSTRAINT "Pin_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pin" ADD CONSTRAINT "Pin_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Listing"("placeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingToUser" ADD CONSTRAINT "_ListingToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Listing"("placeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingToUser" ADD CONSTRAINT "_ListingToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
