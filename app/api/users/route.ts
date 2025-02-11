"use server"

import { currentUserRole } from "@/hooks/useServerSide";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const userRole = await currentUserRole();

    if (userRole !== UserRole.ADMIN) {
      throw new Error("You are not authorized to access this resource");
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      db.user.findMany({
        take: limit,
        skip: skip,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      db.user.count()
    ]);

    return NextResponse.json({ 
      success: true, 
      message: "Successfully get all users!",
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      message: `Server Error: ${error}`,
      success: false, 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const isExist = await db.user.findUnique({
      where: { email: data.email }
    });

    if (isExist) {
      throw new Error('Email existed!');
    }

    const user = await db.user.create({
      data: { ...data }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Successfully created!",
      data: user
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Something went wrong"
    });
  }
}
 