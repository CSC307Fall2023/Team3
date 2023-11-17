// TODO: seasons GET API (see src/app/api/reviews/route.js for example)
// App/api/reviews GET from seasons table
// No need to login
// Add some kind of pulldown bar or something to add season to reviews

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request) {
    const seasons = await prisma.season.findMany();
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify(seasons),
    // };
    return NextResponse.json(seasons);
}