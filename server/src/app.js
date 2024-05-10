import express from "express";
import { BASE_URL } from "./constant/config.constant.js";
import { corsOptions } from "./constant/config.constant.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { morganMiddleware } from "./logger/morgan.logger.js";
import { apiRateLimiter } from "./utils/apiRateLimiter.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import YAML from "yaml";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import path from "path";
import fs from "fs";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, "./swagger.yaml");
const fileContent = fs.readFileSync(filePath, "utf8");

const hostUrl = process.env.ChtazoAPI_HOST_URL || "http://localhost:3000";
const replacedContent = fileContent?.replace(
    "- url: ${{server}}",
    `- url: ${hostUrl}/api/v1/`,
);

const swaggerDocument = YAML.parse(replacedContent);

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
            "https://chatzo-live.vercel.app",
            String(process.env.CLIENT_URL),
        ],
        credentials: true,
    }),
);
/* The code block `app.use(function (req, res, next) { ... });` is setting up CORS (Cross-Origin
Resource Sharing) headers in your Express application. */
app.use(function (req, res, next) {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://chatzo-live.vercel.app",
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE",
    );
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

/* Route Import */
import { adminRoutes } from "./routes/admin.route.js";
import { userRoutes } from "./routes/user.route.js";
import { chatRoutes } from "./routes/chat.route.js";

/* API  Rate Limiter*/
app.use(apiRateLimiter);

/*API Logger*/
app.use(morganMiddleware);

/* Route use*/
app.use(`${BASE_URL}/user`, userRoutes);
app.use(`${BASE_URL}/chat`, chatRoutes);
app.use(`${BASE_URL}/admin`, adminRoutes);

// * API DOCS
// ? Keeping swagger code at the end so that we can load swagger on "/" route
app.use(
    "/api/v1/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            docExpansion: "none", // keep all the sections collapsed by default
        },
        customSiteTitle: "Chatzo API Docs",
    }),
);
app.all("*", (req, res, next) => {
    res.status(404).json({
        message: "Not found",
    });
});
app.use(errorHandler);

export { app, io, server };
