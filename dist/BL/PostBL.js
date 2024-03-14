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
exports.PostBL = void 0;
const Post_1 = __importDefault(require("../models/ORM/Post"));
class PostBL {
    constructor(postDataAccess) {
        this.postDataAccess = postDataAccess;
    }
    addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.postDataAccess.add(post);
            }
            catch (error) {
                throw new Error(`Unable to add Post: ${error.message}`);
            }
        });
    }
    getPost(postID) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postDataAccess.getItemByID(postID);
            if (!Post_1.default) {
                throw new Error(`Post with ID ${postID} not found`);
            }
            return post;
        });
    }
    getPosts(from, to, filterText, lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.postDataAccess.getItems(from, to, filterText, lastName);
            if (!posts) {
                throw new Error(`Posts were not found`);
            }
            return posts;
        });
    }
    updatePost(postID, updateDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.postDataAccess.update(postID, updateDate);
            }
            catch (error) {
                throw new Error(`Unable to update Post: ${error.message}`);
            }
        });
    }
    deletePost(postID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.postDataAccess.delete(postID);
            }
            catch (error) {
                throw new Error(`Unable to delete Post: ${error.message}`);
            }
        });
    }
}
exports.PostBL = PostBL;
