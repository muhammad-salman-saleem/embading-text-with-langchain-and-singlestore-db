import mysql from "mysql2/promise";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } from "./constent";

const HOST =DB_HOST;
const USER = DB_USER;
const PASSWORD = DB_PASSWORD;
const DATABASE = DB_DATABASE;



const dbConnect = async () => {
    try {
      const connection = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
      });
  
      console.log("You have successfully connected to SingleStore.");
      return connection;
    } catch (err) {
      console.error("ERROR", err);
      process.exit(1);
    }
  };
  
  export { dbConnect };
