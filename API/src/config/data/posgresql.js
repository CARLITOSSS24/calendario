import { pool } from './connectPoSQL.js';

const getusuarios = async () => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        console.log(result.rows);
    } catch (error) {
        console.log(error);
    } finally {
        await pool.end(); 
    }
};

getusuarios();