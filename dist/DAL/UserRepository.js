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
exports.UserRepository = void 0;
const DBConnect_1 = __importDefault(require("../dal/DBConnect"));
const CustomErrors_1 = require("../errors/CustomErrors");
class UserRepository {
    add(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const usernameExists = yield this.userExistsWithUsername(user.username);
            const emailExists = yield this.userExistsWithEmail(user.email);
            if (usernameExists) {
                throw new CustomErrors_1.DuplicateUsernameError(user.username);
            }
            if (emailExists) {
                throw new CustomErrors_1.DuplicateEmailError(user.email);
            }
            const query = 'INSERT INTO public."user" ("firstName", "lastName", "username", "password", "email", "birthDate", "gender", "address", "phoneNumber", ' +
                '"registrationDate", "accountStatus", "role") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
            yield DBConnect_1.default.query(query, [
                user.firstName,
                user.lastName,
                user.username,
                user.password,
                user.email,
                user.birthDate,
                user.gender,
                user.address,
                user.phoneNumber,
                user.registrationDate,
                user.accountStatus,
                user.role
            ]);
        });
    }
    delete(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'DELETE FROM public."user" WHERE id = $1';
            const result = yield DBConnect_1.default.query(query, [userID]);
            if (result.rowCount === 0) {
                throw new Error(`User with ID ${userID} not found`);
            }
        });
    }
    update(userID, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = 'UPDATE public."user" SET ';
            const updates = [];
            const values = [];
            Object.entries(updateData).forEach(([key, value], index) => {
                // Enclose column names in double quotes
                const quotedKey = `"${key}"`;
                updates.push(`${quotedKey} = $${index + 1}`);
                values.push(value);
            });
            query += updates.join(', ') + ' WHERE id = $' + (values.length + 1);
            values.push(userID);
            const result = yield DBConnect_1.default.query(query, values);
            if (result.rowCount === 0) {
                throw new Error(`Unable to update user with ID ${userID}. User not found.`);
            }
        });
    }
    getItemByID(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM public."user" WHERE id = $1';
            const result = yield DBConnect_1.default.query(query, [userID]);
            if (result.rows.length === 0) {
                throw new Error(`User with ID ${userID} not found`);
            }
            return result.rows[0];
        });
    }
    getItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM public."user"`;
            const result = yield DBConnect_1.default.query(query);
            if (result.rows.length === 0) {
                throw new Error(`No users found`);
            }
            return result.rows;
        });
    }
    getUserByLogin(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM public."user" WHERE username = $1';
            const result = yield DBConnect_1.default.query(query, [username]);
            if (result.rows.length === 0) {
                throw new CustomErrors_1.UserNotFoundError(username);
            }
            const user = result.rows[0];
            // Check if the password is correct
            if (user.password !== password) {
                throw new CustomErrors_1.IncorrectPasswordError();
            }
            return user;
        });
    }
    checkUserIsValid(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (!email || typeof email !== 'string') {
            //     throw new Error('Email must be non-empty strings.');
            // }
            const emailExists = yield this.userExistsWithEmail(email);
            if (emailExists) {
                throw new CustomErrors_1.DuplicateEmailError(email);
            }
            return true;
        });
    }
    userExistsWithUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM public."user" WHERE username = $1';
            const result = yield DBConnect_1.default.query(query, [username]);
            return result.rows.length > 0;
        });
    }
    userExistsWithEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM public."user" WHERE email = $1';
            const result = yield DBConnect_1.default.query(query, [email]);
            return result.rows.length > 0;
        });
    }
}
exports.UserRepository = UserRepository;
