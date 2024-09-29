import express, { Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { UserBL } from '../BL/UserBL';
import { UserRepository } from '../dal/UserRepository';

const usersRoute = express.Router();
const userController = new UserController(new UserBL(new UserRepository()));

import authUserMiddlewares from "../middlewares/authUser";
const middlewareFunctions = [
    authUserMiddlewares.authUserSecured,
    authUserMiddlewares.isAdmin
];

usersRoute.put('/resetPass/:id', async (req: Request, res: Response) => await userController.resetPasswordByAdmin(req, res));


// // Routes not requiring authentication
usersRoute.post('/', async (req: Request, res: Response) => await userController.addUser(req, res));
usersRoute.get('/valid', async (req: Request, res: Response) => await userController.checkUserIsValid(req, res));
usersRoute.post('/login', async (req: Request, res: Response) => await userController.getUserByLogin(req, res));

// Routes requiring authentication as "User"
usersRoute.post('/signout', middlewareFunctions[0], async (req: Request, res: Response) => await userController.signOut(req, res));

// Routes requiring authentication as "Admin"
usersRoute.get('/:id', middlewareFunctions, async (req: Request, res: Response) => await userController.getUser(req, res));
usersRoute.get('/', middlewareFunctions, async (req: Request, res: Response) => await userController.getUsers(req, res));

usersRoute.delete('/:id', middlewareFunctions, async (req: Request, res: Response) => await userController.deleteUser(req, res));

usersRoute.put('/:id', middlewareFunctions, async (req: Request, res: Response) => await userController.updateUser(req, res));




export default usersRoute;
