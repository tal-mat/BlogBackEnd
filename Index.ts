import express from 'express';
import cors from 'cors';
import activityLogger from "./middlewares/activityLogger";
import addUserHandler from "./middlewares/addUserHandler"
import postsRoute from "./routes/postsRoute";
import usersRoute from "./routes/usersRoute";
import oauthRoute from "./routes/oauthRoute";
import requestRoute from "./routes/requestRoute";

export const app = express();
const port = 4000;

app.use(cors());

app.use(express.json());

app.use(activityLogger);

// app.use(addUserHandler);

app.use("/posts", postsRoute);

app.use("/users", usersRoute);

app.use("/requests", requestRoute);

app.use("/oauth", oauthRoute);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })