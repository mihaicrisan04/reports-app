import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";

// Separate data fetching component
async function ReportsList({ userId }: { userId: string }) {
  const supabase = await createClient();
  
  const { data: reports, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching reports:", error);
    return null;
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p>You don't have any reports yet.</p>
        <Link href="/protected/reports/new">
          <Button className="mt-4">Create your first report</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {reports.map((report) => (
        <div 
          key={report.id} 
          className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold">{report.title}</h2>
          </div>
          <p className="text-muted-foreground mt-2 line-clamp-2">
            {report.description || "No description"}
          </p>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <span>
              Created: {new Date(report.created_at).toLocaleDateString()}
            </span>
            {report.updated_at && (
              <span>
                Updated: {new Date(report.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ReportsPage() {
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
          <h1 className="text-2xl font-bold">Reports</h1>
          <div className="flex items-center gap-2">
            <Link href="/protected/reports/new">
              <Button>
                <Plus className="mr-2" size={16} />
                New Report
              </Button>
            </Link>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner size={40} />
          </div>
        }>
          <ReportsList userId={user.id} />
        </Suspense>
      </div>
    </div>
  );
} 