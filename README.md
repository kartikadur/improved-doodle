# NodeJs + Express + Firebase

## Setup
- `npm install` to install all the libraries required for the node app
- `npm run firebase:check` to see if the node app is correctly connecting to the firebase analytics store
- `npm run firebase:seed` to generate random data, that will be shown in the React frontend. script was generated with help from AI.

## Setup for local only emulators
- ensure Java versoin 11+ is installed locally
- `npm i -g firebase-tools` to install the tools + CLI required for setting up emulators locally
- `firebase init emulators` and choose not to create a default project
- `npm run emulators` to start the firestore emulator and get access to the firestore UI. 

## Test
- `npm run test` to run all tests once.
- `npm run test:watch` to run all tests in watch mode during development
- tests were created by AI after I defined what needed to be tested.

## Develop
- `npm run dev` to start the development environment
- defaults to port 3000

## Deploy
- `npm run build` to build app, currently only builds the app, in the future should trigger github/actions or an upload pipeline to deploy to production 

## Code Libraries
- `express` for node server
- `zod` for data structure and validation
- `supertest` for testing request / response handling in the node + express app
- `cors`, `dotenv`, and `cross-env` for local development environment handling
- `firebase-admin` general purpose library for access to firestore datastore. Works with both local emulators and GCP. 

## Data Design  
- common data
    - user id: currently uses a uuid structure, but in the future could use user data from when user is logged in
- events
    - currently collects two types of events, `level` and `game`
    - data specific to each event is available as schema in `/src/schema/event`
- data-viz
    - data sent to the React frontend, currently only has three endpoints as detailed in the API Design section below.

## API Design 
- `GET /health` to check server is running
- For React Frontend use
    - `GET /data-viz/levels-completed` for data on level completion
    - `GET /data-viz/levels-duration` for data on how long it took users to complete a level
    - `GET /data-viz/game-ended` how the user ended their game
- For Sending data to Firestore / Firebase
    - `POST /event` will receive and correctly validated data in the shape of the schema available at `src/schema/event` before storing in the firestore db.

## Next Steps
- make the setup more robust, in order to automatically detect and work with local emulators in dev environment or with GCP in production.
- add more tests to check for more edge cases.
- setup `.firebaserc` and `firebase.json` to contain configs for local envs that work out of the box.