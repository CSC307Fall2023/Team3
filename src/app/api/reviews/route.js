import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";


// gets all reviews by the user
export async function GET(request) {
  const loggedInData = await checkLoggedIn();
  if (!loggedInData.loggedIn) {
    return NextResponse.json({error: 'not signed in'}, {status: 403});
  }

  const reviews = await prisma.review.findMany({
    where: {
      userId: {
        equals: loggedInData.user?.id
      }
    }
  });

  console.log(reviews);

  return NextResponse.json(reviews)
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
  if (seasonId === null || !("id" in seasonId)) {
    return null;
  }
  return seasonId["id"];
}


// request should have placeId, latitude, longitude, seasonName, and score
// (seasonName can be the Season's name or id)
// has the restriction of one review per user per listing per season
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

  const {placeId, latitude, longitude, seasonName, score} = data;

  // specify true to create new listing if there is no listing with this placeId
  const listingId = await getListingId(placeId, true, latitude, longitude);
  // if seasonName is an integer, assume it is the seasonId
  let seasonId;
  if (Number.isInteger(seasonName) || Number.isInteger(parseInt(seasonName))) {
    seasonId = parseInt(seasonName);
  }
  // otherwise, assume it is the string name and look up its id
  else {
    seasonId = await getSeasonId(seasonName);
  }

  // make sure everything is valid
  if (latitude === null) {
    return NextResponse.json({error: `latitude is null`}, {status: 500});
  }
  if (longitude === null) {
    return NextResponse.json({error: `longitude is null`}, {status: 500});
  }
  if (seasonId === null) {
    return NextResponse.json({error: `season ${seasonName} does not exist`}, {status: 500});
  }
  if (!Number.isInteger(score)) {
    return NextResponse.json({error: `score ${score} is not an Integer`}, {status: 500});
  }

  // the backend will enforce one review per user per listing per season. 
  // not ideal, but at this point it's easier than plunging into the frontend
  const reviewsUpdated = await prisma.review.updateMany({
    where: {
      userId: {
        equals: loggedInData.user?.id
      }, 
      listingId: {
        equals: listingId
      },
      seasonId: {
        equals: seasonId
      }
    }, 
    data: {
      score: score
    }
  });
  if (reviewsUpdated.count > 0) {
    return NextResponse.json(reviewsUpdated);
  }

  // if no reviews were updated, create a new review
  const review = await prisma.review.create({
    data: {
        userId: loggedInData.user?.id, 
        listingId: listingId, 
        seasonId: seasonId, 
        score: score, 
    }
  });
  return NextResponse.json(review);
}


// delete reviews by the user (delete all if fields not specified)
// optional fields: placeId, seasonName
export async function DELETE(request) {
  const loggedInData = await checkLoggedIn();
  if (!loggedInData.loggedIn) {
    return NextResponse.json({error: 'not signed in'}, {status: 403});
  }

  let data;
  var placeId, seasonName;
  try {
    data = await request.json();
    var {placeId, seasonName} = data;
  }
  catch(error) {
    placeId = null;
    seasonName = null;
  }

  // convert to ids
  const listingId = await getListingId(placeId);
  const seasonId = await getSeasonId(seasonName);

  const reviews = await prisma.review.deleteMany({
    where: {
      userId: {
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


// update score for all of a user's reviews of a listing for a season
// required fields: placeId, seasonName, newScore
export async function PATCH(request) {
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

  const {placeId, seasonName, newScore} = data;
  // convert to ids
  const listingId = await getListingId(placeId);
  const seasonId = await getSeasonId(seasonName);
  // make sure placeId, seasonId and newScore are valid
  if (listingId == null) {
    return NextResponse.json({error: `listing with placeId ${placeId} does not exist`}, {status: 500});
  }
  if (seasonId === null) {
    return NextResponse.json({error: `season ${seasonName} does not exist`}, {status: 500});
  }
  if (newScore === null || !Number.isInteger(newScore)) {
    return NextResponse.json({error: `newScore ${newScore} is not an Integer`}, {status: 500});
  }

  const reviews = await prisma.review.updateMany({
    where: {
      userId: {
        equals: loggedInData.user?.id
      }, 
      listingId: {
        equals: listingId
      },
      seasonId: {
        equals: seasonId
      }
    }, 
    data: {
      score: newScore
    }
  });
  return NextResponse.json(reviews);
}
