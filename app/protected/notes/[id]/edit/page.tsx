'use client';

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditNotePage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchNote() {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (error || !data) {
        console.error('Error fetching note:', error);
        router.push('/protected/notes');
        return;
      }
      
      setTitle(data.title);
      setContent(data.content || '');
      setIsLoading(false);
    }
    
    fetchNote();
  }, [params.id, router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('notes')
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    if (error) {
      console.error('Error updating note:', error);
      setIsSubmitting(false);
    } else {
      router.push(`/protected/notes/${params.id}`);
      router.refresh();
    }
  };

  if (isLoading) {
    return <div className="w-full max-w-2xl mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto">
      <Link href={`/protected/notes/${params.id}`} className="inline-block mb-6">
        <Button variant="ghost">
          <ArrowLeft className="mr-2" size={16} />
          Back to Note
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-6">Edit Note</h1>
      
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
