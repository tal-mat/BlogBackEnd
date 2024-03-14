import pool from '../dal/DBConnect'
import { DataAccess } from './IDataAccess'
import User from '../models/ORM/User';
import { UserNotFoundError,
    IncorrectPasswordError,
    DuplicateUsernameError,
    DuplicateEmailError } from '../errors/CustomErrors';

export class UserRepository implements DataAccess<User> {

    async add(user: User): Promise<void> {
        const usernameExists = await this.userExistsWithUsername(user.username);
        const emailExists = await this.userExistsWithEmail(user.email);

        if (usernameExists) {
            throw new DuplicateUsernameError(user.username);
        }

        if (emailExists) {
            throw new DuplicateEmailError(user.email);
        }

        const query = 'INSERT INTO public."user" ("firstName", "lastName", "username", "password", "email", "birthDate", "gender", "address", "phoneNumber", ' +
            '"registrationDate", "accountStatus", "role") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';

        await pool.query(query, [
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
    }

    async delete(userID: number): Promise<void> {
        const query = 'DELETE FROM public."user" WHERE id = $1';
        const result = await pool.query(query, [userID]);
        if (result.rowCount === 0) {
            throw new Error(`User with ID ${userID} not found`);
        }
    }

    async update(userID: number, updateData: Partial<User>): Promise<void> {
        let query = 'UPDATE public."user" SET ';
        const updates: string[] = [];
        const values: (string | number | Date | boolean)[] = [];

        Object.entries(updateData).forEach(([key, value], index) => {
            // Enclose column names in double quotes
            const quotedKey = `"${key}"`;
            updates.push(`${quotedKey} = $${index + 1}`);
            values.push(value);
        });

        query += updates.join(', ') + ' WHERE id = $' + (values.length + 1);

        values.push(userID);

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            throw new Error(`Unable to update user with ID ${userID}. User not found.`);
        }
    }


    async getItemByID(userID: number): Promise<User> {
        const query = 'SELECT * FROM public."user" WHERE id = $1';
        const result = await pool.query(query, [userID]);

        if (result.rows.length === 0) {
            throw new Error(`User with ID ${userID} not found`);
        }

        return result.rows[0];
    }

    async getItems(): Promise<User[]> {
        const query = `SELECT * FROM public."user"`;

        const result = await pool.query(query);

        if (result.rows.length === 0) {
            throw new Error(`No users found`);
        }

        return result.rows as User[];
    }

    async getUserByLogin(username: string, password: string): Promise<User> {
        const query = 'SELECT * FROM public."user" WHERE username = $1';
        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            throw new UserNotFoundError(username);
        }

        const user = result.rows[0];

        // Check if the password is correct
        if (user.password !== password) {
            throw new IncorrectPasswordError();
        }

        return user;
    }

    async checkUserIsValid(email: string): Promise<boolean> {
        // if (!email || typeof email !== 'string') {
        //     throw new Error('Email must be non-empty strings.');
        // }

        const emailExists = await this.userExistsWithEmail(email);

        if (emailExists) {
            throw new DuplicateEmailError(email);
        }

        return true;
    }

    private async userExistsWithUsername(username: string): Promise<boolean> {
        const query = 'SELECT * FROM public."user" WHERE username = $1';
        const result = await pool.query(query, [username]);

        return result.rows.length > 0;
    }

    private async userExistsWithEmail(email: string): Promise<boolean> {
        const query = 'SELECT * FROM public."user" WHERE email = $1';
        const result = await pool.query(query, [email]);

        return result.rows.length > 0;
    }

}