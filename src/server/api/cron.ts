import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // get the bearer token from the header
  const authHeader = req.headers.get("authorization") ?? "";
  const authToken = authHeader.split("Bearer ").at(1);

  // if not found OR the bearer token does NOT equal the CRON_SECRET
  if (!authToken || authToken != process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      },
    );
  }
  // if token exists then move on with the cron job
  console.log("AUTHED!");
}
