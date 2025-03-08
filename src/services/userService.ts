import prisma from '../lib/prisma';

export const findUserByEmail = async (email: string) => {
  console.log('[findUserByEmail] Looking up user with email:', email);
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    console.log('[findUserByEmail] User found with email:', email);
  } else {
    console.warn('[findUserByEmail] No user found with email:', email);
  }
  return user;
};

export const createUser = async (email: string, name?: string) => {
  console.log('[createUser] Creating user with email:', email, 'and name:', name);
  const user = await prisma.user.create({
    data: {
      email,
      name: name || '',
    },
  });
  console.log('[createUser] User created successfully with id:', user.id);
  return user;
};
