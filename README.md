# Pulse Forum

A small forum application supporting posts, comments, likes, and moderator
flagging.

![*Pulse*](client/assets/images/pulse_logo.png)



## Technology Stack
A full-stack forum application where users can post messages, like posts, and comment on others' posts. Moderators can flag posts for review.
The application is built using React + TypeScript on the frontend and a Node.js + TypeScript + Express + MySQL backend.

## Project Structure

```
project-root
├── client
│   ├── assets
│   │   ├── fonts
│   │   │   ├── big_blue_terminal
│   │   │   ├── departure_mono
│   │   │   └── hurmit
│   │   └── images
│   │       └── shapes
│   │           └── cube
│   ├── public
│   └── src
│       ├── api
│       │   └── services
│       ├── components
│       │   ├── app
│       │   ├── logo
│       │   └── svg
│       ├── context
│       ├── hooks
│       ├── layouts
│       ├── pages
│       ├── theme
│       ├── types
│       │   └── data_models
│       └── utilities
├── postman_collection
└── server
    └── src
        ├── config
        ├── controllers
        │   ├── auth
        │   │   └── validations
        │   ├── comments
        │   │   └── validations
        │   └── posts
        │       └── validations
        ├── database
        │   ├── bootstrap
        │   └── domains
        │       ├── audit
        │       ├── auth
        │       ├── comments
        │       │   └── methods
        │       ├── posts
        │       ├── session
        │       └── users
        ├── errors
        ├── middleware
        ├── routes
        ├── types
        │   └── data_models
        └── utilities
            └── decorators
```

## Requirements
- Node 16+ (or LTS)
- Docker & Docker Compose (for DB)
- npm
- Postman (optional)

## Quickstart

1. Clone the repository
```bash
git clone https://github.com/JulianSchubel/pulse_forum
cd pulse_forum
```

2. Start the test MySQL database in Docker - the compose will initialize DB with schema & seed. Make sure you run the command in step `6` before running this again.
```bash
docker-compose up -d
```

3. Local environment variables have been included in their respective folders
   (/client/.env.local and /server/.env)

4. Install backend dependencies and run (development)
```bash
cd server
npm install
npm run dev
```

5. Install frontend dependencies and run (development)
```bash
cd ../client
npm install
npm run dev
```
 
6. When you are finished tear-down and clean up the database by running the
   following in the project root.
```bash
docker-compose down -v
```

## Using the Postman Collection
The repository includes preconfigured Postman collections in the
postman_collections directory.

Open Postman and import the following:
- postman_collections/pulse_forum.postman_collection.json
- postman_collections/pulse_forum_local.postman_environment.json

Select the `pulse_forum_local` environment in Postman to automatically set base URLs.
