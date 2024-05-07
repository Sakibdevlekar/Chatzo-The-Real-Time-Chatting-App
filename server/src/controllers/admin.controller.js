import jwt from "jsonwebtoken";
import { asyncHandler, ApiResponse, ApiError } from "../utils/helper.util.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.models.js";
import { cookieOptions } from "../constant/config.constant.js";

/**
 * @async
 * @function adminLogin
 * @param {object} req - The request object containing the secret key.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {object} The response containing a success message and authentication token.
 * @description Authenticates the admin using a secret key and generates an authentication token.
 */
const adminLogin = asyncHandler(async (req, res, next) => {
    const { secretKey } = req.body;

    // Check if the secret key matches the admin secret key
    const isMatched = secretKey === process.env.ADMIN_SECRET_KEY;

    if (!isMatched) throw new ApiError(401, "Invalid Admin Key");

    // Generate JWT token using the secret key
    const token = jwt.sign(secretKey, process.env.ADMIN_JWT_SECRET);

    // Send the token as a cookie and a success response
    return res
        .status(200)
        .cookie("chatzo-admin-token", token, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {},
                "Authenticated Successfully, Welcome back",
            ),
        );
});

/**
 * @async
 * @function adminLogout
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {object} The response containing a success message for logging out.
 * @description Logs out the admin by clearing the authentication token cookie.
 */
const adminLogout = asyncHandler(async (req, res, next) => {
    // Clear the admin authentication token cookie
    return res
        .status(200)
        .cookie("chattu-admin-token", "", {
            ...cookieOptions,
            maxAge: 0,
        })
        .json(new ApiResponse(200, {}, "Logged Out Successfully"));
});

/**
 * @async
 * @function getAdminData
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {object} The response containing admin data and a success message.
 * @description Retrieves admin data and confirms successful retrieval.
 */
const getAdminData = asyncHandler(async (req, res, next) => {
    // Return admin data in the response
    return res
        .status(200)
        .json(new ApiResponse(200, { admin: true }, "Successful"));
});

/**
 * @async
 * @function allUsers
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} The response containing user data and a success message.
 * @description Retrieves all users along with their statistics and returns them in the response.
 */
const allUsers = asyncHandler(async (req, res) => {
    // Find all users and populate group and friend counts for each user
    const users = await User.find({});

    const transformedUsers = await Promise.all(
        users.map(async ({ name, username, avatar, _id }) => {
            const [groups, friends] = await Promise.all([
                Chat.countDocuments({ groupChat: true, members: _id }),
                Chat.countDocuments({ groupChat: false, members: _id }),
            ]);

            return {
                name,
                username,
                avatar: avatar.url,
                _id,
                groups,
                friends,
            };
        }),
    );

    // Send the transformed user data in the response
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { users: transformedUsers },
                "Users fetched successfully",
            ),
        );
});

/**
 * @async
 * @function allChats
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} The response containing chat data and a success message.
 * @description Retrieves all chats along with their details and returns them in the response.
 */
const allChats = asyncHandler(async (req, res) => {
    // Find all chats and populate member and creator details for each chat
    const chats = await Chat.find({})
        .populate("members", "name avatar")
        .populate("creator", "name avatar");

    const transformedChats = await Promise.all(
        chats.map(async ({ members, _id, groupChat, name, creator }) => {
            const totalMessages = await Message.countDocuments({ chat: _id });

            return {
                _id,
                groupChat,
                name,
                avatar: members.slice(0, 3).map((member) => member.avatar.url),
                members: members.map(({ _id, name, avatar }) => ({
                    _id,
                    name,
                    avatar: avatar.url,
                })),
                creator: {
                    name: creator?.name || "None",
                    avatar: creator?.avatar.url || "",
                },
                totalMembers: members.length,
                totalMessages,
            };
        }),
    );

    // Send the transformed chat data in the response
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { chats: transformedChats },
                "Chats fetched successfully",
            ),
        );
});

/**
 * @async
 * @function allMessages
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} The response containing message data and a success message.
 * @description Retrieves all messages along with their details and returns them in the response.
 */
const allMessages = asyncHandler(async (req, res) => {
    // Find all messages and populate sender and chat details for each message
    const messages = await Message.find({})
        .populate("sender", "name avatar")
        .populate("chat", "groupChat");

    const transformedMessages = messages.map(
        ({ content, attachments, _id, sender, createdAt, chat }) => ({
            _id,
            attachments,
            content,
            createdAt,
            chat: chat._id,
            groupChat: chat.groupChat,
            sender: {
                _id: sender._id,
                name: sender.name,
                avatar: sender.avatar.url,
            },
        }),
    );

    // Send the transformed message data in the response
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { messages: transformedMessages },
                "Messages fetched successfully",
            ),
        );
});

/**
 * @async
 * @function getDashboardStats
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} The response containing dashboard statistics and a success message.
 * @description Retrieves statistics for the dashboard and returns them in the response.
 */
const getDashboardStats = asyncHandler(async (req, res) => {
    // Get counts for groups, users, messages, and total chats
    const [groupsCount, usersCount, messagesCount, totalChatsCount] =
        await Promise.all([
            Chat.countDocuments({ groupChat: true }),
            User.countDocuments(),
            Message.countDocuments(),
            Chat.countDocuments(),
        ]);

    // Calculate message counts for the last 7 days
    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last7DaysMessages = await Message.find({
        createdAt: {
            $gte: last7Days,
            $lte: today,
        },
    }).select("createdAt");

    const messages = new Array(7).fill(0);
    const dayInMiliseconds = 1000 * 60 * 60 * 24;

    last7DaysMessages.forEach((message) => {
        const indexApprox =
            (today.getTime() - message.createdAt.getTime()) / dayInMiliseconds;
        const index = Math.floor(indexApprox);

        messages[6 - index]++;
    });

    const stats = {
        groupsCount,
        usersCount,
        messagesCount,
        totalChatsCount,
        messagesChart: messages,
    };

    // Send the dashboard statistics in the response
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                stats,
                "Dashboard statistics fetched successfully",
            ),
        );
});

export {
    allUsers,
    allChats,
    allMessages,
    getDashboardStats,
    adminLogin,
    adminLogout,
    getAdminData,
};
