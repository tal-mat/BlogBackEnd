import pool from '../dal/DBConnect'
import { DataAccess } from './IDataAccess'
import Post from '../models/ORM/Post';

export class PostRepository implements DataAccess<Post> {

    async add(post: Post): Promise<void> {
        const query = 'INSERT INTO post ("category", "title", "description", "imageUrl", "date", "postedBy") VALUES ($1, $2, $3, $4, $5, $6)';
        await pool.query(query, [post.category, post.title, post.description, post.imageUrl, post.date, post.postedBy]);
    }

    async delete(postID: number): Promise<void> {
        const query = 'DELETE FROM post WHERE id = $1';
        const result = await pool.query(query, [postID]);
        if (result.rowCount === 0) {
            throw new Error(`Post with ID ${postID} not found`);
        }
    }

    async update(postID: number, updateData: Partial<Post>): Promise<void> {
        let query = 'UPDATE post SET ';
        const updates: string[] = [];
        const values: (string | number | Date)[] = [];

        Object.entries(updateData).forEach(([key, value], index) => {
            // Enclose column names in double quotes
            const quotedKey = `"${key}"`;
            updates.push(`${quotedKey} = $${index + 1}`);
            values.push(value);
        });

        query += updates.join(', ') + ' WHERE id = $' + (values.length + 1); // Use values.length for postID

        values.push(postID);

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            throw new Error(`Unable to update post with ID ${postID}. Post not found.`);
        }
    }


    async getItemByID(postID: number): Promise<Post> {
        const query = 'SELECT * FROM post WHERE id = $1';
        const result = await pool.query(query, [postID]);

        if (result.rows.length === 0) {
            throw new Error(`Post with ID ${postID} not found`);
        }

        return result.rows[0];
    }


    async getItems(from?: number | null, to?: number | null, filterText?: string | null, lastName?: string | null): Promise<Post[]> {
        // Query with conditions and inner join to users
        const conditions = [];
        const params = [];

        if (from !== null) {
            conditions.push(`P."id" >= $${params.push(from)}`);
        }

        if (to !== null) {
            conditions.push(`P."id" <= $${params.push(to)}`);
        }

        if (filterText !== null) {
            conditions.push(`P."title" ILIKE $${params.push(`%${filterText}%`)}`);
        }

        if (lastName !== null) {
            conditions.push(`U."lastName" ILIKE $${params.push(`%${lastName}%`)}`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const query = `
        SELECT P.*
        FROM public.post AS P
        INNER JOIN public.user AS U ON P."postedBy" = U."id"
        ${whereClause};
    `;

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
        }

        return result.rows;
    }

}

