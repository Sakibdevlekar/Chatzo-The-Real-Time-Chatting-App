import { Router } from "express";
const router = Router();
import {
    registerUser,
    login,
    logoutUser,
    acceptFriendRequest,
    getMyFriends,
    getMyNotifications,
    getMyProfile,
    searchUser,
    sendFriendRequest,
} from "../controllers/user.controller.js";
import {
    loginValidator,
    registerValidator,
} from "../validators/user.validator.js";
import { validateHandler } from "../validators/validationResult.js";
import { singleAvatar } from "../middlewares/handleUpload.middleware.js";

app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);

app.post("/login", loginValidator(), validateHandler, login);

// After here user must be logged in to access the routes

app.use(isAuthenticated);

app.get("/me", getMyProfile);

app.get("/logout", logout);

app.get("/search", searchUser);

app.put(
    "/sendrequest",
    sendRequestValidator(),
    validateHandler,
    sendFriendRequest,
);

app.put(
    "/acceptrequest",
    acceptRequestValidator(),
    validateHandler,
    acceptFriendRequest,
);

app.get("/notifications", getMyNotifications);

app.get("/friends", getMyFriends);

export { router as userRoutes };
