import { cookieOptions } from "../constant/config.constant.js";
import { getSockets } from "../lib/helper.lib.js";
import { User } from "../models/user.models.js";
import { ApiError, ApiResponse, asyncHandler } from "./helper.util.js";
import jwt from "jsonwebtoken";

/**
 * @function generateAccessAndRefreshTokens
 * @async
 * @param {string} userId - The unique identifier of the user for whom tokens are generated.
 * @returns {object} An object containing the generated access and refresh tokens.
 * @throws {ApiError} Throws an API error with a 500 status if something goes wrong during token generation.
 * @description This asynchronous function generates access and refresh tokens for a user based on their user ID.
 * It retrieves the user from the database using the provided user ID, generates an access token and a refresh token,
 * associates the refresh token with the user, saves the user with the updated refresh token, and returns the generated tokens.
 */
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        // Retrieve user details from the database based on the provided user ID
        const user = await User.findById(userId);

        let payload = {
            userId: user._id,
        };

        // Generate access and refresh tokens using the user's details
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET_KEY,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            },
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET_KEY,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            },
        );

        // Associate the generated refresh token with the user and save it to the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        // Return the generated access and refresh tokens
        return Promise.resolve({ accessToken, refreshToken });
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * @async
 * @function sendToken
 * @param {object} res - The response object.
 * @param {object} user - The user object for whom tokens are generated.
 * @param {number} code - The HTTP status code to send in the response.
 * @param {string} message - The message to include in the response.
 * @returns {object} The response containing the user object and tokens as cookies.
 * @description  Sends access and refresh tokens to the client after successful authentication.
 * Generates access and refresh tokens for the logged-in user and sets them as cookies in the response.
 */
const sendToken = async (res, user, code, message) => {
    // Generate access and refresh tokens for the logged-in user
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id,
    );

    // Set access and refresh tokens as cookies and send the response
    return res
        .status(code)
        .cookie("chatzo-access-token", accessToken, cookieOptions)
        .cookie("chatzo-refresh-token", refreshToken, cookieOptions)
        .json(new ApiResponse(code, user, message));
};

/**
 * @function emitEvent
 * @param {object} req - The request object.
 * @param {string} event - The event to emit.
 * @param {array} users - An array of user IDs or sockets to emit the event to.
 * @param {object} data - The data to send along with the event.
 * @description Emits an event to specified users or sockets using Socket.IO.
 */
const emitEvent = (req, event, users, data) => {
    const io = req.app.get("io");
    const usersSocket = getSockets(users);
    io.to(usersSocket).emit(event, data);
};

export { emitEvent, sendToken };
