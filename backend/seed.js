import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Test1234!', 10);

  console.log('Seeding database...');

  // Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      address: '123 Admin Street',
      role: 'ADMIN'
    }
  });

  // Create Store Owner and Store
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Store Owner',
      email: 'owner@example.com',
      password: hashedPassword,
      address: '456 Owner Avenue',
      role: 'STORE_OWNER'
    }
  });

  await prisma.store.upsert({
    where: { email: 'store@example.com' },
    update: {},
    create: {
      name: 'The Awesome Store',
      email: 'store@example.com',
      address: '789 Retail Blvd',
      ownerId: owner.id
    }
  });

  // Create Normal User
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Normal User Person',
      email: 'user@example.com',
      password: hashedPassword,
      address: '321 User Lane',
      role: 'NORMAL_USER'
    }
  });

  console.log('Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
