const mysql = require('mysql2/promise');


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD||"",
    database: process.env.DB_NAME || 'Quran',
    port: process.env.DB_PORT,
    waitForConnections: true,
    multipleStatements: true,
    connectionLimit: 10,
    queueLimit: 0
  });

    pool.query("SHOW TABLES").then(([rows]) => {
      if (rows.length === 0) 
        console.log("No tables found in the database.");
      else 
      console.log("Tables in the database:", rows);
    });
    
    
module.exports=pool;



