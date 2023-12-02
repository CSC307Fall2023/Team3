## DecorMaps Demo Instructions

Get a database running. You will need [Docker](https://docs.docker.com/engine/install/) installed on your machine. 
```bash
docker-compose up
```

Make sure all your node modules are installed. If this doesn't work, you'll have to [install Node](https://nodejs.org/en/download).
```bash
npm install
```

Make sure the database is migrated. 
```bash
npx prisma migrate dev
```
If there is an issue with migrating the database, delete the folder "prisma/migrations" and try again.

To set up the file with the Google Maps API key, create a file called ".env.local" in the Team3/ directory. 
The file should contain:
```
NEXT_PUBLIC_MAPS_KEY="YOUR_API_KEY_HERE"
NEXT_PUBLIC_ETERNAL_SEASON="Christmas 2023"
```
Replace "YOUR_API_KEY_HERE" with a Google Maps API key (email superjoeyd123@gmail.com to ask for Joe's key).

Initialize the database.
```bash
node db_seeding/seed.js -a
```

Run the development server.
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Things to try:
* log in with one of the sample accounts
    * username: alice@gmail.com, password: password
    * username: bob@gmail.com, password: password
* click on the map to place a pin
* click the "Review" button, leave a rating, and click "Submit Review"
* open up Prisma Studio (npx prisma studio) and confirm that the review is in the Review table
    * if the database was seeded with the -a option, your reviews will start at number 104
    * the userId should match the id of the User that is signed in
