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
const supertest_1 = __importDefault(require("supertest"));
const Index_1 = require("../Index");
describe('API Endpoints', () => {
    let postId;
    let userId;
    // post tests
    it('GET /posts should return all posts', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(Index_1.app).get('/posts');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('length');
        expect(Array.isArray(response.body)).toBe(true);
    }));
    it('POST /posts should add a new post', () => __awaiter(void 0, void 0, void 0, function* () {
        const newPost = {
            category: 'Daily_Digest',
            title: 'New Post',
            description: 'This is a new post',
            imageUrl: 'https://example.com/image.jpg',
            date: new Date(),
            postedBy: 1,
            additionalProperty: 'Additional Data',
        };
        const response = yield (0, supertest_1.default)(Index_1.app).post('/posts').send(newPost);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Post created successfully');
        expect(response.body).not.toHaveProperty('id');
        postId = response.body.id;
    }));
    it('GET /posts/:id should return a specific post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(Index_1.app).get(`/posts/${postId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', postId);
    }));
    it('PUT /posts/:id should update a post', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPost = {
            category: 'Daily_Digest',
            title: 'Updated Post',
            description: 'This post has been updated',
            imageUrl: 'https://example.com/updated-image.jpg',
            date: new Date(),
            postedBy: 1,
            additionalProperty: 'Updated Additional Data',
        };
        const response = yield (0, supertest_1.default)(Index_1.app).put(`/posts/${postId}`).send(updatedPost);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', postId);
    }));
    it('DELETE /posts/:id should delete a post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(Index_1.app).delete(`/posts/${postId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', postId);
    }));
    // user tests
    it('GET /users should return all users', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(Index_1.app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('length');
        expect(Array.isArray(response.body)).toBe(true);
    }));
    it('POST /users should add a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            password: 'password123',
            email: 'johndoe@example.com',
            birthDate: '1990-01-01',
            gender: 'male',
            address: '123 Main St, Cityville',
            phoneNumber: '1234567890',
            registrationDate: new Date(),
            accountStatus: true,
            role: 'user',
        };
        const response = yield (0, supertest_1.default)(Index_1.app).post('/users').send(newUser);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User created successfully');
        userId = response.body.id;
    }));
    it('GET /users/:id should return a specific user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(Index_1.app).get(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', userId);
    }));
    it('PUT /users/:id should update a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = {
            firstName: 'Updated John',
            lastName: 'Updated Doe',
            username: 'updatedjohndoe',
            password: 'updatedpassword123',
            email: 'updatedjohndoe@example.com',
            birthDate: '1990-01-01',
            gender: 'male',
            address: '456 Updated St, Cityville',
            phoneNumber: '9876543210',
            registrationDate: new Date(),
            accountStatus: true,
            role: 'admin',
        };
        const response = yield (0, supertest_1.default)(Index_1.app).put(`/users/${userId}`).send(updatedUser);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', userId);
    }));
    it('DELETE /users/:id should delete a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(Index_1.app).delete(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', userId);
    }));
});
