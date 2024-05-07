import { Router } from "express";
const router = Router();
import {
    adminLogin,
    adminLogout,
    allChats,
    allMessages,
    allUsers,
    getAdminData,
    getDashboardStats,
} from "../controllers/admin.controller.js";
import { adminLoginValidator } from "../validators/user.validator.js";
import { validateHandler } from "../validators/validationResult.js";
import { adminOnly } from "../middlewares/auth.middleware.js";


router.post("/verify", adminLoginValidator(), validateHandler, adminLogin);

router.get("/logout", adminLogout);

// Only Admin Can Accecss these Routes

console.count("adminReq>>>>>>>>>>>>");
router.use(adminOnly);
console.count("adminReq>>>>>>>>>>>>");

router.get("/", getAdminData);

router.get("/users", allUsers);
router.get("/chats", allChats);
router.get("/messages", allMessages);

router.get("/stats", getDashboardStats);

export { router as adminRoutes };
