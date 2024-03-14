"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addUserHandler = (req, res, next) => {
    if (req.method === 'POST' && req.path === '/addUser') {
        const userData = req.body;
        if (!userData.username || !userData.password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        console.log('Adding user:', userData);
    }
    next();
};
exports.default = addUserHandler;
