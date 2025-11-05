# Pulse Forum

A small forum application supporting posts, comments, likes, and moderator
flagging.


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
├── local_env_vars
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
git clone https://github.com/<your-username>/pulseforum.git
cd pulseforum
```

2. Start MySQL in Docker (the compose will initialize DB with schema & seed)
```bash
docker-compose up -d
```

3. Install backend dependencies and run (development)
```bash
cd backend
npm install
npm run dev
```

4. Install frontend dependencies and run (development)
```bash
cd ../frontend
npm install
npm run dev
```


