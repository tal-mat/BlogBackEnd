
import Post from '../models/ORM/Post';

class InMemoryDB {
    // Because in step 1 we don’t want to use the database, Wwe will persist the data in memory (RAM) using a Map of Posts.
    private static instance: InMemoryDB; // Singleton design pattern, ensuring that there is only one instance of the InMemoryDB class.
    private posts: Map<number, Post> = new Map();

    private constructor() {}

    public static getInstance(): InMemoryDB {
        if (!InMemoryDB.instance) {
            InMemoryDB.instance = new InMemoryDB();
        }
        return InMemoryDB.instance;
    }

    // Posts Methods
    addPost(post: Post) {
        this.posts.set(post.id, post);
    }

    getPostByID(id: number): Post | undefined {
        return this.posts.get(id);
    }

    getAllPosts():  Map<number, Post> {
        // Returns a new Map with the posts data to avoid exposing the internal map directly
        return new Map(this.posts);
    }

    updatePost(id: number, postData: Partial<Post>) {
        let post = this.posts.get(id);
        if (post) {
            // Update attributes of the post
            post = {...post, ...postData};
            this.posts.set(id, post);
        }
    }

    deletePost(id: number) {
        this.posts.delete(id);
    }

    // getPosts(): [str] {
    //     const posts = ["flower are the best", "banana is yellow", "apple is not only fruit", "AI of google is the best", "Chatgpt AI wants to be the best too"];
    //     // @ts-ignore
    //     return posts;
    //
    // }

    // searchNave(textFilter: string): Boolean {
    // const posts = getPosts();
    // result = [];
    // for (let i = 0; i < posts.length; i++) {
    //     for (let word = 0; word < post.length; word++) {
    //         if (textFilter === word):
    //         {
    //             result.push(post);
    //         }
    //     }
    // }
    // return result;
}

export default InMemoryDB;