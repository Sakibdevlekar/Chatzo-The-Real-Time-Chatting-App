// require('dotenv').config()
import { rateLimit } from "express-rate-limit";
import { ApiResponse } from "../utils/helper.util.js";

/**
 * API Rate Limiter Configuration.
 *
 * @constant {Object} apiRateLimiter
 * @description
 * This configuration object defines rate limiting settings for API requests.
 * It uses the `rateLimit` middleware to limit the number of requests from
 * each IP address within a specified time window.
 */

const apiRateLimiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_TIME * 60 * 1000 || 5 * 60 * 1000, // default is 5 minutes
    max: process.env.MAX_REQUESTS || 1000, // Limit each IP to 5 requests per `window` (here, per 5 minutes)
    skipFailedRequests: true, // If any request not failed that will not count
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) =>
        `${req.protocol}://${req.hostname}${req.originalUrl}`,
    message: async (req, res) => {
        console.log(
            `\n${req.protocol}://${req.hostname}${req.originalUrl} [${req.method}] -> API is Rate-limited`,
        );
        return res
            .status(429)
            .json(
                new ApiResponse(
                    429,
                    "",
                    "Too many requests, please try again later.",
                ),
            );
    },
});

export { apiRateLimiter };
