const bcrypt = require('bcryptjs');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



// creates a record in the Season table
async function insertSeason(name, start, end) {
    const season = await prisma.season.create({
        data: {
            name: name, 
            start: start, 
            end: end,
        }
    });

    console.log(`inserted '${[name, start, end].join(", ")}' into Season table`);
    return season;
}


// seeds Seasons based on data in a csv file
async function seedSeasons() {
    console.log("seeding seasons...");

    let seasonCount = 0;

    const filepath = "db_seeding/seasons.csv";
    let data = fs.readFileSync(filepath, "utf8").split("\n");

    let name, start, end
    for (const line of data) {
        [name, start, end] = line.split(", ").map(s => s.trim());
        if (name && start && end) {
            const nameData = await prisma.season.findMany({
                where: {
                    name: {
                        equals: name
                    }
                }
            });

            if (nameData.length > 0) {
                console.log(`skipping '${name}' because it already exists`);
            }
            else {
                await insertSeason(name, start, end);
                seasonCount++;
            }
        }
    }

    console.log(`finished seeding ${seasonCount} seasons`);
}



// creates a record in the User table
async function insertUser(username, email, password) {
    const user = await prisma.user.create({
        data: {
            username: username, 
            email: email, 
            // the hash that this project uses
            password: await bcrypt.hash(password, 10)
        }
    });

    console.log(`inserted '${[username, email, password].join(", ")}' into User table`);
    return user;
}


// seeds Users based on three same-length arrays of usernames, emails, and passwords
async function seedUsers(usernames, emails, passwords) {
    console.log("seeding users...");

    let userCount = 0;

    for (let i = 0; i < usernames.length; i++) {
        const usernameData = await prisma.user.findMany({
            where: {
                username: {
                    equals: usernames[i]
                }
            }
        });
        const emailData = await prisma.user.findMany({
            where: {
                email: {
                    equals: emails[i]
                }
            }
        });

        if (usernameData.length > 0 || emailData.length > 0) {
            console.log(`skipping '${usernames[i]}' with email '${emails[i]}' because the username or email already exists`);
        }
        else {
            await insertUser(usernames[i], emails[i], passwords[i]);
            userCount++;
        }
    }

    console.log(`finished seeding ${userCount} users`);
}



// creates a record in the Listing table
async function insertListing(placeId, lat, lng) {
    const listing = await prisma.listing.create({
        data: {
          placeId: placeId, 
          latitude: lat, 
          longitude: lng, 
        }, 
        select: {
          id: true, 
        }
      });

    console.log(`inserted '${[placeId, lat, lng].join(", ")}' into Listing table`);
    return listing;
}


// creates a record in the Review table
// (a user is allowed to have any number of reviews for a listing, restrictions should be enforced on the frontend)
async function insertReview(userId, placeId, latitude, longitude, seasonId, score) {
    // look up a Listing by the placeId, call insertListing() if there is no Listing with the placeId
    let listingId = await prisma.listing.findUnique({
        where: {
            placeId: placeId
        }, 
        select: {
            id: true, 
        }
    });
    if (listingId === null) {
        let listing = await insertListing(placeId, latitude, longitude);
        listingId = listing.id;
    }
    else {
        listingId = listingId.id;
    }

    const review = await prisma.review.create({
        data: {
            userId: userId, 
            listingId: listingId, 
            seasonId: seasonId, 
            score: score
        }
    });

    console.log(`inserted '${[placeId, score].join(", ")}' into Review table`);
    return review;
}


// seeds Reviews
async function seedReviews(reviewThreshold, testUsername, seasonName) {
    console.log("seeding reviews...");

    let reviewCount = 0;
    const minScore = 1;
    const maxScore = 10;

    // look up test user's id to use in all the reviews
    const userData = await prisma.user.findUnique({
        where: {
            username: testUsername
        }
    });
    if (userData === null) {
        console.log(`ERROR: could not seed Reviews because the test user '${testUsername}' is not in the database`);
        return;
    }
    const userId = userData.id;

    // look up season id to use in all the reviews
    const seasonData = await prisma.season.findUnique({
        where: {
            name: seasonName
        }
    });
    if (seasonData === null) {
        console.log(`ERROR: could not seed Reviews because the season '${seasonName}' is not in the database`);
        return;
    }
    const seasonId = seasonData.id;

    // read data for listings
    const filepath = "db_seeding/listings.csv";
    let data = fs.readFileSync(filepath, "utf8").split("\n");

    let placeId, latitude, longitude, score, count;
    let lastHalf = data.length % 2 != 0 ? Math.floor(data.length / 2) + 1 : data.length / 2;
    let lastQuarter = lastHalf + Math.floor(lastHalf / 2);

    for (let i = 0; i < data.length; i++) {
        [placeId, latitude, longitude] = data[i].split(", ").map(s => s.trim());
        // for about half of the listings, make reviewThreshold reviews, 
        // reviewThreshold-1 for a quarter, and reviewThreshold-2 for the last quarter.
        // this is not great but close enough to half/quarter/quarter
        if (i < lastHalf) count = reviewThreshold;
        else if (i < lastQuarter) count = reviewThreshold - 1;
        else count = reviewThreshold - 2;

        for (let j = 0; j < count; j++) {
            score = Math.floor(Math.random() * (maxScore - minScore + 1) + minScore);  // random score
            await insertReview(userId, placeId, latitude, longitude, seasonId, score);
            reviewCount++;
        }
        console.log();
    }

    console.log(`finished seeding ${reviewCount} reviews`);
}



async function main() {
    // number of reviews needed for a listing to show as a pin on the frontend
    let reviewThreshold = 5;
    // the season name to use for all the seeded reviews (must be in seasons.csv so it can be seeded in the database)
    let seasonName = "Christmas 2023";
    // default behavior is to seed seasons and users, but not reviews (reviews will also seed listings)
    let options = {
        seasons: true, 
        users: true, 
        reviews: false
    };

    // if the "-a" argument is given, set all options to true
    for (let i = 2; i < process.argv.length; i++) {
        if (process.argv[i] === "-a") {
            Object.keys(options).forEach(key => options[key] = true);
        }
    }

    // info for demo accounts that testers can use
    let usernames = ["AliceAndVerdict", "BobOrVegana"];
    let emails = ["alice@gmail.com", "bob@gmail.com"];
    let passwords = ["password", "password"];
    // info for test user that is only used for seeding reviews
    let testUsername = "Test"
    let testEmail = "test@test.com";
    let testPassword = "test";
    // combine demo and test users so seedUsers() gets all of them
    usernames.push(testUsername);
    emails.push(testEmail);
    passwords.push(testPassword);

    if (options.seasons) {
        await seedSeasons();
        console.log();
    }
    if (options.users) {
        await seedUsers(usernames, emails, passwords);
        console.log();
    }
    if (options.reviews) {
        await seedReviews(reviewThreshold, testUsername, seasonName);
        console.log();
    }

    console.log("finished seeding database!");
}



main();
