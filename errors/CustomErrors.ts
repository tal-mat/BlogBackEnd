class UserNotFoundError extends Error {
    constructor(username: string) {
        super(`User with username '${username}' not found`);
        this.name = 'UserNotFoundError';
    }
}

class IncorrectPasswordError extends Error {
    constructor() {
        super('Incorrect password');
        this.name = 'IncorrectPasswordError';
    }
}

class DuplicateUsernameError extends Error {
    constructor(username: string) {
        super(`User with username '${username}' already exists`);
        this.name = 'DuplicateUsernameError';
    }
}

class DuplicateEmailError extends Error {
    constructor(email: string) {
        super(`User with email '${email}' already exists`);
        this.name = 'DuplicateEmailError';
    }
}

export { UserNotFoundError, IncorrectPasswordError, DuplicateUsernameError, DuplicateEmailError };
