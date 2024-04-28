import { validationResult } from "express-validator";
import { ApiError } from "../utils/helper.util.js";

const validateHandler = (req, res, next) => {
    const errors = validationResult(req);

    const errorMessages = errors
        .array()
        .map((error) => error.msg)
        .join(", ");

    if (errors.isEmpty()) return next();
    else throw new ApiError(400, errorMessages);
};


export { validateHandler };