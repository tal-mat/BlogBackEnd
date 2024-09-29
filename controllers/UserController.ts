import { Request, Response} from "express";
import User from '../models/ORM/User';
import {UserBL} from "../BL/UserBL";
import {
    UserNotFoundError,
    IncorrectPasswordError,
    DuplicateUsernameError,
    DuplicateEmailError
} from '../errors/CustomErrors';


export class UserController {

    private userBL: UserBL;

    constructor(userBL: UserBL) {
        this.userBL = userBL;
    }

    async addUser(req: Request, res: Response): Promise<void> {
        const userData = req.body;
        const user = new User(
            userData.id,
            userData.firstName,
            userData.lastName,
            userData.username,
            userData.password,
            userData.email,
            userData.birthDate,
            userData.gender,
            userData.address,
            userData.phoneNumber,
            userData.registrationDate,
            userData.accountStatus,
            userData.role
        );

        try {
            await this.userBL.addUser(user);
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error in addUser:', error);

            let statusCode: number;
            let errorType: string;
            let errorMessage: string;

            if (error instanceof DuplicateUsernameError) {
                statusCode = 409;
                errorType = 'DuplicateUsernameError';
                errorMessage = 'Duplicate username';
            } else if (error instanceof DuplicateEmailError) {
                statusCode = 409;
                errorType = 'DuplicateEmailError';
                errorMessage = 'Duplicate email';
            } else {
                statusCode = 500; // Default to Internal Server Error
                errorType = 'InternalServerError';
                errorMessage = 'An unexpected error occurred';
            }
            res.status(statusCode).json({ error: errorMessage, errorType, details: (error as Error).message });
        }
    }


    async getUser(req: Request, res: Response): Promise<void> {
        const userID = +req.params.id;
        try {
            const user = await this.userBL.getUser(userID);
            res.status(200).send(user);
        } catch (error) {
            res.status(400).send((error as Error).message);
        }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userBL.getUsers();
            res.status(200).send(users);
        } catch (error) {
            res.status(400).send((error as Error).message);
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const userID = +req.params.id;
        const userData = req.body;
        try {
            await this.userBL.updateUser(userID, userData);
            res.status(200).send({message: `User ${userID} updated successfully`});
        } catch (error) {
            res.status(404).send((error as Error).message);
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const userID = +req.params.id;
        try {
            await this.userBL.deleteUser(userID);
            res.status(200).send({ message: `User ${userID} deleted successfully` });
        } catch(error) {
            res.status(404).send((error as Error).message);
        }
    }

    async getUserByLogin(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;

        try {
            const {token, userFirstName } = await this.userBL.getUserByLogin(username, password);
            // console.log("Token at the userController: ", token);
            res.cookie('token',  token, {
                domain: '127.0.0.1',
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                maxAge: 2 * 60 * 1000 // 1 minute in milliseconds
            });
            // console.log("Set-Cookie headers:", res.getHeaders()['set-cookie']);

            res.status(200).json({ message: 'Authentication successful', userFirstName });
        } catch (error) {
            let statusCode: number;
            let errorType: string;
            let errorMessage: string;

            if (error instanceof UserNotFoundError) {
                statusCode = 404;
                errorType = 'UserNotFoundError';
                errorMessage = 'User Not Found';
            } else if (error instanceof IncorrectPasswordError) {
                statusCode = 401;
                errorType = 'IncorrectPasswordError';
                errorMessage = 'Incorrect Password';
            } else {
                statusCode = 500; // Default to Internal Server Error
                errorType = 'UnexpectedError';
                errorMessage = 'An unexpected error occurred';
            }

            console.error(`Responding with status ${statusCode} and error: ${errorMessage}`);
            res.status(statusCode).json({ error: errorMessage, errorType });
        }
    }

    async checkUserIsValid(req: Request, res: Response): Promise<void> {
        const email = req.query.email as string;

        try {
            const check = await this.userBL.checkUserIsValid(email);
            if (check === true) {
                res.status(200).json({ check });
            } else {
                throw new Error("An unexpected error occurred");
            }
        } catch (error) {
            console.error('Error in checkUserIsValid:', error);

            let statusCode: number;
            let errorType: string;
            let errorMessage: string;

            if (error instanceof DuplicateEmailError) {
                statusCode = 409;
                errorType = 'DuplicateEmailError';
                errorMessage = 'Duplicate email';
            } else {
                statusCode = 500; // Default to Internal Server Error
                errorType = 'InternalServerError';
                errorMessage = 'An unexpected error occurred';
            }
            res.status(statusCode).json({ error: errorMessage, errorType, details: (error as Error).message });
        }
    }

    async signOut(req: Request, res: Response): Promise<void> {
        try {
            // Clear the 'token' cookie by setting its value to an empty string and maxAge to 0
            res.cookie('token', '', {
                domain: '127.0.0.1',
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                expires: new Date(0) // Set expires to a past date to expire the cookie
            });
            res.status(200).send("User signed out successfully.");
        } catch (error) {
            console.error('Error signing out:', error);
            res.status(500).send("Internal server error.");
        }
    }

    async resetPasswordByAdmin(req: Request, res: Response): Promise<void> {
        const userID = +req.params.id;
        try {
            await this.userBL.resetPasswordByAdmin(userID);
            res.status(200).send({ message: `User ${userID} password was reset successfully` });
        } catch(error) {
            res.status(500).send((error as Error).message);
        }
    }

}