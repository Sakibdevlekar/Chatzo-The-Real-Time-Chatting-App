import mongoose from "mongoose";
import { DB_NAME } from "../constant/config.constant.js";
import { ApiError } from "../utils/helper.util.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`,
        );
        console.log(
            `MongoDB connected !! DB HOST:${connectionInstance.connection.host}`,
        );
    } catch (error) {
        // console.log('MONGODB connection failed',error);
        throw new ApiError(500, `MongoDB connection failed ${error.message}`);
    }
};

export { connectDB };
