import { Request, Response, NextFunction } from 'express';

const addUserHandler = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' && req.path === '/addUser') {
        const userData = req.body;

        if (!userData.username || !userData.password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log('Adding user:', userData);
    }

    next();
};

export default addUserHandler;
