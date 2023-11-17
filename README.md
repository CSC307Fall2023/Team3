Joe made a diagram :D

Here's one that might describe a more complete flow:
```mermaid
graph TD
    start[Start];
    login[Login/Signup];
    profile[User Profile];
    anonymous[Anonymous View];
    mapView[Map View];
    listing[Listing View];
    pin[Pin Location];
    review[Review Location];
    image[Submit/View Image];
    holiday[Holiday Filter];
    route[Route Selection];
    save[Save Favorite];
    privacy[House Privacy Settings];

    start --> login;
    start --> anonymous;
    login --> profile;
    profile --> mapView;
    anonymous --> mapView;
    mapView --> pin;
    pin --> review;
    mapView --> listing;
    listing --> image;
    mapView --> holiday;
    mapView --> route;
    profile --> save;
    profile --> privacy;
```
## Getting Started

First, get a database running. You will need Docker installed on your machine. 

```bash
docker-compose up
```

Then, make sure all your node modules are installs

```bash
npm install
```

Next, make sure you modify the .env file to have the correct information for database connection. 

Make sure the database is migrated. 

```bash
npx prisma migrate dev
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

- [Prisma Documentation](https://www.prisma.io/docs/getting-started) - the docs for the ORM we are using. 

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Look at your database

```bash
npx prisma studio
```


