import express, {Request, Response} from 'express';
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
import { config } from 'dotenv';
config(); // Load .env file
const { OAuth2Client } = require('google-auth-library');
import { AppUserData } from '../interfaces/AppUserData';
import {DuplicateEmailError} from "../errors/CustomErrors";

let tokenUserDetails = "";


// Function to fetch user data from Google API using the access token
async function getUsersData(access_token: string) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const data = await response.json();
    return data;
}

// Function to send a POST request with the modified user data
async function sendUserData(userData: AppUserData) {
    try {
        let date = { current: new Date() };
        let newUser = {
            "firstName": userData.firstName,
            "lastName": userData.lastName,
            "email": userData.email,
            "registrationDate": date.current,
            "accountStatus": true,
            "role": "user",
        };

        const response = await fetch(`http://127.0.0.1:4000/users/valid?email=${encodeURIComponent(userData.email)}`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            console.log('There is not a user with such an email, continue to register form.');
            return {newUser};
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
        email: '',
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
            email: email,
            registrationDate: new Date(), // Set registrationDate to the current date
            accountStatus: true,
            role: 'user',
        }


    } catch (error) {
        console.log('Error with signing in with Google.', error);
    } finally {
        const isNewUser = await sendUserData(appUserData);

        if (isNewUser) {
            try {

                const { MY_SECRET } = process.env;

                console.log(MY_SECRET);

                // Generate a JWT token with user details
                tokenUserDetails = jwt.sign({ appUserData }, MY_SECRET, { expiresIn: '1h' });

                const registrationFormUrl = 'http://127.0.0.1:3000/SignIn';

                // Send a success response to the frontend
                res.redirect(registrationFormUrl);

            } catch (error) {
                console.error('Error generating JWT token:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.redirect("http://127.0.0.1:3000/login?error=duplicate_email");
        }
    }
});


// Function to send HTTP response with token as cookie
router.get('/get-token-cookie', function(req, res, next) {
    try {
        if (tokenUserDetails != "" ) {
        // Default cookie options
        const defaultOptions = {
            domain: 'http://127.0.0.1',
            path: '/',
            httpOnly: false,
            secure: false, // Set it to true if using HTTPS
            // Add more options as needed
        };

        // Merge default options with provided options
        const cookieOptions = { ...defaultOptions };

        // Set the token as an HTTP-only cookie in the response headers
        res.cookie('token', tokenUserDetails, cookieOptions);

        // Log the Set-Cookie header to verify that the cookie has been set
        console.log("Set-Cookie header:", res.get('Set-Cookie'));

        // Respond with a success message or any other response as needed
        res.status(200).json({ message: 'Token cookie set successfully' });
        } else {
            res.status(400).json({ error: 'Token is not available' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



export default router;
