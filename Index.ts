import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
require('dotenv').config();


import activityLogger from "./middlewares/activityLogger";
import postsRoute from "./routes/postsRoute";
import usersRoute from "./routes/usersRoute";
import oauthRoute from "./routes/oauthRoute";
import requestRoute from "./routes/requestRoute";
import adminRoute from "./routes/adminRoute";


export const app = express();
const port = 4000;

app.use(cors({
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(cookieParser());

app.use(express.json());

app.use(activityLogger);

app.use("/posts", postsRoute);

app.use("/users", usersRoute);

app.use("/requests", requestRoute);

app.use("/oauth", oauthRoute);

app.use("/oauth/get-token-cookie", oauthRoute);

app.use("/admin", adminRoute);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })