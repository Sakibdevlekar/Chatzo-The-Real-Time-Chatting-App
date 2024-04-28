import jwt from "jsonwebtoken";
import { adminSecretKey } from "../app.js";
import { asyncHandler, ApiError } from "../utils/helper.util.js";
import { User } from "../models/user.models.js";

const isAuthenticated = asyncHandler((req, res, next) => {
    const token = req.cookies["chatzo-access-token"];
    if (!token) throw new ApiError("Please login to access this route", 401);

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedData._id;

    next();
});

const adminOnly = (req, res, next) => {
    const token = req.cookies["chattu-admin-token"];

    if (!token) throw new ApiError("Only Admin can access this route", 401);

    const secretKey = jwt.verify(token, process.env.JWT_SECRET);

    const isMatched = secretKey === adminSecretKey;

    if (!isMatched) throw new ApiError("Only Admin can access this route", 401);

    next();
};

const socketAuthenticator = async (err, socket, next) => {
    try {
        if (err) return next(err);

        const authToken = socket.request.cookies[CHATTU_TOKEN];

        if (!authToken)
            return next(
                new ErrorHandler("Please login to access this route", 401),
            );

        const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

        const user = await User.findById(decodedData._id);

        if (!user)
            return next(
                new ErrorHandler("Please login to access this route", 401),
            );

        socket.user = user;

        return next();
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Please login to access this route", 401));
    }
};

export { isAuthenticated, adminOnly, socketAuthenticator };
