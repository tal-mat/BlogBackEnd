"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InMemoryDB {
    constructor() {
        this.posts = new Map();
    }
    static getInstance() {
        if (!InMemoryDB.instance) {
            InMemoryDB.instance = new InMemoryDB();
        }
        return InMemoryDB.instance;
    }
    // Posts Methods
    addPost(post) {
        this.posts.set(post.id, post);
    }
    getPostByID(id) {
        return this.posts.get(id);
    }
    getAllPosts() {
        // Returns a new Map with the posts data to avoid exposing the internal map directly
        return new Map(this.posts);
    }
    updatePost(id, postData) {
        let post = this.posts.get(id);
        if (post) {
            // Update attributes of the post
            post = Object.assign(Object.assign({}, post), postData);
            this.posts.set(id, post);
        }
    }
    deletePost(id) {
        this.posts.delete(id);
    }
}
exports.default = InMemoryDB;
