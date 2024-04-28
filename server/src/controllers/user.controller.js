import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.model.js";
import { getOtherMember } from "../lib/helper.lib.js";
import { sendToken } from "../utils/features.utils.js";
import { asyncHandler, ApiResponse, ApiError } from "../utils/helper.util.js";

const registerUser = asyncHandler(async (req, res, next) => {
    const { name, username, password, bio } = req.body;

    const file = req.file;

    if (!file) throw new ApiError("Please Upload Avatar");

    const result = await uploadFilesToCloudinary([file]);

    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
    };

    const user = await User.create({
        name,
        bio,
        username,
        password,
        avatar,
    });

    sendToken(res, user, 201, "User created");
});

/**
 * @function logoutUser
 * @async
 * @param {import("express").Request} req - Express request object containing user details.
 * @param {import("express").Response} res - Express response object for sending the logout response.
 * @returns {void}
 * @description This asynchronous function handles user logout. It removes the refreshToken field from the user document,
 * clears the access and refresh token cookies, and sends a response indicating a successful logout.
 */

const logoutUser = asyncHandler(async (req, res) => {
    // Update the user document to unset the refreshToken field
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from the document
            },
        },
        {
            new: true,
        },
    );

    // Set options for HTTP cookies
    const options = {
        httpOnly: true,
        secure: true,
    };

    // Clear the access and refresh token cookies
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                responseMessage.userMessage.logoutSuccessful,
            ),
        );
});

/**
 * @async
 * @function getMyProfile
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing the user profile and a success message.
 * @throws {ApiError} If the user is not found.
 * @description Retrieves the profile of the logged-in user.
 */
const getMyProfile = asyncHandler(async (req, res, next) => {
    // Find the user by their ID (logged-in user's ID)
    const user = await User.findById(req.user);

    // Throw an error if the user is not found
    if (!user) throw new ApiError(404, "User not found");

    // Send a success response with the user profile
    res.status(200).json(new ApiResponse(200, user, "User profile fetched"));
});

/**
 * @async
 * @function searchUser
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} The response containing the searched users and a success message.
 * @description Searches for users based on the provided name query.
 */
const searchUser = asyncHandler(async (req, res) => {
    // Extract the name query from the request query parameters
    const { name = "" } = req.query;

    // Find all chats where the user is a member (excluding group chats)
    const myChats = await Chat.find({ groupChat: false, members: req.user });

    // Extract all users from my chats (friends or people I have chatted with)
    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

    // Find all users except me and my friends based on the name query
    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUsersFromMyChats }, // Exclude me and my friends
        name: { $regex: name, $options: "i" }, // Case-insensitive name search
    });

    // Modify the response to include only necessary user details
    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url, // Assuming avatar has a 'url' property
    }));

    // Send a success response with the searched users
    return res
        .status(200)
        .json(new ApiResponse(200, users, "User search successful"));
});

/**
 * @async
 * @function sendFriendRequest
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing a success message.
 * @throws {ApiError} If the friend request has already been sent.
 * @description Sends a friend request to a user.
 */
const sendFriendRequest = asyncHandler(async (req, res, next) => {
    // Extract the userId from the request body
    const { userId } = req.body;

    // Check if a friend request already exists between the sender and receiver
    const request = await Request.findOne({
        $or: [
            { sender: req.user, receiver: userId },
            { sender: userId, receiver: req.user },
        ],
    });

    // If a request exists, throw an error
    if (request) throw new ApiError(400, "Request already sent");

    // Create a new friend request
    await Request.create({
        sender: req.user,
        receiver: userId,
    });

    // Emit a NEW_REQUEST event to the receiver
    emitEvent(req, NEW_REQUEST, [userId]);

    // Send a success response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Friend Request Sent"));
});

/**
 * @async
 * @function acceptFriendRequest
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing a success message.
 * @throws {ApiError} If the request is not found or the user is not authorized to accept it.
 * @description Accepts or rejects a friend request.
 */
const acceptFriendRequest = asyncHandler(async (req, res, next) => {
    // Extract requestId and accept status from the request body
    const { requestId, accept } = req.body;

    // Find the request by its ID and populate sender and receiver details
    const request = await Request.findById(requestId)
        .populate("sender", "name")
        .populate("receiver", "name");

    // Throw an error if the request is not found
    if (!request) throw new ApiError(404, "Request not found");

    // Check if the current user is authorized to accept the request
    if (request.receiver._id.toString() !== req.user.toString())
        throw new ApiError(
            401,
            "You are not authorized to accept this request",
        );

    // If accept is false, delete the request and send a rejection response
    if (!accept) {
        await request.deleteOne();
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Friend Request Rejected"));
    }

    // If accept is true, create a new chat and delete the request
    const members = [request.sender._id, request.receiver._id];
    await Promise.all([
        Chat.create({
            members,
            name: `${request.sender.name}-${request.receiver.name}`,
        }),
        request.deleteOne(),
    ]);

    // Emit a REFETCH_CHATS event to the members of the new chat
    emitEvent(req, REFETCH_CHATS, members);

    // Send a success response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Friend Request Accepted"));
});

/**
 * @async
 * @function getMyNotifications
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} The response containing notifications and a success message.
 * @description Retrieves notifications for the logged-in user.
 */
const getMyNotifications = asyncHandler(async (req, res) => {
    // Find friend requests where the user is the receiver and populate sender details
    const requests = await Request.find({ receiver: req.user }).populate(
        "sender",
        "name avatar",
    );

    // Map requests to include necessary sender details in notifications
    const allRequests = requests.map(({ _id, sender }) => ({
        _id,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url, // Assuming avatar has a 'url' property
        },
    }));

    // Send a success response with the notifications
    return res
        .status(200)
        .json(new ApiResponse(200, allRequests, "Notifications fetched"));
});

/**
 * @async
 * @function getMyFriends
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} The response containing friends and a success message.
 * @description Retrieves friends of the logged-in user.
 */
const getMyFriends = asyncHandler(async (req, res) => {
    // Extract chatId from the request query parameters
    const chatId = req.query.chatId;

    // Find all chats where the user is a member (excluding group chats) and populate member details
    const chats = await Chat.find({
        members: req.user,
        groupChat: false,
    }).populate("members", "name avatar");

    // Extract friends from chats, including necessary details
    const friends = chats.map(({ members }) => {
        const otherUser = getOtherMember(members, req.user);

        return {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.avatar.url, // Assuming avatar has a 'url' property
        };
    });

    // If chatId is provided, filter friends based on available members in the chat
    if (chatId) {
        const chat = await Chat.findById(chatId);

        const availableFriends = friends.filter(
            (friend) => !chat.members.includes(friend._id),
        );

        // Send a response with available friends for the chat
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { friends: availableFriends },
                    "Friends fetched",
                ),
            );
    } else {
        // Send a response with all friends if chatId is not provided
        return res
            .status(200)
            .json(200, new ApiResponse(200, { friends }, "Friends fetched"));
    }
});

export {
    registerUser,
    login,
    logoutUser,
    acceptFriendRequest,
    getMyFriends,
    getMyNotifications,
    getMyProfile,
    searchUser,
    sendFriendRequest,
};
