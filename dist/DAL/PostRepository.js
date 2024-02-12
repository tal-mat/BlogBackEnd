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
exports.PostRepository = void 0;
const DBConnect_1 = __importDefault(require("../dal/DBConnect"));
class PostRepository {
    add(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'INSERT INTO post ("category", "title", "description", "imageUrl", "date", "postedBy") VALUES ($1, $2, $3, $4, $5, $6)';
            yield DBConnect_1.default.query(query, [post.category, post.title, post.description, post.imageUrl, post.date, post.postedBy]);
        });
    }
    delete(postID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'DELETE FROM post WHERE id = $1';
            const result = yield DBConnect_1.default.query(query, [postID]);
            if (result.rowCount === 0) {
                throw new Error(`Post with ID ${postID} not found`);
            }
        });
    }
    update(postID, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = 'UPDATE post SET ';
            const updates = [];
            const values = [];
            Object.entries(updateData).forEach(([key, value], index) => {
                // Enclose column names in double quotes
                const quotedKey = `"${key}"`;
                updates.push(`${quotedKey} = $${index + 1}`);
                values.push(value);
            });
            query += updates.join(', ') + ' WHERE id = $' + (values.length + 1); // Use values.length for postID
            values.push(postID);
            const result = yield DBConnect_1.default.query(query, values);
            if (result.rowCount === 0) {
                throw new Error(`Unable to update post with ID ${postID}. Post not found.`);
            }
        });
    }
    getItemByID(postID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM post WHERE id = $1';
            const result = yield DBConnect_1.default.query(query, [postID]);
            if (result.rows.length === 0) {
                throw new Error(`Post with ID ${postID} not found`);
            }
            return result.rows[0];
        });
    }
    // async getItems(from?: number | null, to?: number | null, filterText?: string | null): Promise<Post[]> {
    //     // Replace "NaN" with null
    //     const sanitizedFrom = isNaN(from as number) ? null : from;
    //     const sanitizedTo = isNaN(to as number) ? null : to;
    //
    //     //         SELECT "id", "title", "imageUrl"
    //     const query = `
    //     SELECT *
    //     FROM post
    //     WHERE
    //       (("id" BETWEEN $1 AND $2) OR ($1 IS NULL AND $2 IS NULL))
    //       AND (LOWER("title") LIKE LOWER($3) OR $3 IS NULL);
    // `;
    //
    //     const result = await pool.query(query, [sanitizedFrom, sanitizedTo, `%${filterText}%`]);
    //
    //     if (result.rows.length === 0) {
    //         throw new Error(`No posts found`);
    //     }
    //
    //     // Directly return the array of posts
    //     return result.rows as Post[];
    // }
    getItems(from, to, filterText, lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('Parameters before execution:', {
            //     'from': from,
            //     'to': to,
            //     'filterText': filterText,
            //     'lastName': lastName,
            // });
            // Try to run a simple test query to check the database connection
            const testQuery = 'SELECT 1;';
            const testResult = yield DBConnect_1.default.query(testQuery);
            // console.log('Test Result:', testResult.rows);
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
            // console.log('Query:', query);
            // Execute the query with conditions and inner join
            const result = yield DBConnect_1.default.query(query, params);
            if (result.rows.length === 0) {
                // Handle no results if needed
                // throw new Error('No posts found.');
            }
            return result.rows;
        });
    }
}
exports.PostRepository = PostRepository;
