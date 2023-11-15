/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Season` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE image_id_seq;
ALTER TABLE "Image" ALTER COLUMN "id" SET DEFAULT nextval('image_id_seq');
ALTER SEQUENCE image_id_seq OWNED BY "Image"."id";

-- AlterTable
CREATE SEQUENCE listing_id_seq;
ALTER TABLE "Listing" ALTER COLUMN "blacklisted" SET DEFAULT false,
ALTER COLUMN "id" SET DEFAULT nextval('listing_id_seq');
ALTER SEQUENCE listing_id_seq OWNED BY "Listing"."id";

-- AlterTable
CREATE SEQUENCE review_id_seq;
ALTER TABLE "Review" ALTER COLUMN "id" SET DEFAULT nextval('review_id_seq');
ALTER SEQUENCE review_id_seq OWNED BY "Review"."id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Season_name_key" ON "Season"("name");
