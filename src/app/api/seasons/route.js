// TODO: seasons GET API (see src/app/api/reviews/route.js for example)
// App/api/reviews GET from seasons table
// No need to login
// Add some kind of pulldown bar or something to add season to reviews

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// export async function GET(request) {
//     const seasons = await prisma.season.findMany();
//     return NextResponse.json(seasons);
// }

export async function GET(request) {
    const currentDate = new Date();

    console.log(currentDate);

    const currentSeason = await prisma.season.findFirst({
        where: {
            start: { lte: currentDate },
            end: { gte: currentDate },
        },
    });

    console.log(currentSeason);

    return NextResponse.json(currentSeason);
}
