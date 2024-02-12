"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const Post_1 = __importDefault(require("../models/ORM/Post"));
class PostController {
    constructor(postBL) {
        this.postBL = postBL;
    }
    addPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postData = req.body;
            const post = new Post_1.default(postData.id, postData.category, postData.title, postData.description, postData.imageUrl, postData.date, postData.postedBy);
            try {
                yield this.postBL.addPost(post);
                res.status(201).send({ message: `Post created successfully` });
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postID = +req.params.id;
            try {
                const post = yield this.postBL.getPost(postID);
                res.status(200).send(post);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extracting parameters from query parameters
            const from = parseInt(req.query.from) || /* default value */ null;
            const to = parseInt(req.query.to) || /* default value */ null;
            const filterText = req.query.filterText || /* default value */ null;
            const lastName = req.query.lastName || /* default value */ null;
            try {
                // Assuming this.postBL.getPosts expects parameters from, to, filterText and lastName
                const posts = yield this.postBL.getPosts(from, to, filterText, lastName);
                res.status(200).send(posts);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postID = +req.params.id;
            const postData = req.body;
            try {
                yield this.postBL.updatePost(postID, postData);
                res.status(200).send({ message: `Post ${postID} updated successfully` });
            }
            catch (error) {
                res.status(404).send(error.message);
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postID = +req.params.id;
            try {
                yield this.postBL.deletePost(postID);
                res.status(200).send({ message: `Post ${postID} deleted successfully` });
            }
            catch (error) {
                res.status(404).send(error.message);
            }
        });
    }
}
exports.PostController = PostController;
