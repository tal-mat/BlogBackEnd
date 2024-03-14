import express, { Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { UserBL } from '../BL/UserBL';
import { UserRepository } from '../dal/UserRepository';

const usersRoute = express.Router();
const userController = new UserController(new UserBL(new UserRepository()));

usersRoute.get('/valid', async (req: Request, res: Response) => await userController.checkUserIsValid(req, res));

usersRoute.post('/', async (req: Request, res: Response) => await userController.addUser(req, res));

usersRoute.get('/:id', async (req: Request, res: Response) => await userController.getUser(req, res));

usersRoute.get('/', async (req: Request, res: Response) => await userController.getUsers(req, res));

usersRoute.put('/:id', async (req: Request, res: Response) => await userController.updateUser(req, res));

usersRoute.delete('/:id', async (req: Request, res: Response) => await userController.deleteUser(req, res));

usersRoute.post('/login', async (req: Request, res: Response) => await userController.getUserByLogin(req, res));




export default usersRoute;
