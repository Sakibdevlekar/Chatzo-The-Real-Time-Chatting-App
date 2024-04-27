import express from "express";
import {BASE_URL} from "./constant/config.constant.js"


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export { app };
