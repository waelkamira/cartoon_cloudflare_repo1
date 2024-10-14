// prisma.ts or prisma.js
import { PrismaClient } from '@prisma/client';
// Import libSQL and the Prisma libSQL driver adapter
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

// Instantiate libSQL
const libsql = createClient({
  url: process.env.NEXT_PUBLIC_TURSO_URL,
  authToken: process.env.NEXT_PUBLIC_TURSO_TOKEN,
});

// Instantiate the libSQL driver adapter
const adapter = new PrismaLibSQL(libsql);

// Create Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

// Export the Prisma Client
export default prisma;
