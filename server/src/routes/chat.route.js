import { Router } from "express";
const router = Router();
import {
    newGroupChat,
    getMyChats,
    getMyGroups,
    addMembers,
    removeMember,
    leaveGroup,
    sendAttachments,
    getChatDetails,
    renameGroup,
    deleteChat,
    getMessages,
} from "../controllers/chat.controller.js";
import { attachmentsMulter } from "../middlewares/handleUpload.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

// After here user must be logged in to access the routes
router.use(isAuthenticated);

router.post("/new", newGroupChat);

router.get("/my", getMyChats);

router.get("/my/groups", getMyGroups);

router.put("/add/members", addMembers);

router.put("/remove/member", removeMember);

router.put("/leave/:id", leaveGroup);

router.post("/message", attachmentsMulter, sendAttachments);

router.get("/messages/:id", getMessages);

router.get("/chat/:id", getChatDetails).put(renameGroup).delete(deleteChat);

export { router as chatRoutes };
