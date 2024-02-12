"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Post {
    constructor(id, category, title, description, imageUrl, date, postedBy) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.date = date;
        this.postedBy = postedBy;
    }
}
exports.default = Post;
