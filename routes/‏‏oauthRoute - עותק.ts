import express, { Request, Response } from 'express';
import user from "../models/ORM/User";
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');

// Define an interface for user data
interface AppUserData {
    // id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    birthDate: Date;
    gender: string;
    address: string;
    phoneNumber: string;
    registrationDate: Date;
    accountStatus: boolean;
    role: string;
}

// Function to fetch user data from Google API using the access token
async function getUsersData(access_token: string) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const data = await response.json();
    // console.log('data', data);
    return data;
}

// Function to send a POST request with the modified user data
async function sendUserData(userData: AppUserData) {
    try {
        let date = { current: new Date() };
        let newUser = {
            "firstName": userData.firstName,
            "lastName": userData.lastName,
            "username": userData.username,
            "password": userData.password,
            "email": userData.email,
            "birthDate": userData.birthDate,
            "gender": userData.gender,
            "address": userData.address,
            "phoneNumber": userData.phoneNumber,
            "registrationDate": date.current,
            "accountStatus": true,
            "role": "user",
        };

        const response = await fetch('http://127.0.0.1:4000/users', {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            console.log('User data successfully sent.');

            return { username: newUser.username, password: newUser.password };
        } else {
            console.error('Failed to send user data.');
            return null;
        }
    } catch (error) {
        console.error('Error sending user data:', error);
        return null;
    }
}


// Route handler for handling the OAuth callback
router.get('/', async function (req: Request, res: Response, next) {
    // Extracting the authorization code from the query parameters
    const code = req.query.code as string | undefined;
    // Insert empty/fake values to adapt my db fields
    let appUserData: AppUserData = {
        // id: 0,
        firstName: '',
        lastName: '',
        username: '',
        password: '123',
        email: '',
        birthDate: new Date('2000-01-01'), // Set birthDate to January 1, 2000
        gender: '---',
        address: '---',
        phoneNumber: '---',
        registrationDate: new Date(), // Set registrationDate to the current date
        accountStatus: true,
        role: 'user',
    };


    try {
        // Configuring the OAuth2 client with client ID, client secret, and redirect URL
        const redirectUrl = 'http://127.0.0.1:4000/oauth';
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl
        );

        // Set the scope to include email
        const scopes = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];

        // Generate the URL for Google OAuth2 consent screen
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });


        // Obtaining tokens using the authorization code
        const tokenResponse = await oAuth2Client.getToken(code);

        // Extracting id token from the tokenResponse
        const idToken = tokenResponse.tokens.id_token;

        // Setting the obtained tokens as credentials for the OAuth2 client
        await oAuth2Client.setCredentials(tokenResponse.tokens);
        console.log('Tokens acquired');

        // Accessing user credentials from the OAuth2 client
        const user = oAuth2Client.credentials;
        console.log('credentials', user);

        const ticket = await oAuth2Client.verifyIdToken({idToken:user.id_token,audience:process.env.CLIENT_ID,});

        console.log('ticket',ticket);

        // Access the payload of the ticket
        const payload = ticket.getPayload();

        // Extract the email from the payload
        const email = payload['email'];

        console.log('User email:', email);

        // Fetching user data using the obtained access token
        const googleUserData = await getUsersData(user.access_token);
        console.log("Google user data is: ",googleUserData);
        console.log('ticket', ticket);
        console.log('email', email);

        appUserData = {
            // id: 0,
            firstName: googleUserData.given_name,
            lastName: googleUserData.family_name,
            username: `${googleUserData.given_name}${googleUserData.family_name}`,
            password: '123',
            email: `${googleUserData.given_name}${googleUserData.family_name}@gmail.com`,
            birthDate: new Date('2000-01-01'), // Set birthDate to January 1, 2000
            gender: '---',
            address: '---',
            phoneNumber: '---',
            registrationDate: new Date(), // Set registrationDate to the current date
            accountStatus: true,
            role: 'user',
        }

        // req.body.userData = appUserData;

    } catch (error) {
        console.log('Error with signing in with Google.', error);
    } finally {
        const createdUser = await sendUserData(appUserData);

        if (createdUser) {
            window.alert('User registered successfully! Please log in.');
            res.redirect(`http://127.0.0.1:3000/login}`);
        }
    }
});


export default router;
