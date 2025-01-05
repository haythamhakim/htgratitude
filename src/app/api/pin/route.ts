import { NextRequest } from "next/server";

function checkPin(pin: string) {
  if (pin === process.env.PIN) {
    return Response.json({ success: true }, { status: 200 });
  } else {
    return Response.json({ success: false }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pin = body.pin;

    return checkPin(pin);
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
