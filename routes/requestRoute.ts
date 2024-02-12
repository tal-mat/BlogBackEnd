import express, { Request, Response } from 'express';
const requestsRoute = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import {OAuth2Client} from 'google-auth-library';


requestsRoute.post('/', async (req: Request, res: Response, next) => {
    // Set CORS headers to allow requests from http://localhost:3000
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Set Referrer Policy header for security
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    // Define the redirect URL after Google authentication
    const redirectUrl = 'http://127.0.0.1:4000/oauth';

    // Create an instance of OAuth2Client with client ID, client secret, and redirect URL
    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectUrl
    );

    // Use oAuth2Client to generate the URL that will be used to initiate the Google authentication
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
        prompt: 'consent'
    });

    // Send the generated authentication URL as JSON response
    res.json({ url: authorizeUrl });
});

export default requestsRoute;
