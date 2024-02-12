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
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorldHandler = void 0;
const pg_1 = require("pg");
const helloWorldHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new pg_1.Client({
        host: 'blog_db',
        port: 5432,
        user: 'postgres',
        password: 'Taltal1993',
    });
    try {
        yield client.connect();
        const result = yield client.query('SELECT $1::text as message', ['Hello, World!']);
        res.json({ message: result.rows[0].message });
    }
    catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        yield client.end();
    }
});
exports.helloWorldHandler = helloWorldHandler;
