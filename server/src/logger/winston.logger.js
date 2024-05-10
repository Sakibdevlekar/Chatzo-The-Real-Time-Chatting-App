import winston from "winston";
// import { DB_NAME } from "../constant/config.constant.js";

/**
 * Requiring `winston-mongodb` will expose
 * `winston.transports.MongoDB`
 */
// const {MongoDB} = require("winston-mongodb");

// Define your severity levels.
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.

const level = () => {
    const env = process.env.NODE_ENV || "DEV";
    const isDevelopment = env === "DEV";
    return isDevelopment ? "debug" : "warn";
};

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
    error: "red",
    warn: "yellow",
    info: "blue",
    http: "green",
    debug: "magenta",
};

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors);

// Define MongoDB transport
// const mongoDBTransport = new MongoDB({
//   db: `${process.env.MONGODB_URI}/${DB_NAME}`,
//   collection: 'logs', // Specify the collection name for logs
//   options:{useUnifiedTopology:true},
//   storeHost:true,
//   decolorize:true,
//   level: level(),
// });

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
    winston.format.errors({ stack: true }),
    // Add the message timestamp with the preferred format
    winston.format.timestamp({ format: "DD MMM, YYYY - HH:mm:ss:ms" }),
    // Tell Winston that the logs must be colored
    winston.format.colorize({ all: true }),
    winston.format.json(),
    // Define the format of the message showing the timestamp, the level and the message
    winston.format.printf(
        (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
        // (info) => console.log( info)
    ),
);

// Define which transports the logger must use to print out messages.
// In this example, we are using three different transports
const transports = [
    // mongoDBTransport,
    // Allow the use the console to print the messages
    new winston.transports.Console(),
];

// Create the logger instance that has to be exported
// and used to log messages.
const logger = winston.createLogger({
    level: level(),
    levels,
    format, //:winston.format.combine(winston.format.timestamp({ format: "DD MMM, YYYY - HH:mm:ss:ms" }),winston.format.json()),
    transports,
});

export { logger };
