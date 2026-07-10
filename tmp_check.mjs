import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
try {
  const users = await p.citizenUser.findMany();
  console.log(JSON.stringify(users, null, 2));
} catch(e) { console.error(e); }
await p.$disconnect();
