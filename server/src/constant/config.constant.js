const DB_NAME = "Chatzo";
const BASE_URL = "/api/v1";

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
};

export { DB_NAME, BASE_URL, cookieOptions };
