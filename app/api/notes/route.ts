import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;
  
  // Get user session
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Get pagination params
  const cursor = searchParams.get("cursor") || "0";
  const limit = parseInt(searchParams.get("limit") || "10");
  const sortOption = searchParams.get("sort") || "created_desc";
  
  // Build the query
  let query = supabase
    .from("notes")
    .select("*", { count: 'exact' })
    .eq("user_id", user.id);
  
  // Apply sorting based on the selected option
  let sortColumn: string;
  let sortAscending: boolean;
  
  if (sortOption === "created_desc") {
    sortColumn = 'created_at';
    sortAscending = false;
  } else if (sortOption === "created_asc") {
    sortColumn = 'created_at';
    sortAscending = true;
  } else if (sortOption === "title_asc") {
    sortColumn = 'title';
    sortAscending = true;
  } else {
    sortColumn = 'title';
    sortAscending = false;
  }
  
  // Add pagination - cursor-based for infinite scroll
  const cursorInt = parseInt(cursor);
  
  // Apply sorting and pagination
  query = query.order(sortColumn, { ascending: sortAscending })
               .range(cursorInt, cursorInt + limit - 1);
  
  const { data: notes, error, count } = await query;
  
  if (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Calculate next cursor only if we have full page of results
  const nextCursor = notes.length === limit ? 
    (cursorInt + limit).toString() : null;
  
  return NextResponse.json({
    notes,
    nextCursor,
    count
  });
}

