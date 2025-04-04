import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";

// Separate data fetching component
async function ClassesList({ userId }: { userId: string }) {
  const supabase = await createClient();
  
  const { data: classes, error } = await supabase
    .from("classes")
    .select("*")
    .eq("user_id", userId)
    .order('name', { ascending: true });
  
  if (error) {
    console.error("Error fetching classes:", error);
    return null;
  }

  if (!classes || classes.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p>You don't have any classes yet.</p>
        <Link href="/protected/classes/new">
          <Button className="mt-4">Create your first class</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {classes.map((classItem) => (
        <div 
          key={classItem.id} 
          className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold">{classItem.name}</h2>
          </div>
          <p className="text-muted-foreground mt-2">
            {classItem.description || "No description"}
          </p>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <span>
              Created: {new Date(classItem.created_at).toLocaleDateString()}
            </span>
            {classItem.updated_at && (
              <span>
                Updated: {new Date(classItem.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ClassesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
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
          <h1 className="text-2xl font-bold">Classes</h1>
          <div className="flex items-center gap-2">
            <Link href="/protected/classes/new">
              <Button>
                <Plus className="mr-2" size={16} />
                New Class
              </Button>
            </Link>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner size={40} />
          </div>
        }>
          <ClassesList userId={user.id} />
        </Suspense>
      </div>
    </div>
  );
} 