// import Post from '../models/ORM/Post';
// import { DataAccess} from "./IDataAccess";
// import InMemoryDB from "../utils/InMemoryDB";
//
// export class PostDataAccessInMemory implements DataAccess<Post>{
//     private db = InMemoryDB.getInstance();
//
//     async add(post: Post): Promise<void> {
//         await this.db.addPost(post);
//     }
//
//     async getItemByID(postID: number): Promise<Post> {
//         const post = await this.db.getPostByID(postID);
//         if (!post) {
//             throw new Error(`Post with ID ${postID} was not found.`);
//         }
//         return post;
//     }
//
//     async getItems(): Promise<Post[]> {
//         const posts = await this.db.getAllPosts();
//         if (!posts) {
//             throw new Error(`Posts were not found.`);
//         }
//         return posts;
//     }
//
//     async update(postID: number, updateData: Partial<Post>): Promise<void> {
//         const existingPost = await this.db.getPostByID(postID);
//         if (!existingPost) {
//             throw new Error(`Post with ID ${postID} was not found.`);
//         }
//         this.db.updatePost(postID, updateData);
//     }
//
//     async delete(postID: number): Promise<void> {
//         const existingPost = await this.db.getPostByID(postID);
//         if (!existingPost) {
//             throw new Error(`Post with ID ${postID} was not found.`);
//         }
//         this.db.deletePost(postID);
//     }
// }