'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SortDropdown } from "@/components/sort-dropdown";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useRouter } from "next/navigation";

// Define the note type
type Note = {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string | null;
  user_id: string;
};

export type SortOption = "created_desc" | "created_asc" | "title_asc" | "title_desc";

type InfiniteNotesProps = {
  userId: string;
};

export function InfiniteNotes({ userId }: InfiniteNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>("created_desc");
  const [cursor, setCursor] = useState("0");
  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false); // Prevent multiple simultaneous requests

  const loadNotes = useCallback(async (reset = false) => {
    // Prevent multiple simultaneous fetches
    if (isFetching) return;
    
    try {
      setIsFetching(true);
      setIsLoading(true);
      
      // If reset is true, we're changing the sort order, so start from beginning
      const currentCursor = reset ? "0" : cursor;
      
      const response = await fetch(
        `/api/notes?cursor=${currentCursor}&limit=20&sort=${sortOption}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.notes || data.notes.length === 0) {
        setHasMore(false);
        if (reset) {
          setNotes([]);
        }
        return;
      }
      
      // Use a Set to track existing note IDs to prevent duplicates
      if (reset) {
        setNotes(data.notes);
      } else {
        setNotes(prevNotes => {
          // Get existing IDs
          const existingIds = new Set(prevNotes.map(note => note.id));
          // Filter out any duplicates from new notes
          const uniqueNewNotes = data.notes.filter((note: Note) => !existingIds.has(note.id));
          
          // If we got no new unique notes, we're done
          if (uniqueNewNotes.length === 0) {
            setHasMore(false);
            return prevNotes;
          }
          
          return [...prevNotes, ...uniqueNewNotes];
        });
      }
      
      if (!data.nextCursor || data.notes.length < 20) {
        setHasMore(false);
      } else {
        setCursor(data.nextCursor);
        setHasMore(true);
      }
      
      setError(null);
    } catch (err) {
      setError("Error loading notes. Please try again.");
      console.error(err);
      
      // Redirect to login if unauthorized
      if (err instanceof Error && err.message.includes("401")) {
        router.push("/sign-in");
      }
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [cursor, sortOption, router, isFetching]);

  // Initial load
  useEffect(() => {
    loadNotes(true);
  }, [sortOption]); // Remove loadNotes from dependency array to avoid recursive calls

  // Setup intersection observer for infinite scrolling
  const lastNoteRef = useCallback((node: HTMLElement | null) => {
    if (isLoading || isFetching || !hasMore) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && cursor !== "end" && !isFetching) {
        loadNotes(false);
      }
    }, {
      rootMargin: '100px' // Load earlier, before user reaches the end
    });
    
    if (node) {
      observer.current.observe(node);
    }
  }, [isLoading, hasMore, cursor, loadNotes, isFetching]);

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
    setCursor("0");
    setHasMore(true);
  };

  return (
    <div className="flex-1 w-full">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Notes</h1>
          <div className="flex items-center gap-2">
            <SortDropdown currentSort={sortOption} onSortChange={handleSortChange} />
            <Link href="/protected/notes/new">
              <Button>
                <Plus className="mr-2" size={16} />
                New Note
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 text-red-500 bg-red-50 rounded-md mb-4">
            {error}
          </div>
        )}

        {notes.length === 0 && !isLoading ? (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <p>You don't have any notes yet.</p>
            <Link href="/protected/notes/new">
              <Button className="mt-4">Create your first note</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {notes.map((note, index) => (
              <Link
                key={`${note.id}-${index}`} // Add index to ensure uniqueness
                href={`/protected/notes/${note.id}`}
                className={cn(
                  "block p-4 border-2 rounded-lg bg-card hover:shadow-md transition-shadow",
                  "border-border"
                )}
                // Attach ref to the last element
                ref={index === notes.length - 1 ? lastNoteRef : null}
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
        )}

        {isLoading && (
          <div className="flex justify-center my-6">
            <LoadingSpinner size={30} />
          </div>
        )}

        {!isLoading && !hasMore && notes.length > 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No more notes to load
          </div>
        )}
      </div>
    </div>
  );
} 