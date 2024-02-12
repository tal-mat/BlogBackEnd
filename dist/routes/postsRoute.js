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
const express_1 = __importDefault(require("express"));
const PostController_1 = require("../controllers/PostController");
const PostBL_1 = require("../BL/PostBL");
const PostRepository_1 = require("../dal/PostRepository");
const postsRoute = express_1.default.Router();
const postController = new PostController_1.PostController(new PostBL_1.PostBL(new PostRepository_1.PostRepository()));
postsRoute.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.addPost(req, res); }));
postsRoute.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.getPost(req, res); }));
postsRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.getPosts(req, res); }));
postsRoute.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.updatePost(req, res); }));
postsRoute.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield postController.deletePost(req, res); }));
exports.default = postsRoute;
