import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});
import { io, server } from "./app.js";
import { v4 as uuid } from "uuid";
import { connectDB } from "./configs/db.config.js";
const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV?.trim() || "PRODUCTION";
import { getSockets } from "./lib/helper.lib.js";
import { Message } from "./models/message.model.js";
import {
    ALERT,
    REFETCH_CHATS,
    NEW_ATTACHMENT,
    NEW_MESSAGE_ALERT,
    NEW_REQUEST,
    NEW_MESSAGE,
    START_TYPING,
    STOP_TYPING,
    CHAT_JOINED,
    CHAT_LEAVED,
    ONLINE_USERS,
} from "./constant/event.constant.js";
export const userSocketIDs = new Map();
const onlineUsers = new Set();

io.use((socket, next) => {
    cookieParser()(
        socket.request,
        socket.request.res,
        async (err) => await socketAuthenticator(err, socket, next),
    );
});

io.on("connection", (socket) => {
    const user = socket.user;
    userSocketIDs.set(user._id.toString(), socket.id);
    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender: {
                _id: user._id,
                name: user.name,
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        };

        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId,
        };
        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealTime,
        });
        io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });
        try {
            await Message.create(messageForDB);
        } catch (error) {
            throw new Error(error);
        }
    });

    socket.on("disconnect", () => {
        userSocketIDs.delete(user._id.toString());
        onlineUsers.delete(user._id.toString());
        socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
    });
});

connectDB().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on port ${port} in ${envMode} Mode`);
    });
});
