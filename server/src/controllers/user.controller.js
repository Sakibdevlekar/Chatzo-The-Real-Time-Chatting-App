import { User } from "../models/user.models.js";
import { asyncHandler, ApiResponse, ApiError } from "../utils/helper.util.js";
import { compare } from "bcrypt";

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

export {
    registerUser,
    // login,
    logoutUser,
    // acceptFriendRequest,
    // getMyFriends,
    // getMyNotifications,
    // getMyProfile,
    // searchUser,
    // sendFriendRequest,
};
