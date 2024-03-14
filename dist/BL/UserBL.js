"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBL = void 0;
const CustomErrors_1 = require("../errors/CustomErrors");
class UserBL {
    constructor(userDataAccess) {
        this.userDataAccess = userDataAccess;
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userDataAccess.add(user);
            }
            catch (error) {
                // @ts-ignore
                console.error('Error in addUser in BL:', error.message);
                if (error instanceof CustomErrors_1.DuplicateUsernameError) {
                    throw new CustomErrors_1.DuplicateUsernameError(error.message);
                }
                else if (error instanceof CustomErrors_1.DuplicateEmailError) {
                    throw new CustomErrors_1.DuplicateEmailError(error.message);
                }
                else {
                    // @ts-ignore
                    throw new Error(error.message);
                }
            }
        });
    }
    getUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userDataAccess.getItemByID(userID);
            if (user === null || user === undefined) {
                throw new Error(`User with ID ${userID} not found`);
            }
            return user;
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userDataAccess.getItems();
            if (!users || users.length === 0) {
                throw new Error(`No users found`);
            }
            return users;
        });
    }
    updateUser(userID, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userDataAccess.update(userID, updateData);
            }
            catch (error) {
                throw new Error(`Unable to update user with ID ${userID}: ${error.message}`);
            }
        });
    }
    deleteUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userDataAccess.delete(userID);
            }
            catch (error) {
                throw new Error(`Unable to delete user with ID ${userID}: ${error.message}`);
            }
        });
    }
    getUserByLogin(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userDataAccess.getUserByLogin(username, password);
                return user;
            }
            catch (error) {
                if (error instanceof CustomErrors_1.UserNotFoundError || error instanceof CustomErrors_1.IncorrectPasswordError) {
                    throw error; // Re-throw specific errors
                }
                else {
                    console.error('Unexpected error during login:', error);
                    throw new Error('An unexpected error occurred. Please try again.');
                }
            }
        });
    }
    checkUserIsValid(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const check = yield this.userDataAccess.checkUserIsValid(email);
                return check;
            }
            catch (error) {
                // @ts-ignore
                console.error('Error in checkUserIsValid in BL:', error.message);
                if (error instanceof CustomErrors_1.DuplicateEmailError) {
                    throw new CustomErrors_1.DuplicateEmailError(error.message);
                }
                else {
                    // @ts-ignore
                    throw new Error(error.message);
                }
            }
        });
    }
}
exports.UserBL = UserBL;
