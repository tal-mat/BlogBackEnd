import express, { Request, Response } from 'express';
import { PostController } from '../controllers/PostController';
import { PostBL } from '../BL/PostBL';
import { PostRepository } from '../dal/PostRepository';

const postsRoute = express.Router();
const postController = new PostController(new PostBL(new PostRepository()));

postsRoute.post('/', async (req: Request, res: Response) => await postController.addPost(req, res));

postsRoute.get('/:id', async (req: Request, res: Response) => await postController.getPost(req, res));

postsRoute.get('/', async (req: Request, res: Response) => await postController.getPosts(req, res));

postsRoute.put('/:id', async (req: Request, res: Response) => await postController.updatePost(req, res));

postsRoute.delete('/:id', async (req: Request, res: Response) => await postController.deletePost(req, res));

export default postsRoute;
