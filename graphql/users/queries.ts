import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const queries =  {
  users: async () => await prisma.user.findMany(),
  user: async (_: any, { id }: { id: string }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    return await prisma.user.findUnique({ where: { id } });
  },
  getUsersPagination: async (
    _: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    { 
      page, 
      limit 
    }: { 
      page: number, 
      limit: number 
    }
  ) => { 
    const total = await prisma.user.count(); // Ensure this is not null
    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
    const offset = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip: offset,
      take: limit,
    });

    return {
      users,
      pagination: {
        total: total || 0, // Ensure it never returns null
        totalPages,
        page: page,
        limit: limit,
      },
    };
  },
};

export default queries;