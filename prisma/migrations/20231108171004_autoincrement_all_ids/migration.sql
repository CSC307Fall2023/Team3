-- AlterTable
CREATE SEQUENCE image_id_seq;
ALTER TABLE "Image" ALTER COLUMN "id" SET DEFAULT nextval('image_id_seq');
ALTER SEQUENCE image_id_seq OWNED BY "Image"."id";

-- AlterTable
CREATE SEQUENCE listing_id_seq;
ALTER TABLE "Listing" ALTER COLUMN "id" SET DEFAULT nextval('listing_id_seq');
ALTER SEQUENCE listing_id_seq OWNED BY "Listing"."id";

-- AlterTable
CREATE SEQUENCE review_id_seq;
ALTER TABLE "Review" ALTER COLUMN "id" SET DEFAULT nextval('review_id_seq');
ALTER SEQUENCE review_id_seq OWNED BY "Review"."id";
