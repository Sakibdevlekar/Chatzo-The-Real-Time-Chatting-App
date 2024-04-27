/**
 * @description Common Error class to throw an error from anywhere.
 * The {@link errorHandler} middleware will catch this error at the central place and it will return an appropriate response to the client
 */
class ApiError extends Error {
    /**
     *
     * @param {number} statusCode
     * @param {string} message
     * @param {any[]} errors
     * @param {string} stack
     */
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = "",
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * @class ApiResponse
 * @description Represents the structure of API responses with a standardized format.
 */
class ApiResponse {
    /**
     * @constructor
     * @param {number} statusCode - HTTP status code of the response.
     * @param {any} data - Data to be included in the response.
     * @param {string} [message='Success'] - Message describing the result of the response.
     */
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

// Example Usage:
// const response = new ApiResponse(200, { key: 'value' }, 'Operation successful');
// console.log(response);

/**
 * @function asyncHandler
 * @description Wraps an asynchronous route handler to ensure proper error handling.
 * @param {function} requestHandler - Asynchronous route handler function.
 * @returns {function} Express middleware function with error handling.
 */

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) =>
            next(err),
        );
    };
};

/* Example Usage:
    const asyncRouteHandler = asyncHandler(async (req, res, next) => {     
    Asynchronous operations
    });
    router.get('/example', asyncRouteHandler);
 */

export { ApiError, ApiResponse, asyncHandler };
