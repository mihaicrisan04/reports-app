'use client';

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log("No authenticated use found")
      setIsSubmitting(false);
      router.push('/sign-in');
      return;
    }
    
    const { error } = await supabase
      .from('notes')
      .insert([{ 
        title, 
        content,
        user_id: user.id,
        updated_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error creating note:', error);
      setIsSubmitting(false);
    } else {
      router.push('/protected/notes');
      router.refresh();
    }
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto">
      <Link href="/protected/notes" className="inline-block mb-6">
        <Button variant="ghost">
          <ArrowLeft className="mr-2" size={16} />
          Back to Notes
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-6">Create New Note</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-md font-medium block mb-2" htmlFor="title">
            Title
          </label>
          <input
            className="w-full rounded-md px-4 py-2 bg-inherit border"
            name="title"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="text-md font-medium block mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            className="w-full rounded-md px-4 py-2 bg-inherit border min-h-[200px]"
            name="content"
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />
        </div>

        <div>
          <Button
            className="w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </form>
    </div>
  );
}