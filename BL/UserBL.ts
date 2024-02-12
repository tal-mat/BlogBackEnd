import { UserRepository } from "../dal/UserRepository";
import User from '../models/ORM/User';
import {
    UserNotFoundError,
    IncorrectPasswordError,
    DuplicateUsernameError,
    DuplicateEmailError
} from '../errors/CustomErrors';

export class UserBL {
    private userDataAccess: UserRepository;

    constructor(userDataAccess: UserRepository) {
        this.userDataAccess = userDataAccess;
    }

    async addUser(user: User): Promise<void> {
        try {
            await this.userDataAccess.add(user);
        } catch (error) {
            // @ts-ignore
            console.error('Error in addUser in BL:', error.message);

            if (error instanceof DuplicateUsernameError) {
                throw new DuplicateUsernameError(error.message);
            } else if (error instanceof DuplicateEmailError) {
                throw new DuplicateEmailError(error.message);
            } else {
                // @ts-ignore
                throw new Error(error.message);
            }
        }
    }



    async getUser(userID: number): Promise<User> {
        const user = await this.userDataAccess.getItemByID(userID);
        if (user === null || user === undefined) {
            throw new Error(`User with ID ${userID} not found`);
        }
        return user;
    }

    async getUsers(): Promise<User[]> {
        const users = await this.userDataAccess.getItems();
        if (!users || users.length === 0) {
            throw new Error(`No users found`);
        }
        return users;
    }

    async updateUser(userID: number, updateData: Partial<User>): Promise<void> {
        try {
            await this.userDataAccess.update(userID, updateData);
        } catch (error) {
            throw new Error(`Unable to update user with ID ${userID}: ${(error as Error).message}`);
        }
    }

    async deleteUser(userID: number): Promise<void> {
        try {
            await this.userDataAccess.delete(userID);
        } catch (error) {
            throw new Error(`Unable to delete user with ID ${userID}: ${(error as Error).message}`);
        }
    }

    async getUserByLogin(username: string, password: string): Promise<User> {
        try {
            const user = await this.userDataAccess.getUserByLogin(username, password);
            return user;
        } catch (error) {
            if (error instanceof UserNotFoundError || error instanceof IncorrectPasswordError) {
                throw error; // Re-throw specific errors
            } else {
                console.error('Unexpected error during login:', error);
                throw new Error('An unexpected error occurred. Please try again.');
            }
        }
    }


}