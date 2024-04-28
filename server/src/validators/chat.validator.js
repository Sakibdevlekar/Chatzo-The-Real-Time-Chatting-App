import { body, param, validationResult } from "express-validator";




const newGroupValidator = () => [
    body("name", "Please Enter Name").notEmpty(),
    body("members")
        .notEmpty()
        .withMessage("Please Enter Members")
        .isArray({ min: 2, max: 100 })
        .withMessage("Members must be 2-100"),
];

const addMemberValidator = () => [
    body("chatId", "Please Enter Chat ID").notEmpty(),
    body("members")
        .notEmpty()
        .withMessage("Please Enter Members")
        .isArray({ min: 1, max: 97 })
        .withMessage("Members must be 1-97"),
];

const removeMemberValidator = () => [
    body("chatId", "Please Enter Chat ID").notEmpty(),
    body("userId", "Please Enter User ID").notEmpty(),
];

const sendAttachmentsValidator = () => [
    body("chatId", "Please Enter Chat ID").notEmpty(),
];

const chatIdValidator = () => [param("id", "Please Enter Chat ID").notEmpty()];

const renameValidator = () => [
    param("id", "Please Enter Chat ID").notEmpty(),
    body("name", "Please Enter New Name").notEmpty(),
];

const sendRequestValidator = () => [
    body("userId", "Please Enter User ID").notEmpty(),
];

const acceptRequestValidator = () => [
    body("requestId", "Please Enter Request ID").notEmpty(),
    body("accept")
        .notEmpty()
        .withMessage("Please Add Accept")
        .isBoolean()
        .withMessage("Accept must be a boolean"),
];


export {
    acceptRequestValidator,
    addMemberValidator,
    chatIdValidator,
    newGroupValidator,
    removeMemberValidator,
    renameValidator,
    sendAttachmentsValidator,
    sendRequestValidator,
};
