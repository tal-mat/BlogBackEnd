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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
// Function to fetch user data from Google API using the access token
function getUsersData(access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
        const data = yield response.json();
        return data;
    });
}
// Function to send a POST request with the modified user data
function sendUserData(userData) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield fetch('http://127.0.0.1:4000/users', {
                method: "POST",
                body: JSON.stringify(newUser),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                console.log('User data successfully sent.');
                return { username: newUser.username, password: newUser.password };
            }
            else {
                console.error('Failed to send user data.');
                return null;
            }
        }
        catch (error) {
            console.error('Error sending user data:', error);
            return null;
        }
    });
}
// Route handler for handling the OAuth callback
router.get('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Extracting the authorization code from the query parameters
        const code = req.query.code;
        // Insert empty/fake values to adapt my db fields
        let appUserData = {
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
            const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectUrl);
            // Set the scope to include email
            const scopes = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];
            // Generate the URL for Google OAuth2 consent screen
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
            });
            // Obtaining tokens using the authorization code
            const tokenResponse = yield oAuth2Client.getToken(code);
            // Extracting id token from the tokenResponse
            const idToken = tokenResponse.tokens.id_token;
            // Setting the obtained tokens as credentials for the OAuth2 client
            yield oAuth2Client.setCredentials(tokenResponse.tokens);
            console.log('Tokens acquired');
            // Accessing user credentials from the OAuth2 client
            const user = oAuth2Client.credentials;
            console.log('credentials', user);
            const ticket = yield oAuth2Client.verifyIdToken({ idToken: user.id_token, audience: process.env.CLIENT_ID, });
            console.log('ticket', ticket);
            // Access the payload of the ticket
            const payload = ticket.getPayload();
            // Extract the email from the payload
            const email = payload['email'];
            console.log('User email:', email);
            // Fetching user data using the obtained access token
            const googleUserData = yield getUsersData(user.access_token);
            console.log("Google user data is: ", googleUserData);
            console.log('ticket', ticket);
            console.log('email', email);
            appUserData = {
                // id: 0,
                firstName: googleUserData.given_name,
                lastName: googleUserData.family_name,
                username: '',
                password: '',
                email: email,
                birthDate: new Date('2000-01-01'), // Set birthDate to January 1, 2000
                gender: '',
                address: '',
                phoneNumber: '',
                registrationDate: new Date(), // Set registrationDate to the current date
                accountStatus: true,
                role: 'user',
            };
            // req.body.userData = appUserData;
        }
        catch (error) {
            console.log('Error with signing in with Google.', error);
        }
        finally {
            const createdUser = yield sendUserData(appUserData);
            if (createdUser) {
                window.alert('User registered successfully! Please log in.');
                res.redirect(`http://127.0.0.1:3000/login}`);
            }
        }
    });
});
exports.default = router;
