"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(((_a = process.env.DB_PORT) === null || _a === void 0 ? void 0 : _a.toString()) || '0', 10),
});
exports.default = pool;
