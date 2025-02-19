import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        email: email
      }
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findFirst({
      where: { id }
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
  }
}