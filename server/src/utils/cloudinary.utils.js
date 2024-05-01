import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});
import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./helper.util.js";
import { getBase64 } from "../lib/helper.lib.js";
import { v4 as uuid } from "uuid";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFilesToCloudinary = async (files = []) => {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                getBase64(file),
                {
                    resource_type: "auto",
                    public_id: uuid(),
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
        });
    });

    try {
        const results = await Promise.all(uploadPromises);

        const formattedResults = results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));
        return formattedResults;
    } catch (err) {
        console.log(err);
        throw new ApiError(400, "Error uploading files to cloudinary");
    }
};

const deletFilesFromCloudinary = async (public_ids) => {
    // Delete files from cloudinary
};

export { deletFilesFromCloudinary, uploadFilesToCloudinary };
