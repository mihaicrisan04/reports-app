import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { SortDropdown, type SortOption } from "@/components/sort-dropdown";
import { NotesChart } from "@/components/notes-chart";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 4;

// Separate data fetching component
async function NotesList({ 
  userId, 
  sortOption, 
  currentPage 
}: { 
  userId: string;
  sortOption: SortOption;
  currentPage: number;
}) {
  const supabase = await createClient();
  
  // Build the query based on the sort option
  let query = supabase
    .from("notes")
    .select("*", { count: 'exact' })
    .eq("user_id", userId);
  
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
    return null;
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p>You don't have any notes yet.</p>
        <Link href="/protected/notes/new">
          <Button className="mt-4">Create your first note</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {notes.map((note) => (
          <Link 
            key={note.id} 
            href={`/protected/notes/${note.id}`}
            className={cn(
              "block p-4 border-2 rounded-lg bg-card hover:shadow-md transition-shadow",
              "border-border"
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
        <Pagination className="mt-6">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`?page=${currentPage - 1}&sort=${sortOption}`} />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`?page=${page}&sort=${sortOption}`}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href={`?page=${currentPage + 1}&sort=${sortOption}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

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

        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner size={40} />
          </div>
        }>
          <NotesList 
            userId={user.id} 
            sortOption={sortOption} 
            currentPage={currentPage} 
          />
        </Suspense>
      </div>
    </div>
  );
}


