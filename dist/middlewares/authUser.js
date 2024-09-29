"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Map to store the last actions time for each user in order to resend the token's cookie while the user is active on app
const lastActionTimes = new Map();
let user = {};
const authUserSecured = (req, res, next) => {
    console.log("\nauthUserSecured middleware");
    try {
        // console.log("Cookie:", req.headers.cookie);
        // Access the token cookie from req.cookies
        // @ts-ignore
        const token = req.headers.cookie.split('=')[1];
        if (token) {
            // Token is present
            // console.log('Token:', token);
            const MY_SECRET = process.env.MY_SECRET;
            const decodedToken = jsonwebtoken_1.default.verify(token, MY_SECRET);
            // @ts-ignore
            user = decodedToken.user;
            // console.log('decoded:', user);
            // Check if the user's last action time is recorded
            // @ts-ignore
            const userID = user.id.toString();
            console.log("userID: ", userID);
            const lastActionTime = lastActionTimes.get(userID);
            console.log("last Action Time: ", lastActionTime);
            const currentTime = Date.now();
            const currentDate = new Date(currentTime);
            // Format the date and time in a readable string
            const formattedTime = currentDate.toLocaleString(); // Use toLocaleString() for localized formatting
            console.log("Current Time: ", formattedTime);
            // If the user's last action time is not recorded or more than 10 minutes have passed since the first action
            if (!lastActionTime || currentTime - lastActionTime >= 1 * 60 * 1000) {
                // Clear the map to start over
                lastActionTimes.clear();
                // Record the current action time
                lastActionTimes.set(userID, currentTime);
                console.log("user: ", user);
                console.log("User authenticated successfully");
                // Set the token cookie again with updated expiration time
                const updatedToken = jsonwebtoken_1.default.sign(user, MY_SECRET, { expiresIn: '2m' });
                res.cookie('token', token, {
                    domain: '127.0.0.1',
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    maxAge: 2 * 60 * 1000 // 1 minute in milliseconds
                });
                console.log("Token refreshed.");
                return next();
            }
            else {
                // Record the current action time
                lastActionTimes.set(userID, currentTime);
                // User has been active within the last 10 minutes
                console.log("User has been active within the last 10 minutes");
                return next();
            }
        }
        else {
            // Token is not present
            console.log('Token not found');
            // Handle the case where the token is not present
            return res.status(401).json({ message: "Token not found." });
        }
    }
    catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).json({ message: "Invalid token." });
    }
    finally {
        console.log("Map: ", lastActionTimes);
    }
};
const isAdmin = (req, res, next) => {
    console.log("\nisAdmin middleware");
    try {
        // @ts-ignore
        if (!user) {
            console.log("User not authenticated");
            return res.status(401).json({ message: "User not authenticated." });
        }
        // // Store the user object in a variable for easier access
        // // @ts-ignore
        // const user = req.user.user as User;
        // console.log("User: ", user);
        // Accessing the role property inside the user object
        const userRole = user.role;
        console.log("User role: ", userRole);
        if (userRole && ((userRole === "Admin") || (userRole === "admin"))) {
            console.log("User is an admin");
            // User is an admin, proceed to the next middleware
            return next();
        }
        else {
            console.log("User is not an admin");
            // User is not an admin, return 403 Forbidden status
            return res.status(403).json({ message: "Access denied. You are not an admin." });
        }
    }
    catch (error) {
        console.error("Error checking admin role:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
exports.default = {
    authUserSecured,
    isAdmin
};
