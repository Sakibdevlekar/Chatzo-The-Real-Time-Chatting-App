import express from "express";
import { BASE_URL } from "./constant/config.constant.js";
import { corsOptions } from "./constant/config.constant.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});

app.set("io", io);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:4173",
            String(process.env.CLIENT_URL),
        ],
        credentials: true,
    }),
);

/* Route Import */
import { adminRoutes } from "./routes/admin.route.js";
import { userRoutes } from "./routes/user.route.js";
import { chatRoutes } from "./routes/chat.route.js";

/* Route use*/
app.use(`${BASE_URL}/user`, userRoutes);
app.use(`${BASE_URL}/chat`, chatRoutes);
app.use(`${BASE_URL}/admin`, adminRoutes);

app.all("*", (req, res, next) => {
    res.status(404).json({
        message: "Not found",
    });
});

app.use(errorHandler);

export { app, io, server };
