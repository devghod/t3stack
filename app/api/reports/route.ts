"use server"

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subMonths, startOfMonth, format } from "date-fns";
import { currentUserRole } from "@/hooks/useServerSide";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    const userRole = await currentUserRole();

    if (userRole !== UserRole.ADMIN) {
      throw new Error("You are not authorized to access this resource");
    }

    const startDate = startOfMonth(subMonths(new Date(), 4));
    
    const users = await db.user.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    const reportData: Record<string, { 
      Github: number; 
      Google: number; 
      Credentials: number 
    }> = {};

    for (let i = 0; i < 5; i++) {
      const monthKey = format(subMonths(new Date(), i), "MMM yyyy");
      reportData[monthKey] = { Github: 0, Google: 0, Credentials: 0 };
    }

    users.forEach((user) => {
      const monthKey = format(user.createdAt, "MMM yyyy");

      if (!reportData[monthKey]) return;

      if (user.accounts.length === 0) {
        reportData[monthKey]["Credentials"] += 1;
      } else {
        user.accounts.forEach((account) => {
          const provider = account.provider.toLowerCase();
          if (provider === "github") reportData[monthKey]["Github"] += 1;
          else if (provider === "google") reportData[monthKey]["Google"] += 1;
          else reportData[monthKey]["Credentials"] += 1;
        });
      }
    });

    const reportArray = Object.entries(reportData).map(([date, counts]) => ({
      date,
      ...counts,
    }));

    return NextResponse.json({ success: true, data: reportArray });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json({ success: false, message: `Server Error: ${error}` }, { status: 500 });
  }
}
