import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from 'bcryptjs';

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
    try {
      const isExist = await prisma.user.findUnique({ where: { email: email } });
    
      if (isExist) {
        return {
          success: false,
          message: "Email existed.", 
          user: {}
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      password = hashedPassword;

      const user =  await prisma.user.create({ 
        data: { 
          name, 
          email, 
          role: role as UserRole, 
          timezone, 
          password 
        }
      });

      if (!user) {
        return {
          success: false,
          message: "Error upon creation.", 
          user: user
        }
      }

      return {
        success: true,
        message: "Created successfully.", 
        user: user
      }
    } catch (error) {
      return {
        success: false,
        message: `Error create user: ${error}`, 
        user: {}
      }
    }
  },
  updateUser: async(
    _: any, // eslint-disable-line 
    {
      id,
      edit
    }: {
      id: string,
      edit: any // eslint-disable-line
    }
  ) => {
    try {
      if (!id) {
        return {
          user: {},
          success: false,
          message: "ID is required.",
        }
      }

      const user = await prisma.user.update({
        where: { id: id },
        data: edit
      }); 

      return {
        user: user,
        success: true,
        message: "Successfully updated.",
      }
    } catch (error) {
      return {
        user: {},
        success: false,
        message: `Error update user: ${error}`,
      }
    }
  },
  deleteUser: async(
    _: any, // eslint-disable-line 
    {
      id
    }: {
      id: string
    }
  ) => {
    try {
      if (!id) {
        return {
          success: false,
          message: "ID is required.",
        }
      }
  
      await prisma.user.delete({ where: { id: id } });
  
      return {
        success: true,
        message: "Successfully deleted.",
      }
    } catch (error) {
      return {
        success: false,
        message: `Error delete user: ${error}`, 
      }
    }
  },
};

export default mutations;