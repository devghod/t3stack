import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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