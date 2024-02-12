import {  PostRepository } from "../dal/PostRepository";
import Post from '../models/ORM/Post';

export class PostBL {
    private postDataAccess: PostRepository;

    constructor(postDataAccess: PostRepository) {
        this.postDataAccess = postDataAccess;
    }

    async addPost(post: Post): Promise<void> {
        try {
            await this.postDataAccess.add(post);
        } catch (error) {
            throw new Error(`Unable to add Post: ${(error as Error).message}`);
        }
    }

    async getPost(postID: number): Promise<Post> {
        const post = await this.postDataAccess.getItemByID(postID);
        if (!Post) {
            throw new Error(`Post with ID ${postID} not found`);
        }
        return post;
    }

    async getPosts(from?: number | null, to?: number | null, filterText?: string | null, lastName?: string | null): Promise<Post[]> {
        const posts = await this.postDataAccess.getItems(from, to, filterText, lastName);
        if (!posts) {
            throw new Error(`Posts were not found`);
        }
        return posts;
    }

    async updatePost(postID: number, updateDate: Partial<Post>): Promise<void> {
        try {
            await this.postDataAccess.update(postID, updateDate);
        } catch (error) {
            throw new Error(`Unable to update Post: ${(error as Error).message}`);
        }
    }

    async deletePost(postID: number): Promise<void> {
        try {
            await this.postDataAccess.delete(postID);
        } catch (error) {
            throw new Error(`Unable to delete Post: ${(error as Error).message}`);
        }
    }
}