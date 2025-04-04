import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

export default async function ChildrenPage() {
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
          <h1 className="text-2xl font-bold">Children</h1>
          <div className="flex items-center gap-2">
            <Link href="/protected/children/new">
              <Button>
                <Plus className="mr-2" size={16} />
                Add Child
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <p>You don't have any children records yet.</p>
          <Link href="/protected/children/new">
            <Button className="mt-4">Add your first child</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 