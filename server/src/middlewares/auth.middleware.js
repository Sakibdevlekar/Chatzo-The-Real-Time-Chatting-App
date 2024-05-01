import jwt from "jsonwebtoken";
import { asyncHandler, ApiError } from "../utils/helper.util.js";
import { User } from "../models/user.models.js";

const isAuthenticated = asyncHandler((req, res, next) => {
    const token = req.cookies["chatzo-access-token"];
    if (!token) throw new ApiError(401, "Please login to access this route");

    const decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);

    req.user = decodedData.userId;

    next();
});

const adminOnly = (req, res, next) => {
    const token = req.cookies["chattu-admin-token"];

    if (!token) throw new ApiError(401, "Only Admin can access this route");

    const secretKey = jwt.verify(token, process.env.JWT_SECRET);

    const isMatched = secretKey === process.env.ADMIN_SECRET_KEY;

    if (!isMatched) throw new ApiError(401, "Only Admin can access this route");

    next();
};

const socketAuthenticator = async (err, socket, next) => {
    try {
        if (err) return next(err);

        const authToken = socket.request.cookies[CHATTU_TOKEN];

        if (!authToken)
            throw new ApiError(401, "Please login to access this route");

        const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

        const user = await User.findById(decodedData._id);

        if (!user)
            throw (
                (new ApiError(401, "Please login to access this route"),
                (socket.user = user))
            );

        return next();
    } catch (error) {
        console.log(error);
        throw new ApiError(401, "Please login to access this route");
    }
};

export { isAuthenticated, adminOnly, socketAuthenticator };
