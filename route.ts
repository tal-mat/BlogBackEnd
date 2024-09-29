import { Client } from 'pg';
require('dotenv').config();


export const helloWorldHandler = async (req: any, res: { json: (arg0: { message: any; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) => {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    try {
        await client.connect();

        const result = await client.query('SELECT $1::text as message', ['Hello, World!']);
        res.json({ message: result.rows[0].message });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.end();
    }
};
