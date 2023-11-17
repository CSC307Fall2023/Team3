# Database Seeding

## seed.js
    - the script that populates the database for the demo
    - everything is deterministic except the scores for each review
### to seed everything (from the Team3/ directory):
```bash
node db_seeding/seed.js -a
```
### to seed only the User and Season tables:
```bash
node db_seeding/seed.js
```


## seasons.csv
    - has seasons data for Halloween, Thanksgiving, and Christmas, from 2023 to 2033
    - columns: name, start, end
    - created by create_seasons_csv.js
    - read by seed.js to populate the Seasons table


## listings.csv
    - has data for various listings that will be used in seeded reviews
    - columns: placeId, latitude, and longitude
    - read by seed.js to populate the Reviews and Listings tables