import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request, 
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await db.user.findFirst({ 
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return NextResponse.json({ 
      success: true, 
      data: user,
      message: "Successfully get user!"
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Something went wrong"
    });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params;
    const body = await request.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await db.user.update({
      where: { id: userId },
      data: body
    }); 

    return NextResponse.json({ 
      success: true, 
      message: "Successfully updated user!",
      data: user
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Something went wrong"
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      throw new Error('User ID is required');
    }

    await db.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Something went wrong"
    });
  }
}