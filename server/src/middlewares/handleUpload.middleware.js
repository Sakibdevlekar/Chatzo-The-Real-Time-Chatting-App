import multer from "multer";

/**
 * Multer upload instance with file size limit set to 5MB
 * @constant
 * @type {Multer}
 */
const multerUpload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

/**
 * Middleware for handling single file uploads
 * @function
 * @name singleAvatar
 * @memberof module:MulterConfig
 * @type {MulterMiddleware}
 */
const singleAvatar = multerUpload.single("avatar");

/**
 * Middleware for handling multiple file uploads (up to 5 files)
 * @function
 * @name attachmentsMulter
 * @memberof module:MulterConfig
 * @type {MulterMiddleware}
 */
const attachmentsMulter = multerUpload.array("files", 5);

export { singleAvatar, attachmentsMulter };
