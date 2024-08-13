# Get started

## DB

### Creating the DB

The Postgres DB runs in a docker container. To Start the DB, run `sh start-database.sh`. You need to have docker installed on your machine. You may find a GUI application like tableplus useful to connect to the DB and be able to easily interact with it, but this should not be essential.

Once you have created the DB, you need to duplicate the `.env.example` fil, rename to `.env` and fill in your values.

Establish connection with the Postres server. Create "yamaha" database.

Run `bun db:push`

### Seeding the DB with data

There is a script located at src/server/db/seed.ts that you can run by using the command `bun run ./src/server/db/seed.ts` from the root of the project. This should connect to the DB and insert some data. The script is not complete yet, so not all entities have sample data. But there is enough in there to get started.

### Using the drizzle studio UI

Run `bun db:studio` to see a really intuitive and helpful UI to allow you to quickly interact with the DB.

## App

Run `bun dev` to start the app. There should be a URL outputted in the terminal that you can visit to see the app running.
