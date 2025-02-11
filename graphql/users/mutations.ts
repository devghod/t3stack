import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const mutations = {
  addUser: async (
    _: any, // eslint-disable-line
    { 
      name, 
      email,
      role,
      timezone,
      password,
    }: { 
      name: string; 
      email: string; 
      role: string;
      timezone: string;
      password: string;
    }
  ) => { 

      const isExist = await prisma.user.findUnique({ where: { email: email } });
      
      if (isExist) {
        throw new Error('Email existed!');
      }

      return await prisma.user.create({ 
        data: { 
          name, 
          email, 
          role: role as UserRole, 
          timezone, 
          password 
        }
      });
  },
};

export default mutations;