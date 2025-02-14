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
    // const offset = (page - 1) * limit; // starting page is 1
    const offset = page * limit; // starting page is 0

    const users = await prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!users) {
      return {
        message: `Unsuccessfully collect page ${page}`,
        success: false,
        users: [],
        pagination: {
          total: total || 0, 
          totalPages,
          page: page,
          limit: limit,
        }
      }
    }

    return {
      message: `Successfully collect page ${page}`,
      success: true,
      users,
      pagination: {
        total: total || 0, 
        totalPages,
        page: page,
        limit: limit,
      },
    };
  },
};

export default queries;