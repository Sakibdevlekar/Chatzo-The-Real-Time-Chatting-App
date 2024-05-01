import { Router } from "express";
const router = Router();
import {
    registerUser,
    loginUser,
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
    sendRequestValidator,
    acceptRequestValidator
} from "../validators/user.validator.js";
import { validateHandler } from "../validators/validationResult.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { singleAvatar } from "../middlewares/handleUpload.middleware.js";

router.post(
    "/new",
    singleAvatar,
    registerValidator(),
    validateHandler,
    registerUser,
);

router.post("/login", loginValidator(), validateHandler, loginUser);

// After here user must be logged in to access the routes

router.use(isAuthenticated);

router.get("/me", getMyProfile);

router.get("/logout", logoutUser);

router.get("/search", searchUser);

router.put(
    "/sendrequest",
    sendRequestValidator(),
    validateHandler,
    sendFriendRequest,
);

router.put(
    "/acceptrequest",
    acceptRequestValidator(),
    validateHandler,
    acceptFriendRequest,
);

router.get("/notifications", getMyNotifications);

router.get("/friends", getMyFriends);

export { router as userRoutes };
