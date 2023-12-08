// Todo: implement GET for listings

// TODO: implement HTTP requests to get data from the database
// currently copied from src/app/api/todos/route.js

// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";
// import { checkLoggedIn } from "@/lib/auth";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// basic GET function. 
export async function GET(request, { params })
{   
    const inputId = parseInt(params.id);
    console.log("input: ", inputId);

    const listings = await prisma.Listing.findFirst({
        where: {
            id: inputId
        }
    });
    return NextResponse.json(listings)
}

// I think we need to use include if we want specific info from Listings. B/c we'll want a listings panel on 
// our site that can display review/rating, address information, etc.
// export async function GET(request) {
//     try {
//         const listings = await prisma.listings.findMany({
//             include: {
//                 reviews: true, // Include reviews associated with each listing
//             },
//         });

//         return NextResponse.json(listings);
//     } catch (error) {
//         console.error("Error fetching listings:", error);
//         return NextResponse.error("Internal Server Error", { status: 500 });
//     }
// }

// export async function GET(request){
//     try
//     {

//     }
//     catch(error)
//     {
//         console.error("Error fetching listings:", error);
//         return NextResponse.error("Internal Server Error", {status: 500});
//     }
// }