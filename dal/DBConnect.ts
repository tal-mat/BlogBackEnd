import { Pool } from 'pg';

const pool = new Pool({
    user: '',
    host: 'localhost',
    database: 'blog_db',
    password: '',
    port: 5432,
});

export default pool;
