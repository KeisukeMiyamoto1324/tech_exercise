"use client";
// https://www.youtube.com/watch?v=O8ivm7403rk&t=8s
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // 初回レンダリング時に一度だけデータを取得する
  useEffect(() => {
    fetchData().then((fetchedData) => {
      setData(fetchedData);
    });
  }, []);

  const handleEdit = (todo: dataType): void => {
    console.log(`Editing todo: ${todo.title}`);
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const handleSave = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/api/todoItem`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // bodyにIDと更新したいテキストの両方を含める
        body: JSON.stringify({ id: id, title: editText }),
      });

      if (!response.ok) {
        console.error("Failed to update todo");
        return;
      }

      const updatedTodo = await response.json();

      setData((prevData) =>
        prevData.map((item) => (item.id === id ? updatedTodo : item))
      );

      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleCancel = (): void => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <main className="flex flex-col gap-8 items-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center">CSCI4830 Hello world!</CardTitle> // Dominic Larson was here
          </CardHeader>
          <CardContent className="space-y-4">
            {data.map((todo: dataType) => (
              <div
                className="flex items-center justify-between p-4 border rounded-lg"
                key={todo.id}
              >
                <div className="flex items-center gap-4 flex-1">
                  {editingId === todo.id ? (
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1"
                    />
                  ) : (
                    <span className="font-medium">{todo.title}</span>
                  )}
                  <Badge variant={todo.completed ? "default" : "secondary"}>
                    {todo.completed ? "Completed" : "Not Completed"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {editingId === todo.id ? (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSave(todo.id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(todo)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
