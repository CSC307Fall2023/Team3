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
Replace "YOUR_API_KEY_HERE" with a Google Maps API key (use your preferred method to contact Joe, such as emailing superjoeyd123@gmail.com, to ask for Joe's key).

Initialize the database.
```bash
node db_seeding/seed.js
```

Run the development server.
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Things to try:
* click on the map to place a pin
* run ```node db_seeding/seed.js -a``` and then refresh the page to put some example pins on the map (near Cal Poly SLO)
* click "View" for a listing in the sidebar to move the pin to that location
* sign up or log in with one of the sample accounts
    * username: alice@gmail.com, password: password
    * username: bob@gmail.com, password: password
* optional: click the "Pin Current Location" button and allow the app to put a pin at your current location
* click the "Review" button, put in a score, and click "Submit Review"
* refresh the page and scroll down in the sidebar to see the new listing and its score!
