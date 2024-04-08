import { isValidUsername } from "6pp";
export const userNameValidator = (username) => {
    if (!isValidUsername(username))
    return { isValid: false, errorMessage: "Username is not Invalid" };
};
