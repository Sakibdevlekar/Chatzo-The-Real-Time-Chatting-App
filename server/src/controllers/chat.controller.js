import { asyncHandler, ApiResponse, ApiError } from "../utils/helper.util.js";
import { Chat } from "../models/chat.model.js";
import { getOtherMember } from "../lib/helper.lib.js";
import { User } from "../models/user.models.js";
import { Message } from "../models/message.model.js";
import {
    ALERT,
    NEW_MESSAGE,
    NEW_MESSAGE_ALERT,
    REFETCH_CHATS,
} from "../constant/event.constant.js";
import { emitEvent } from "../utils/features.utils.js";

import {
    deletFilesFromCloudinary,
    uploadFilesToCloudinary,
} from "../utils/cloudinary.utils.js";

/**
 * @async
 * @function newGroupChat
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing a success message and status code.
 * @description Creates a new group chat with the specified name and members.
 * Adds the current user to the list of members and emits events to notify users.
 * Emits an ALERT event to all members welcoming them to the group chat.
 * Emits a REFETCH_CHATS event to specified members to refresh their chat list.
 */
const newGroupChat = asyncHandler(async (req, res, next) => {
    const { name, members } = req.body;

    const allMembers = [...members, req.user];

    await Chat.create({
        name,
        groupChat: true,
        creator: req.user,
        members: allMembers,
    });
    // Emit an ALERT event to all members of the group chat
    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
    // Emit a REFETCH_CHATS event to specified members to refresh their chat list
    emitEvent(req, REFETCH_CHATS, members);

    return res.status(201).json(new ApiResponse(201, {}, "Group Created"));
});

/**
 * @async
 * @function getMyChats
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing chats and a success message.
 * @description Retrieves chats where the current user is a member and transforms them for display.
 */
const getMyChats = asyncHandler(async (req, res, next) => {
    // Find all chats where the current user is a member and populate member details
    const chats = await Chat.find({ members: req.user }).populate(
        "members",
        "name avatar",
    );

    // Transform the retrieved chats for display
    const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
        // Get the other member in a one-on-one chat
        const otherMember = getOtherMember(members, req.user);

        return {
            _id,
            groupChat,
            avatar: groupChat
                ? members.slice(0, 3).map(({ avatar }) => avatar.url)
                : [otherMember.avatar.url],
            name: groupChat ? name : otherMember.name,
            members: members.reduce((prev, curr) => {
                // Exclude the current user from the members list
                if (curr._id.toString() !== req.user.toString()) {
                    prev.push(curr._id);
                }
                return prev;
            }, []),
        };
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { chats: transformedChats },
                "Chats retrieved successfully",
            ),
        );
});

/**
 * @async
 * @function getMyGroups
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing user's groups and a success message.
 * @description Retrieves groups created by the current user.
 */
const getMyGroups = asyncHandler(async (req, res, next) => {
    // Find group chats where the current user is a member and is the creator
    const chats = await Chat.find({
        members: req.user,
        groupChat: true,
        creator: req.user,
    }).populate("members", "name avatar");

    // Transform the retrieved group chats for display
    const groups = chats.map(({ members, _id, groupChat, name }) => ({
        _id,
        groupChat,
        name,
        avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    }));
    return res
        .status(200)
        .json(new ApiResponse(200, groups, "Groups retrieved successfully"));
});

/**
 * @async
 * @function addMembers
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing a success message.
 * @throws {ApiError} If the chat is not found, not a group chat, or user is not allowed to add members.
 * @throws {ApiError} If the group members limit is reached.
 * @description Adds new members to a group chat.
 */
const addMembers = asyncHandler(async (req, res, next) => {
    // Extract chatId and members from the request body
    const { chatId, members } = req.body;

    // Find the chat by its ID
    const chat = await Chat.findById(chatId);

    // Throw an error if the chat is not found
    if (!chat) throw new ApiError(404, "Chat not found");

    // Throw an error if the chat is not a group chat
    if (!chat.groupChat) throw new ApiError(404, "This is not a group chat");

    // Throw an error if the current user is not the creator of the group chat
    if (chat.creator.toString() !== req.user.toString())
        throw new ApiError(403, "You are not allowed to add members");

    // Find all new members and retrieve their names
    const allNewMembersPromise = members.map((i) => User.findById(i, "name"));
    const allNewMembers = await Promise.all(allNewMembersPromise);

    // Filter out duplicate members and get their IDs
    const uniqueMembers = allNewMembers
        .filter((i) => !chat.members.includes(i._id.toString()))
        .map((i) => i._id);

    // Add unique members to the chat's member list
    chat.members.push(...uniqueMembers);

    // Check if the group members limit is reached
    if (chat.members.length > 100)
        throw new ApiError(400, "Group members limit reached");

    // Save the chat with the updated member list
    await chat.save();

    // Get the names of all added members
    const allUsersName = allNewMembers.map((i) => i.name).join(", ");

    // Emit an ALERT event to all members of the chat
    emitEvent(
        req,
        ALERT,
        chat.members,
        `${allUsersName} has been added in the group`,
    );

    // Emit a REFETCH_CHATS event to all members of the chat
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res
        .status(200)
        .json(new ApiResponse(200, "ok", "Members added successfully"));
});

/**
 * @async
 * @function removeMember
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing a success message.
 * @throws {ApiError} If the chat is not found, not a group chat, user is not allowed to remove members, or group does not have enough members.
 * @description Removes a member from a group chat.
 */
const removeMember = asyncHandler(async (req, res, next) => {
    // Extract userId and chatId from the request body
    const { userId, chatId } = req.body;

    // Find the chat by its ID and the user that will be removed
    const [chat, userThatWillBeRemoved] = await Promise.all([
        Chat.findById(chatId),
        User.findById(userId, "name"),
    ]);

    // Throw an error if the chat is not found
    if (!chat) throw new ApiError(404, "Chat not found");

    // Throw an error if the chat is not a group chat
    if (!chat.groupChat) throw new ApiError(400, "This is not a group chat");

    // Throw an error if the current user is not the creator of the group chat
    if (chat.creator.toString() !== req.user.toString())
        throw new ApiError(403, "You are not allowed to remove members");

    // Throw an error if the group does not have enough members
    if (chat.members.length <= 3)
        throw new ApiError(400, "Group must have at least 3 members");

    // Get the IDs of all chat members as strings
    const allChatMembers = chat.members.map((i) => i.toString());

    // Remove the specified user from the chat's member list
    chat.members = chat.members.filter(
        (member) => member.toString() !== userId.toString(),
    );

    // Save the chat with the updated member list
    await chat.save();

    // Emit an ALERT event to all members of the chat
    emitEvent(req, ALERT, chat.members, {
        message: `${userThatWillBeRemoved.name} has been removed from the group`,
        chatId,
    });

    // Emit a REFETCH_CHATS event to all members of the chat
    emitEvent(req, REFETCH_CHATS, allChatMembers);

    return res
        .status(200)
        .json(new ApiResponse(200, "ok", "Member removed successfully"));
});

/**
 * @async
 * @function leaveGroup
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing a success message.
 * @throws {ApiError} If the chat is not found, not a group chat, or user cannot leave the group.
 * @description Allows a user to leave a group chat.
 */
const leaveGroup = asyncHandler(async (req, res, next) => {
    // Extract chatId from the request parameters
    const chatId = req.params.id;

    // Find the chat by its ID
    const chat = await Chat.findById(chatId);

    // Throw an error if the chat is not found
    if (!chat) throw new ApiError(404, "Chat not found");

    // Throw an error if the chat is not a group chat
    if (!chat.groupChat) throw new ApiError(400, "This is not a group chat");

    // Filter out the current user from the chat's members
    const remainingMembers = chat.members.filter(
        (member) => member.toString() !== req.user.toString(),
    );

    // Throw an error if the group does not have enough members after leaving
    if (remainingMembers.length < 3)
        throw new ApiError(400, "Group must have at least 3 members");

    // If the current user is the creator, randomly select a new creator from remaining members
    if (chat.creator.toString() === req.user.toString()) {
        const randomElement = Math.floor(
            Math.random() * remainingMembers.length,
        );
        const newCreator = remainingMembers[randomElement];
        chat.creator = newCreator;
    }

    // Update the chat's member list and save the changes
    chat.members = remainingMembers;
    await chat.save();

    // Get the current user's name
    const [user] = await Promise.all([User.findById(req.user, "name")]);

    // Emit an ALERT event to all members of the chat
    emitEvent(req, ALERT, chat.members, {
        chatId,
        message: `User ${user.name} has left the group`,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, "ok", "You have left the group successfully"),
        );
});

/**
 * @async
 * @function sendAttachments
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing the message and a success message.
 * @throws {ApiError} If attachments are not provided, too many attachments, or chat is not found.
 * @description Sends attachments in a message to a chat.
 */
const sendAttachments = asyncHandler(async (req, res, next) => {
    // Extract chatId and files from the request body
    const { chatId } = req.body;
    const files = req.files || [];

    // Throw an error if no attachments are provided
    if (files.length < 1) throw new ApiError(400, "Please Upload Attachments");

    // Throw an error if there are too many attachments
    if (files.length > 5) throw new ApiError(400, "Files Can't be more than 5");

    // Find the chat by its ID and the current user
    const [chat, me] = await Promise.all([
        Chat.findById(chatId),
        User.findById(req.user, "name"),
    ]);

    // Throw an error if the chat is not found
    if (!chat) throw new ApiError(404, "Chat not found");

    // Throw an error if no attachments are provided (again, for redundancy)
    if (files.length < 1) throw new ApiError(400, "Please provide attachments");

    // Upload files to the cloud storage
    const attachments = await uploadFilesToCloudinary(files);

    // Prepare the message data for the database
    const messageForDB = {
        content: "", // You may add content here if needed
        attachments,
        sender: me._id,
        chat: chatId,
    };

    // Prepare the message data for real-time communication
    const messageForRealTime = {
        ...messageForDB,
        sender: {
            _id: me._id,
            name: me.name,
        },
    };

    // Create the message in the database
    const message = await Message.create(messageForDB);

    // Emit a NEW_MESSAGE event to all members of the chat
    emitEvent(req, NEW_MESSAGE, chat.members, {
        message: messageForRealTime,
        chatId,
    });

    // Emit a NEW_MESSAGE_ALERT event to all members of the chat
    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

    return res
        .status(200)
        .json(new ApiResponse(200, message, "Message sent successfully"));
});

/**
 * @async
 * @function getChatDetails
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing the chat details and a success message.
 * @throws {ApiError} If the chat is not found.
 * @description Retrieves details of a chat by ID.
 */
const getChatDetails = asyncHandler(async (req, res, next) => {
    // Check if the query parameter 'populate' is set to 1 for population
    if (req.query.populate === "true") {
        // Find the chat by its ID and populate member details
        const chat = await Chat.findById(req.params.id)
            .populate("members", "name avatar")
            .lean();

        // Throw an error if the chat is not found
        if (!chat) throw new ApiError("Chat not found", 404);

        // Modify the chat object to include only necessary member details
        chat.members = chat.members.map(({ _id, name, avatar }) => ({
            _id,
            name,
            avatar: avatar.url, // Assuming avatar has a 'url' property
        }));

        // Send the modified chat details as a response
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    chat,
                    "Chat details retrieved successfully",
                ),
            );
    } else {
        // If 'populate' query parameter is not provided or set to another value
        // Find the chat by its ID without populating member details
        const chat = await Chat.findById(req.params.id);

        // Throw an error if the chat is not found
        if (!chat) throw new ApiError("Chat not found", 404);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    chat,
                    "Chat details retrieved successfully",
                ),
            );
    }
});

/**
 * @async
 * @function renameGroup
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing the renamed group details and a success message.
 * @throws {ApiError} If the chat is not found, not a group chat, or user cannot rename the group.
 * @description Renames a group chat.
 */
const renameGroup = asyncHandler(async (req, res, next) => {
    // Extract chatId and new name from the request parameters and body
    const chatId = req.params.id;
    const { name } = req.body;

    // Find the chat by its ID
    const chat = await Chat.findById(chatId);

    // Throw an error if the chat is not found
    if (!chat) throw new ApiError(404, "Chat not found");

    // Throw an error if the chat is not a group chat
    if (!chat.groupChat)
        throw new ErrorHandler(400, "This is not a group chat");

    // Throw an error if the current user is not the creator of the group chat
    if (chat.creator.toString() !== req.user.toString())
        throw new ApiError(403, "You are not allowed to rename the group");

    // Update the chat's name and save the changes
    chat.name = name;
    await chat.save();

    // Emit a REFETCH_CHATS event to all members of the chat
    emitEvent(req, REFETCH_CHATS, chat.members);

    // Send a success response with the updated chat details
    return res
        .status(200)
        .json(new ApiResponse(200, chat, "Group renamed successfully"));
});

/**
 * @async
 * @function deleteChat
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing a success message.
 * @throws {ApiError} If the chat is not found or the user is not allowed to delete the chat.
 * @description Deletes a chat including all associated messages and attachments.
 */
const deleteChat = asyncHandler(async (req, res, next) => {
    // Extract chatId from the request parameters
    const chatId = req.params.id;

    // Find the chat by its ID
    const chat = await Chat.findById(chatId);

    // Throw an error if the chat is not found
    if (!chat) throw new ApiError(404, "Chat not found");

    // Get the chat's members for emitting events
    const members = chat.members;

    // Check if the chat is a group chat and if the user is the creator
    if (chat.groupChat && chat.creator.toString() !== req.user.toString())
        throw new ApiError(403, "You are not allowed to delete the group");

    // Check if the chat is a private chat and if the user is a member
    if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
        throw new ApiError(403, "You are not allowed to delete the chat");
    }

    // Find messages with attachments in the chat
    const messagesWithAttachments = await Message.find({
        chat: chatId,
        attachments: { $exists: true, $ne: [] },
    });

    // Extract public_ids of attachments for deletion from cloud storage
    const public_ids = [];
    messagesWithAttachments.forEach(({ attachments }) =>
        attachments.forEach(({ public_id }) => public_ids.push(public_id)),
    );

    // Delete files from cloud storage, chat document, and associated messages
    await Promise.all([
        // deleteFilesFromCloudinary(public_ids), //TODO: make this function
        chat.deleteOne(),
        Message.deleteMany({ chat: chatId }),
    ]);

    // Emit a REFETCH_CHATS event to all members of the chat
    emitEvent(req, REFETCH_CHATS, members);

    // Send a success response
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Chat deleted successfully"));
});

/**
 * @async
 * @function getMessages
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next function in the middleware chain.
 * @returns {object} The response containing messages, total pages, and a success message.
 * @throws {ApiError} If the chat is not found or the user is not allowed to access the chat.
 * @description Retrieves messages from a chat by ID.
 */
const getMessages = asyncHandler(async (req, res, next) => {
    // Extract chatId and page number from the request parameters and query
    const chatId = req.params.id;
    const { page = 1 } = req.query;

    // Define pagination variables
    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    // Find the chat by its ID
    const chat = await Chat.findById(chatId);

    // Throw an error if the chat is not found
    if (!chat) throw new ApiError(404, "Chat not found");

    // Check if the user is a member of the chat
    if (!chat.members.includes(req.user.toString()))
        throw new ApiError(403, "You are not allowed to access this chat");

    // Find messages for the chat, sorted by createdAt, with pagination
    const [messages, totalMessagesCount] = await Promise.all([
        Message.find({ chat: chatId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(resultPerPage)
            .populate("sender", "name")
            .lean(),
        Message.countDocuments({ chat: chatId }),
    ]);

    // Calculate total pages based on the total messages count and result per page
    const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

    // Reverse the order of messages to display latest messages first
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { messages: messages.reverse(), totalPages },
                "Messages retrieved successfully",
            ),
        );
});

export {
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
};
