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
  const [userName, setUserName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || '');
      
      if (user) {
        // Get the user's name from the public.users table
        const { data: userData, error } = await supabase
          .from('users')
          .select('name')
          .eq('auth_user_id', user.id)
          .single();
          
        if (userData && !error) {
          setUserName(userData.name || '');
        }
      }
    };
    getUser();
  }, []);

  return (
    <div className="flex min-h-screen relative">
      <SidebarNav 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        user={{ email: userEmail, name: userName }}
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
        </div>
      </main>
    </div>
  );
} 