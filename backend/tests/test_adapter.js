require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

async function test() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  try {
    const users = await prisma.user.findMany();
    console.log('Users:', users.length);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
test();
