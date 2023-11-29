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

Initialize the database (from the Team3/ directory).
```bash
node db_seeding/seed.js
```

Finally, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
