"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateEmailError = exports.DuplicateUsernameError = exports.IncorrectPasswordError = exports.UserNotFoundError = void 0;
class UserNotFoundError extends Error {
    constructor(username) {
        super(`User with username '${username}' not found`);
        this.name = 'UserNotFoundError';
    }
}
exports.UserNotFoundError = UserNotFoundError;
class IncorrectPasswordError extends Error {
    constructor() {
        super('Incorrect password');
        this.name = 'IncorrectPasswordError';
    }
}
exports.IncorrectPasswordError = IncorrectPasswordError;
class DuplicateUsernameError extends Error {
    constructor(username) {
        super(`User with username '${username}' already exists`);
        this.name = 'DuplicateUsernameError';
    }
}
exports.DuplicateUsernameError = DuplicateUsernameError;
class DuplicateEmailError extends Error {
    constructor(email) {
        super(`User with email '${email}' already exists`);
        this.name = 'DuplicateEmailError';
    }
}
exports.DuplicateEmailError = DuplicateEmailError;
