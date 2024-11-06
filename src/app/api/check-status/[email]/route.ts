import prisma from "@/lib/db";
import { emailTypeSchema } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  const email = (await params).email;

  const validation = emailTypeSchema.safeParse(email);

  if (!validation.success) {
    const errorMessage = validation.error.errors[0].message;

    return NextResponse.json({
      whitelisted: false,
      message: errorMessage
    });
  }

  try {
    const status = await prisma.whitelisted.findFirst({
      where: {
        email: email
      }
    })

    return NextResponse.json({
      whitelisted: status !== null,
      message: status !== null ? "Email is whitelisted" : "Email is not whitelisted",
    })
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      whitelisted: false,
      message: "An error occurred while checking the status",
    });
  }
}