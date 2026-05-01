const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

async function test() {
  console.log('Testing connection to:', process.env.DATABASE_URL);
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();
    console.log('Successfully connected to the database!');
    const users = await prisma.user.findMany();
    console.log('Users count:', users.length);
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
