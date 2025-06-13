"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface dataType {
  id: string;
  title: string;
  completed: boolean;
}

async function fetchData() {
  const response = await fetch("http://localhost:3000/api/todoItem", {
    method: "GET",
  });

  return response.json();
}

export default function Home() {
  const [text, setText] = useState("");
  const [data, setData] = useState<dataType[]>([]);

  // 初回レンダリング時に一度だけデータを取得する
  useEffect(() => {
    fetchData().then((fetchedData) => {
      setData(fetchedData);
    });
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>CSCI4830 Hello world!</div>
        <ul>
          {data.map((todo: dataType) => (
            <li key={todo.id}>
              {todo.title} - {todo.completed ? "Completed" : "Not Completed"}
            </li>
          ))}
        </ul>

        <Link href="/about">
          <button className="hover:cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full">
            Go to About
          </button>
        </Link>

        <input
          type="text"
          value={text}
          placeholder="Enter something here and click button below"
          onChange={(e) => setText(e.target.value)}
          className="border border-blue-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div>{text}</div>

        <Link href={`/${text}`}>
          <button className="hover:cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full">
            Dynamic routing
          </button>
        </Link>
      </main>
    </div>
  );
}
