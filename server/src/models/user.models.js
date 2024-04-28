import mongoose, { Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        avatar: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
        refreshToken: {
            type: String,
            required: true,
            default: null,
            select: false,
        },
    },
    {
        timestamps: true,
    },
);

/**
 * Runs before the user document is saved to the database.
 * If the password field is modified, it hashes the password using bcrypt.
 * @param {import("mongoose").HookNextFunction} next - A callback function to continue the save process.
 */
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await hash(this.password, 12);
});

/**
 * Compares the given plaintext password with the hashed password stored in the database.
 * @param {string} password - The plaintext password to compare with the hashed password.
 * @returns {boolean} `true` if the passwords match, `false` otherwise.
 */
userSchema.methods.isPasswordCorrect = async function (password) {
    return await compare(password, this.password);
};
export const User = mongoose.models.User || model("User", userSchema);
