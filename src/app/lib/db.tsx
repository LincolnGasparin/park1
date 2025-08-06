import mysql from 'mysql2/promise';
    
 export async function Connection() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1234',
        database: process.env.DB_NAME || 'teste',
        port: 3305,
    });
    return connection;
 }  

 export default Connection;