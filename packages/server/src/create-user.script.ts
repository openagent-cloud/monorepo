import { PrismaClient, user_role } from '../../shared/src/generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    // Create a new user
    const user = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        username: 'zoo',
        name: 'Zoo',
        password_hash: hashedPassword,
        role: user_role.super_admin,
        is_email_verified: true,
      },
    });

    console.log('User created successfully:', user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createUser();
