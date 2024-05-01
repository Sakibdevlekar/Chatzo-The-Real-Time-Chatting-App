const DB_NAME = "Chatzo";
const BASE_URL = "/api/v1";

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        process.env.CLIENT_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
};

export { DB_NAME, BASE_URL, cookieOptions, corsOptions };
