import { Pool } from "pg";


export const pool= new Pool({
  user:PG_USER,
  password:PG_PASSWORD,
  host:PG_HOST,
  port:PG_PORT,
  database:PG_DATABASE,
  ssl: {
    rejectUnauthorized: false, 
  },
  max: 10, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
