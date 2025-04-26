// This script creates a database in Neon
const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  // Connect to the default postgres database
  const connectionString = process.env.DATABASE_URL.replace('/careerpilot', '/postgres');
  
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to Neon PostgreSQL server');
    
    // Create the database
    await client.query('CREATE DATABASE careerpilot');
    console.log('Database "careerpilot" created successfully');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await client.end();
    console.log('Connection closed');
  }
}

createDatabase();
