"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'talmatsil@gmail.com',
    host: 'localhost',
    database: 'blog_db',
    password: 'Taltal1993',
    port: 5432,
});
exports.default = pool;
