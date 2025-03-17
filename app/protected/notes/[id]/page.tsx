import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import DeleteNoteButton from "@/components/ui/delete-button";

export default async function NotePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: note, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !note) {
    console.error("Error fetching note:", error);
    return notFound();
  }

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/protected/notes">
          <Button variant="ghost">
            <ArrowLeft className="mr-2" size={16} />
            Back to Notes
          </Button>
        </Link>
        
        <div className="flex gap-2">
          <Link href={`/protected/notes/${note.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2" size={16} />
              Edit
            </Button>
          </Link>
          <DeleteNoteButton id={note.id} />
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
        
        <div className="prose max-w-none whitespace-pre-wrap">
          {note.content || "No content"}
        </div>

        <div className="mt-8 pt-4 border-t text-sm text-muted-foreground">
          <p>Created: {new Date(note.created_at).toLocaleString()}</p>
          {note.updated_at && (
            <p>Last updated: {new Date(note.updated_at).toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
