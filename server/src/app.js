import express from "express";
import { BASE_URL } from "./constant/config.constant.js";
import {errorHandler} from "./middlewares/error.middleware.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Route Import */

import { userRoutes } from "./routes/user.route.js";

/* Route use*/
app.use(`${BASE_URL}/user`, userRoutes);



app.use(errorHandler);

export { app };
