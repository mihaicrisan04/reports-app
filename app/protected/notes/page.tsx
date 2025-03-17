import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { SortDropdown, type SortOption } from "@/components/sort-dropdown";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: { sort?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Default sort is created_desc if not specified
  const sortOption = (searchParams.sort || "created_desc") as SortOption;
  
  // Build the query based on the sort option
  let query = supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id);
  
  // Apply sorting based on the selected option
  if (sortOption === "created_desc") {
    query = query.order('created_at', { ascending: false });
  } else if (sortOption === "created_asc") {
    query = query.order('created_at', { ascending: true });
  } else if (sortOption === "title_asc") {
    query = query.order('title', { ascending: true });
  } else if (sortOption === "title_desc") {
    query = query.order('title', { ascending: false });
  }
  
  const { data: notes, error } = await query;

  if (error) {
    console.error("Error fetching notes:", error);
  }

  return (
    <div className="flex-1 w-full">
      <div className="max-w-2xl mx-auto">
        <Link href="/protected" className="inline-block mb-6">
          <Button variant="ghost">
            <ArrowLeft className="mr-2" size={16} />
            Back
          </Button>
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Notes</h1>
          <div className="flex items-center gap-2">
            <SortDropdown currentSort={sortOption} />
            <Link href="/protected/notes/new">
              <Button>
                <Plus className="mr-2" size={16} />
                New Note
              </Button>
            </Link>
          </div>
        </div>

        {notes && notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note) => (
              <Link 
                key={note.id} 
                href={`/protected/notes/${note.id}`}
                className="block p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{note.title}</h2>
                </div>
                <p className="text-muted-foreground mt-2 line-clamp-2">
                  {note.content || "No content"}
                </p>
                <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                  <span>
                    Created: {new Date(note.created_at).toLocaleDateString()}
                  </span>
                  {note.updated_at && (
                    <span>
                      Updated: {new Date(note.updated_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <p>You don't have any notes yet.</p>
            <Link href="/protected/notes/new">
              <Button className="mt-4">Create your first note</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}


