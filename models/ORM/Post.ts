class Post {
    id: number;
    category: string;
    title: string;
    description: string;
    imageUrl: string;
    date: Date;
    postedBy: number; // user ID

    constructor(id: number, category: string, title: string, description: string, imageUrl: string, date: Date, postedBy: number) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.date = date;
        this.postedBy = postedBy;
    }
}

export default Post;