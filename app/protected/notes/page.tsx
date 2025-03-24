import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { SortDropdown, type SortOption } from "@/components/sort-dropdown";
import { NotesChart } from "@/components/notes-chart";
import { AutoUpdateNote } from "@/components/auto-update-note";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 4;

let mockNotes = [
  {
    id: "1",
    title: "First Note",
    content: "This is the first note",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Second Note",
    content: "This is the second note",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Third Note",
    content: "This is the third note",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Fourth Note",
    content: "This is the fourth note",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Fifth Note",
    content: "This is the fifth note",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Sixth Note",
    content: "This is the sixth note",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Seventh Note",
    content: "This is the seventh note",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Eighth Note",
    content: "This is the eighth note",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "9",
    title: "Ninth Note",
    content: "This is the ninth note",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "10",
    title: "Tenth Note",
    content: "This is the tenth note",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export default async function NotesPage({
  searchParams,
}: {
  searchParams: { sort?: string; page?: string };
}) {
  const supabase = await createClient();
  const currentPage = Number(searchParams.page) || 1;

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
    .select("*", { count: 'exact' })
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

  // Add pagination
  query = query
    .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);
  
  const { data: notes, error, count } = await query;

  if (error) {
    console.error("Error fetching notes:", error);
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  // Calculate min and max content lengths
  const contentLengths = notes?.map(note => note.content?.length || 0) || [];
  const maxLength = Math.max(...contentLengths);
  const minLength = Math.min(...contentLengths);

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
          <>
            <div className="space-y-4">
              {notes.map((note) => (
                <Link 
                  key={note.id} 
                  href={`/protected/notes/${note.id}`}
                  className={cn(
                    "block p-4 border-2 rounded-lg bg-card hover:shadow-md transition-shadow",
                    (note.content?.length || 0) === maxLength && "border-red-500",
                    (note.content?.length || 0) === minLength && "border-green-500",
                    (note.content?.length || 0) !== maxLength && (note.content?.length || 0) !== minLength && "border-border"
                  )}
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

            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href={`/protected/notes?page=${currentPage - 1}&sort=${sortOption}`} 
                      />
                    </PaginationItem>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={`/protected/notes?page=${page}&sort=${sortOption}`}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        href={`/protected/notes?page=${currentPage + 1}&sort=${sortOption}`} 
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}

            <NotesChart notes={notes} />
            {/* <AutoUpdateNote /> */}
          </>
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


