import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("http://localhost:5001/todos");
  const todos = await res.json();

  return NextResponse.json(todos);
}