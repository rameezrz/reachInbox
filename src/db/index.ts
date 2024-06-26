import prisma from "../config/prismaClient";

export const register = async (
  email: string,
  provider: string,
  access_token: string,
  refresh_token: string
) => {
  const user = await prisma.user.create({
    data: { email, provider, access_token, refresh_token },
  });
  return user;
};

export const updateTokens = async (
  email: string,
  access_token: string,
  refresh_token: string
) => {
  const user = await prisma.user.update({
    where: { email },
    data: { access_token, refresh_token },
  });
  return user;
};

export const findUser = async (email?: string, userId?: number) => {
  const user = await prisma.user.findUnique({
    where: { email, id: userId },
  });
  return user;
};

export const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export const getTokens = async (email: string, provider: string) => {
  const tokens = await prisma.user.findUnique({
    where: { email, provider },
    select: { access_token: true, refresh_token: true },
  });
  return tokens;
};
