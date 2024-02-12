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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = __importDefault(require("../models/ORM/User"));
const CustomErrors_1 = require("../errors/CustomErrors");
class UserController {
    constructor(userBL) {
        this.userBL = userBL;
    }
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = req.body;
            console.log("userData in controller :", userData);
            const user = new User_1.default(userData.id, userData.firstName, userData.lastName, userData.username, userData.password, userData.email, userData.birthDate, userData.gender, userData.address, userData.phoneNumber, userData.registrationDate, userData.accountStatus, userData.role);
            console.log("new user in controller :", user);
            try {
                yield this.userBL.addUser(user);
                res.status(201).json({ message: 'User created successfully' });
            }
            catch (error) {
                console.error('Error in addUser:', error);
                let statusCode;
                let errorType;
                let errorMessage;
                if (error instanceof CustomErrors_1.DuplicateUsernameError) {
                    statusCode = 409;
                    errorType = 'DuplicateUsernameError';
                    errorMessage = 'Duplicate username';
                }
                else if (error instanceof CustomErrors_1.DuplicateEmailError) {
                    statusCode = 409;
                    errorType = 'DuplicateEmailError';
                    errorMessage = 'Duplicate email';
                }
                else {
                    statusCode = 500; // Default to Internal Server Error
                    errorType = 'InternalServerError';
                    errorMessage = 'An unexpected error occurred';
                }
                console.log(`Responding with status ${statusCode} and error: ${errorMessage}`);
                res.status(statusCode).json({ error: errorMessage, errorType, details: error.message });
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = +req.params.id;
            try {
                const user = yield this.userBL.getUser(userID);
                res.status(200).send(user);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userBL.getUsers();
                res.status(200).send(users);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = +req.params.id;
            const userData = req.body;
            try {
                yield this.userBL.updateUser(userID, userData);
                res.status(200).send({ message: `User ${userID} updated successfully` });
            }
            catch (error) {
                res.status(404).send(error.message);
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = +req.params.id;
            try {
                yield this.userBL.deleteUser(userID);
                res.status(200).send({ message: `User ${userID} deleted successfully` });
            }
            catch (error) {
                res.status(404).send(error.message);
            }
        });
    }
    getUserByLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            try {
                const user = yield this.userBL.getUserByLogin(username, password);
                res.status(200).send(user);
            }
            catch (error) {
                let statusCode;
                let errorType;
                let errorMessage;
                if (error instanceof CustomErrors_1.UserNotFoundError) {
                    statusCode = 404;
                    errorType = 'UserNotFoundError';
                    errorMessage = 'User Not Found';
                }
                else if (error instanceof CustomErrors_1.IncorrectPasswordError) {
                    statusCode = 401;
                    errorType = 'IncorrectPasswordError';
                    errorMessage = 'Incorrect Password';
                }
                else {
                    statusCode = 500; // Default to Internal Server Error
                    errorType = 'UnexpectedError';
                    errorMessage = 'An unexpected error occurred';
                }
                console.error(`Responding with status ${statusCode} and error: ${errorMessage}`);
                res.status(statusCode).json({ error: errorMessage, errorType });
            }
        });
    }
}
exports.UserController = UserController;
