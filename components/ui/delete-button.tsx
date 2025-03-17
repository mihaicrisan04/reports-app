'use client';

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteNoteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setIsDeleting(true);
    
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      setIsDeleting(false);
      alert('Failed to delete note');
    } else {
      router.push('/protected/notes');
      router.refresh();
    }
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="mr-2" size={16} />
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
