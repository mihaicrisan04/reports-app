'use client';

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewNotePage() {
  const [title, setTitle] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('notes')
      .insert([{ title }]);

    if (!error) {
      router.push('/protected/notes');
      router.refresh();
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form onSubmit={handleSubmit} className="animate-in flex-1 flex flex-col w-full justify-center gap-6">
        <label className="text-md" htmlFor="title">
          Note Title
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border"
          name="title"
          placeholder="Enter your note"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-foreground mb-2"
          type="submit"
        >
          Save Note
        </button>
      </form>
    </div>
  );
}