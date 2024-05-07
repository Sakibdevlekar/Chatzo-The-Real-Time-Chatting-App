import jwt from "jsonwebtoken";
import { asyncHandler, ApiError } from "../utils/helper.util.js";
import { User } from "../models/user.models.js";

const isAuthenticated = asyncHandler((req, res, next) => {
    if (req.cookies["chatzo-admin-token"] && req.path == "/data") {
        return next()
    }
    const token = req.cookies["chatzo-access-token"];
    if (!token) throw new ApiError(401, "Please login to access this route");

    const decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);

    req.user = decodedData.userId;

    next();
});

const adminOnly = (req, res, next) => {
    const token = req.cookies["chatzo-admin-token"];
    console.log('adminToken>>>>>>',req.path);

    if (!token) throw new ApiError(401, "Only Admin can access this route");

    const secretKey = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    const isMatched = secretKey === process.env.ADMIN_SECRET_KEY;

    if (!isMatched) throw new ApiError(401, "Only Admin can access this route");

    next();
};

const socketAuthenticator = async (err, socket, next) => {
    try {
        if (err) return next(err);

        const authToken = socket.request.cookies["chatzo-access-token"];
        if (!authToken)
            return next(
                new ApiError(401, "Invalid token. Please login again."),
            );

        const decodedData = jwt.verify(
            authToken,
            process.env.JWT_ACCESS_SECRET_KEY,
        );

        const user = await User.findById(decodedData.userId);

        if (!user)
            return next(
                new ApiError(401, "User not found. Please login again."),
            );
        socket.user = user;
        return next();
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(401, "Authentication failed. Please login again."),
        );
    }
};

export { isAuthenticated, adminOnly, socketAuthenticator };
