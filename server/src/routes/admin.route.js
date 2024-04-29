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

const app = express.Router();

app.post("/verify", adminLoginValidator(), validateHandler, adminLogin);

app.get("/logout", adminLogout);

// Only Admin Can Accecss these Routes

app.use(adminOnly);

app.get("/", getAdminData);

app.get("/users", allUsers);
app.get("/chats", allChats);
app.get("/messages", allMessages);

app.get("/stats", getDashboardStats);

export { router as adminRoutes };
