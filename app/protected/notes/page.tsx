import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { InfiniteNotes } from "@/components/infinite-notes";

export default async function NotesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <InfiniteNotes userId={user.id} />;
}


