import request from 'supertest';
import { app } from '../Index';

describe('API Endpoints', () => {
    let postId: number;
    let userId: number;

    // post tests
    it('GET /posts should return all posts', async () => {
        const response = await request(app).get('/posts');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('length');
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('POST /posts should add a new post', async () => {
        const newPost = {
            category: 'Daily_Digest',
            title: 'New Post',
            description: 'This is a new post',
            imageUrl: 'https://example.com/image.jpg',
            date: new Date(),
            postedBy: 1,
            additionalProperty: 'Additional Data',
        };

        const response = await request(app).post('/posts').send(newPost);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Post created successfully');
        expect(response.body).not.toHaveProperty('id');
        postId = response.body.id;
    });

    it('GET /posts/:id should return a specific post', async () => {
        const response = await request(app).get(`/posts/${postId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', postId);
    });

    it('PUT /posts/:id should update a post', async () => {
        const updatedPost = {
            category: 'Daily_Digest',
            title: 'Updated Post',
            description: 'This post has been updated',
            imageUrl: 'https://example.com/updated-image.jpg',
            date: new Date(),
            postedBy: 1,
            additionalProperty: 'Updated Additional Data',
        };

        const response = await request(app).put(`/posts/${postId}`).send(updatedPost);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', postId);
    });

    it('DELETE /posts/:id should delete a post', async () => {
        const response = await request(app).delete(`/posts/${postId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', postId);
    });

    // user tests
    it('GET /users should return all users', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('length');
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('POST /users should add a new user', async () => {
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

        const response = await request(app).post('/users').send(newUser);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User created successfully');
        userId = response.body.id;
    });

    it('GET /users/:id should return a specific user', async () => {
        const response = await request(app).get(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', userId);
    });

    it('PUT /users/:id should update a user', async () => {
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

        const response = await request(app).put(`/users/${userId}`).send(updatedUser);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', userId);
    });

    it('DELETE /users/:id should delete a user', async () => {
        const response = await request(app).delete(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', userId);
    });
});
