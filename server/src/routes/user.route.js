import { Router } from "express";
const router = Router();
import {registerUser,logoutUser} from "../controllers/user.controller.js";

router.post("/register",registerUser);

router.post("/login", async (req, res) => {
    res.send("hello");
});

router.post("/logout", async (req, res) => {
    res.send("hello");
});

export { router as userRoutes };
