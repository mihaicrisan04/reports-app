'use client';

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AutoUpdateNote() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isRunning) return;

      const { data: notes } = await supabase
        .from('notes')
        .select('*')
        .eq('title', 'notita a')
        .single();

      if (notes) {
        const currentLength = notes.content?.length || 0;
        const newContent = notes.content + ' more ' + new Date().toLocaleTimeString();

        const { error } = await supabase
          .from('notes')
          .update({ 
            content: newContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', notes.id);

        if (error) {
          console.error('Error updating note:', error);
          setIsRunning(false);
        } else {
          router.refresh();
        }
      }
    }, 5000); // Update every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, router, supabase]);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-card border rounded-lg shadow-lg">
      <p className="text-sm mb-2">Auto-update status: {isRunning ? 'Running' : 'Stopped'}</p>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
      >
        {isRunning ? 'Stop' : 'Start'} Updates
      </button>
    </div>
  );
} 