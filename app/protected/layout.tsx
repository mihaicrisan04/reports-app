"use client";

import { SidebarNav } from "@/components/sidebar-nav";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || '');
    };
    getUser();
  }, []);

  return (
    <div className="flex min-h-screen relative">
      <SidebarNav 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        user={{ email: userEmail }}
      />
      <main className="flex-1 pl-16">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <div className="flex flex-col gap-20 max-w-5xl p-5 w-full">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <LoadingSpinner size={40} />
              </div>
            }>
              {children}
            </Suspense>
          </div>
          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>Made with ❤️ </p>
          </footer>
        </div>
      </main>
    </div>
  );
} 