# Taskboard: MERN stack (MongoDB, Express, React, Node)

A full-stack task manager with sign-up / sign-in (JWT) and per-user tasks.

## Features
- Register, log in, stay signed in (JWT with 7-day expiry, passwords hashed with bcrypt)
- Create, edit (double-click a title), complete, prioritise and delete tasks
- Filter by All / To do / Done, with a progress bar
- Each user only sees their own tasks

## Structure
```
mern-taskboard/
├── server/            Express API + Mongoose models
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/User.js, Task.js
│   ├── routes/auth.js, tasks.js
│   └── server.js
└── client/            React (Vite) front end
    └── src/  App.jsx, AuthContext.jsx, api.js, pages/, components/
```

## Run it
1. Install Node 18+ and MongoDB (local), or create a free MongoDB Atlas cluster.
2. Install everything:
   ```
   npm run install:all
   ```
3. Edit `server/.env`. Set `MONGO_URI` and a long random `JWT_SECRET`.
4. Start the API (port 5000) and React app (port 5173) together:
   ```
   npm run dev
   ```
5. Open http://localhost:5173

## API
| Method | Route | Purpose |
|---|---|---|
| POST | /api/auth/register | Create account, returns token |
| POST | /api/auth/login | Log in, returns token |
| GET | /api/auth/me | Current user (token required) |
| GET | /api/tasks?status=active or done | List my tasks |
| POST | /api/tasks | Create task {title, priority} |
| PUT | /api/tasks/:id | Update {title?, priority?, done?} |
| DELETE | /api/tasks/:id | Delete task |

Send `Authorization: Bearer <token>` on protected routes.

## Deploying
- Build the client: `npm run build --prefix client`, then host `client/dist` on Netlify or Vercel.
- Host `server/` on Render or Railway and set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
- In production, point `client/src/api.js` at your API URL (or add a rewrite/proxy).
