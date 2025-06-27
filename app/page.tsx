"use client";
// https://www.youtube.com/watch?v=O8ivm7403rk&t=8s
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface DataType {
  id: string;
  title: string;
  completed: boolean;
}

async function fetchData(): Promise<DataType[]> {
  const response = await fetch("/api/todoItem");
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
}

export default function HomePage() {
  const [data, setData] = useState<DataType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  useEffect(() => {
    fetchData().then(setData).catch(console.error);
  }, []);

  const startEditing = (item: DataType) => {
    setEditingId(item.id);
    setEditText(item.title);
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch("/api/todoItem", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: editText }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setData((prev) => prev.map(d => d.id === id ? updated : d));
      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">CSCI4830 To‑Do List</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4 flex-1">
                {editingId === item.id ? (
                  <Input value={editText} onChange={e => setEditText(e.target.value)} className="flex-1" />
                ) : (
                  <span className="font-medium">{item.title}</span>
                )}
                <Badge variant={item.completed ? "default" : "secondary"}>
                  {item.completed ? "Completed" : "Pending"}
                </Badge>
              </div>
              <div className="flex gap-2">
                {editingId === item.id ? (
                  <>
                    <Button size="sm" onClick={() => saveEdit(item.id)}>Save</Button>
                    <Button variant="outline" size="sm" onClick={cancelEdit}>Cancel</Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => startEditing(item)}>Edit</Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}