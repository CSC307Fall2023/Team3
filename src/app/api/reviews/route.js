import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";


// gets reviews by the logged-in user
// optional fields: placeId, seasonName
export async function GET(request) {
  const loggedInData = await checkLoggedIn();
  if (!loggedInData.loggedIn) {
    return NextResponse.json({error: 'not signed in'}, {status: 403});
  }

  let data;
  try {
    data = await request.json();
  }
  catch(error) {
    console.error(error);
    return NextResponse.json({error: error}, {status: 500}, {data: request});
  }

  // get optional fields from data
  const placeId = Object.hasOwn(data, "placeId") ? data.placeId : null;
  const seasonName = Object.hasOwn(data, "seasonName") ? data.seasonName : null;
  // convert to ids
  const listingId = getListingId(placeId);
  const seasonId = getSeasonId(seasonName);

  const reviews = await prisma.review.findMany({
    where: {
      ownerId: {
        equals: loggedInData.user?.id
      }, 
      // if listingId or seasonId is null, set to undefined so that the prisma query ignores it
      listingId: listingId === null ? undefined : {
        equals: listingId
      },
      seasonId: seasonId === null ? undefined : {
        equals: seasonId
      }
    }
  });
  return NextResponse.json(reviews);
}


// returns the listingId of a placeId, 
// or null if there is no listingId for that placeId and createNewListing is false
async function getListingId(placeId, createNewListing = false, lat = null, lng = null) {
  if (placeId === null) {
    return null;
  }

  const listingId = await prisma.listing.findUnique({
    where: {
      placeId: placeId, 
    }, 
    select: {
      id: true, 
    }
  });

  // if a Listing with the placeId exists, return its id
  if (listingId != null) {
    return listingId["id"];
  }

  if (!createNewListing) {
    return null;
  }

  // otherwise, create a new Listing and return its id
  const newListingId = await prisma.listing.create({
    data: {
      placeId: placeId, 
      latitude: lat, 
      longitude: lng, 
    }, 
    select: {
      id: true, 
    }
  });
  return newListingId["id"];
}


// returns the seasonId of seasonName, or null if there is no season with that name
async function getSeasonId(seasonName) {
  if (seasonName === null) {
    return null;
  }

  const seasonId = await prisma.season.findUnique({
    where: {
      name: seasonName, 
    }, 
    select: {
      id: true, 
    }
  });
  if ("id" in seasonId) {
    return seasonId["id"];
  }
  return null;
}


// request should have placeId, latitude, longitude, seasonName, and score
export async function POST(request) {
  const loggedInData = await checkLoggedIn();
  if (!loggedInData.loggedIn) {
    return NextResponse.json({error: 'not signed in'}, {status: 403});
  }

  let data;
  try {
    data = await request.json();
  }
  catch(error) {
    console.error(error);
    return NextResponse.json({error: error}, {status: 500}, {data: request});
  }

  // check for required fields
  if (!Object.hasOwn(data, "placeId") || !Object.hasOwn(data, "latitude") || !Object.hasOwn(data, "longitude") 
      || !Object.hasOwn(data, "seasonName") || !Object.hasOwn(data, "score")) {
    return NextResponse.json({status: 400}, {data: request});
  }
  const lat = data.latitude;
  const lng = data.longitude;
  const placeId = data.placeId;
  const seasonName = data.seasonName;
  const score = data.score;

  // specify true to create new listing if there is no listing with this placeId
  const listingId = await getListingId(placeId, true, lat, lng);

  const seasonId = await getSeasonId(seasonName);
  // make sure season and score are valid
  if (seasonId === null) {
    return NextResponse.json({error: `season ${seasonName} does not exist`}, {status: 500});
  }
  if (!Number.isInteger(score)) {
    return NextResponse.json({error: `score ${score} is not an Integer`}, {status: 500});
  }

  const review = await prisma.review.create({
    data: {
        userId: loggedInData.user?.id, 
        listingId: listingId, 
        seasonId: seasonId, 
        score: score, 
    }
  })
  return NextResponse.json(review);
}


// export async function DELETE(request) {
//   const loggedInData = await checkLoggedIn();
//   if (!loggedInData.loggedIn) {
//     return NextResponse.json({error: 'not signed in'}, {status: 403});
//   }

//   const index = await request.json();
//   const deleteReview = await prisma.review.delete({
//     where: {
//       id: {
//         equals: index
//       }
//     }, 
//   });
//   return NextResponse.json(index);
// }


// export async function PATCH(request) {
//   const loggedInData = await checkLoggedIn();
//   if (loggedInData.loggedIn) {
//     const { idx, isDone } = await request.json();
//     const updateReview = await prisma.review.update({
//       where: {
//         id: idx
//       }, 
//       data: {
//         done: isDone
//       }, 
//     });
//     return NextResponse.json(isDone);
//   }
//   return NextResponse.json({error: 'not signed in'}, {status: 403});
// }
