import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  const res = await fetch("http://localhost:5001/todos");
  const todos = await res.json();

  return NextResponse.json(todos);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  const body = await request.json();

  const res = await fetch(`http://localhost:5001/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to update todo" }, { status: res.status });
  }

  const updatedTodo = await res.json();
  return NextResponse.json(updatedTodo);
}