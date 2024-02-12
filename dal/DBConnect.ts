import { Pool } from 'pg';

const pool = new Pool({
    user: 'talmatsil@gmail.com',
    host: 'localhost',
    database: 'blog_db',
    password: 'Taltal1993',
    port: 5432,
});

export default pool;
