import { NextResponse } from "next/server";
import prisma from "@/lib/db";


// gets the placeIds of all listings, their coordinates, and their average scores
export async function GET(request) {
    const listings = await prisma.$queryRaw`
        SELECT "public"."Listing"."placeId", 
            AVG("public"."Listing"."latitude") AS "latitude", 
            AVG("public"."Listing"."longitude") AS "longitude", 
            AVG("public"."Review"."score") AS "avgScore"
        FROM "public"."Review", "public"."Listing"
        WHERE "public"."Review"."listingId" = "public"."Listing"."id"
        GROUP BY "public"."Listing"."placeId"
        ORDER BY "avgScore" DESC;
    `;
    return NextResponse.json(listings);
}