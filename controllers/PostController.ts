import { Request, Response} from "express";
import Post from '../models/ORM/Post';
import {PostBL} from "../BL/PostBL";

export class PostController {

    private postBL: PostBL;

    constructor(postBL: PostBL) {
        this.postBL = postBL;
    }

    async addPost(req: Request, res: Response): Promise<void> {
        const postData = req.body;
        const post = new Post(postData.id, postData.category, postData.title, postData.description, postData.imageUrl, postData.date, postData.postedBy);
        try {
            await this.postBL.addPost(post);
            res.status(201).send({message: `Post created successfully`});
        } catch (error) {
            res.status(400).send((error as Error).message);
        }
    }

    async getPost(req: Request, res: Response): Promise<void> {
        const postID = +req.params.id;
        try {
            const post = await this.postBL.getPost(postID);
            res.status(200).send(post);
        } catch (error) {
            res.status(400).send((error as Error).message);
        }
    }

    async getPosts(req: Request, res: Response): Promise<void> {
        // Extracting parameters from query parameters
        const from: number | null = parseInt(req.query.from as string) || /* default value */ null;
        const to: number | null = parseInt(req.query.to as string) || /* default value */ null;
        const filterText: string | null = req.query.filterText as string | null || /* default value */ null;
        const lastName: string | null = req.query.lastName as string | null || /* default value */ null;

        try {
            // Assuming this.postBL.getPosts expects parameters from, to, filterText and lastName
            const posts = await this.postBL.getPosts(from, to, filterText, lastName);
            res.status(200).send(posts);
        } catch (error) {
            res.status(400).send((error as Error).message);
        }
    }

    async updatePost(req: Request, res: Response): Promise<void> {
        const postID = +req.params.id;
        const postData = req.body;
        try {
            await this.postBL.updatePost(postID, postData);
            res.status(200).send({message: `Post ${postID} updated successfully`});
        } catch (error) {
            res.status(404).send((error as Error).message);
        }
    }

    async deletePost(req: Request, res: Response): Promise<void> {
        const postID = +req.params.id;
        try {
            await this.postBL.deletePost(postID);
            res.status(200).send({ message: `Post ${postID} deleted successfully` });
        } catch(error) {
            res.status(404).send((error as Error).message);
        }
    }
}