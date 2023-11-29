## Getting Started

First, get a database running. You will need Docker installed on your machine. 

```bash
docker-compose up
```

Then, make sure all your node modules are installed.
```bash
npm install
```

Make sure the database is migrated. 
```bash
npx prisma migrate dev
```

To set up the file with the Google Maps API key, create a file called ".env.local" in the Team3/ directory. 
The file should contain:
```
NEXT_PUBLIC_MAPS_KEY="YOUR_API_KEY_HERE"
NEXT_PUBLIC_ETERNAL_SEASON="Christmas 2023"
```
Replace "YOUR_API_KEY_HERE" with a Google Maps API key (email superjoeyd123@gmail.com to ask for Joe's key).

Initialize the database (from the Team3/ directory).
```bash
node db_seeding/seed.js
```

Finally, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Things to try:
* log in with one of the sample accounts
    * username: alice@gmail.com, password: password
    * username: bob@gmail.com, password: password
* click on the map to place a pin
* click the "Review" button, leave a rating, select a season, and click "Submit Review"
