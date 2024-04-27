import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});
import { app } from "./app.js";

const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV?.trim() || "PRODUCTION";

app.listen(port, () => {
    console.log(`Server is running on port ${port} in ${envMode} Mode`);
});
