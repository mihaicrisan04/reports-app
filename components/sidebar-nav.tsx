"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOutAction } from "@/app/actions";
import { 
  Menu, 
  Home, 
  FileText, 
  LogOut, 
  Users, 
  BookOpen, 
  ClipboardList, 
  Settings, 
  UserCircle,
  School,
  Activity,
  User,
  LogOut as LogOutIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ThemeSwitcher } from "./theme-switcher";
import { LoadingOverlay } from "./loading-overlay";
import { Avatar } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface User {
  email: string;
  name?: string;
  image?: string;
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  user: User;
}

export function SidebarNav({
  className,
  isCollapsed,
  setIsCollapsed,
  user,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault();
            setIsCollapsed(!isCollapsed);
            break;
          case "h":
            e.preventDefault();
            window.location.href = "/protected";
            break;
          case "n":
            e.preventDefault();
            window.location.href = "/protected/notes";
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCollapsed]);

  // Handle hover effect
  useEffect(() => {
    const handleMouseEnter = () => {
      if (isCollapsed && !isThemeDropdownOpen && !isProfileDropdownOpen) {
        setIsHovered(true);
        setIsCollapsed(false);
      }
    };

    const handleMouseLeave = () => {
      if (!isCollapsed && !isThemeDropdownOpen && !isProfileDropdownOpen) {
        // Add a small delay before collapsing to make the transition smoother
        timeoutRef.current = setTimeout(() => {
          setIsHovered(false);
          setIsCollapsed(true);
        }, 150);
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('mouseenter', handleMouseEnter);
      sidebar.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('mouseenter', handleMouseEnter);
        sidebar.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isCollapsed, isThemeDropdownOpen, isProfileDropdownOpen]);

  // Handle clicks outside the sidebar and theme dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = sidebarRef.current;
      const themeDropdown = document.querySelector('[data-radix-popper-content-id]');
      const profileDropdown = document.querySelector('[data-radix-popper-content-id]');
      
      // If click is outside the sidebar
      if (sidebar && !sidebar.contains(event.target as Node)) {
        // If theme dropdown is open and click is outside both sidebar and dropdown
        if (isThemeDropdownOpen && themeDropdown && !themeDropdown.contains(event.target as Node)) {
          // Close both the dropdown and collapse the sidebar
          setIsThemeDropdownOpen(false);
          setIsCollapsed(true);
        } 
        // If profile dropdown is open and click is outside both sidebar and dropdown
        else if (isProfileDropdownOpen && profileDropdown && !profileDropdown.contains(event.target as Node)) {
          // Close the dropdown and collapse the sidebar
          setIsProfileDropdownOpen(false);
          setIsCollapsed(true);
        }
        // If theme dropdown is not open, just collapse the sidebar
        else if (!isThemeDropdownOpen && !isProfileDropdownOpen) {
          setIsCollapsed(true);
        }
      }
      // If click is inside the sidebar but outside the theme dropdown
      else if (sidebar && sidebar.contains(event.target as Node) && 
               isThemeDropdownOpen && themeDropdown && !themeDropdown.contains(event.target as Node)) {
        // Only close the theme dropdown, don't affect sidebar state
        setIsThemeDropdownOpen(false);
      }
      // If click is inside the sidebar but outside the profile dropdown
      else if (sidebar && sidebar.contains(event.target as Node) && 
               isProfileDropdownOpen && profileDropdown && !profileDropdown.contains(event.target as Node)) {
        // Only close the profile dropdown, don't affect sidebar state
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemeDropdownOpen, isProfileDropdownOpen]);

  // Add a separate effect to handle theme dropdown state changes
  useEffect(() => {
    // If theme dropdown closes, allow sidebar to collapse on mouse leave
    if (!isThemeDropdownOpen && !isProfileDropdownOpen && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [isThemeDropdownOpen, isProfileDropdownOpen]);

  // Handle profile dropdown state changes
  useEffect(() => {
    // If profile dropdown opens, prevent sidebar from collapsing
    if (isProfileDropdownOpen) {
      setIsCollapsed(false);
    }
  }, [isProfileDropdownOpen, setIsCollapsed]);

  const handleNavigation = (href: string) => {
    setIsLoading(true);
    router.push(href);
  };

  const handleSignOut = async () => {
    try {
      await signOutAction();
      toast.success("Signed out successfully");
      setIsProfileDropdownOpen(false);
      setIsCollapsed(true);
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(false);
    setIsCollapsed(true);
    router.push("/protected/profile");
  };

  const handleAccountClick = () => {
    setIsProfileDropdownOpen(false);
    setIsCollapsed(true);
    router.push("/protected/account");
  };

  // Prevent unnecessary re-renders when clicking inside the sidebar
  const handleSidebarClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent the global click handler from firing
    e.stopPropagation();
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/protected",
      icon: Home,
    },
    {
      title: "Classes",
      href: "/protected/classes",
      icon: School,
    },
    {
      title: "Children",
      href: "/protected/children",
      icon: UserCircle,
    },
    {
      title: "Behaviours",
      href: "/protected/behaviours",
      icon: Activity,
    },
    {
      title: "Reports",
      href: "/protected/reports",
      icon: ClipboardList,
    },
    {
      title: "Notes",
      href: "/protected/notes",
      icon: FileText,
    },
  ];

  return (
    <>
      <LoadingOverlay />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  R
                </div>
                <span className="font-semibold">Reports App</span>
              </div>
              <ThemeSwitcher onOpenChange={setIsThemeDropdownOpen} />
            </div>
            <nav className="grid gap-2 px-2 mt-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsOpen(false);
                    handleNavigation(item.href);
                  }}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md hover:bg-accent w-full text-left",
                    pathname === item.href && "bg-accent"
                  )}
                >
                  <div className="flex items-center justify-center w-5 h-5">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span>{item.title}</span>
                </button>
              ))}
            </nav>
            <div className="mt-auto border-t pt-4 pb-4">
              <div className="flex flex-col gap-2 px-4">
                <DropdownMenu open={isProfileDropdownOpen} onOpenChange={setIsProfileDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className={cn(
                        "flex items-center gap-2 rounded-md transition-colors hover:bg-accent w-full",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <Avatar
                        src={user?.image || undefined}
                        alt={user?.name || user?.email || "User"}
                        fallback={user?.name?.[0] || user?.email?.[0] || "U"}
                        className={cn(
                          "h-8 w-8",
                          isCollapsed && "mx-auto"
                        )}
                      />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user?.name || user?.email}
                          </p>
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 ml-2">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      {user?.name || user?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/protected/profile" className="flex items-center" onClick={handleProfileClick}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/protected/account" className="flex items-center" onClick={handleAccountClick}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Account Preferences</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5">
                      <div className="flex items-center">
                        <div className="flex items-center w-2/3">
                          <button 
                            onClick={handleSignOut}
                            className="flex items-center text-destructive hover:text-destructive/90 transition-colors rounded-md px-2 py-1.5 hover:bg-accent w-full text-left"
                          >
                            <LogOutIcon className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                          </button>
                        </div>
                        <div className="h-6 w-px bg-border mx-2"></div>
                        <div className="w-1/3 flex justify-center">
                          <ThemeSwitcher onOpenChange={setIsThemeDropdownOpen} size="sm" />
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <nav
        ref={sidebarRef}
        className={cn(
          "hidden lg:flex flex-col border-r bg-background h-screen fixed left-0 top-0 transition-all duration-150 z-50",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
        onClick={handleSidebarClick}
        {...props}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-center border-b">
            <div className="flex items-center justify-center">
              {isCollapsed ? (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  R
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    R
                  </div>
                  <span className="font-semibold">Reports App</span>
                </div>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 mt-4">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors group w-full text-left",
                  pathname === item.href && "bg-accent"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-5 h-5 transition-transform duration-150",
                  !isCollapsed && "translate-x-0",
                  isCollapsed && "translate-x-0"
                )}>
                  <item.icon className="h-4 w-4" />
                </div>
                {!isCollapsed && (
                  <span className="transition-all duration-150 opacity-100">
                    {item.title}
                  </span>
                )}
                {isCollapsed && (
                  <div className="absolute left-16 bg-popover text-popover-foreground p-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                    {item.title}
                  </div>
                )}
              </button>
            ))}
          </ScrollArea>

          <div className="mt-auto border-t pt-4 pb-4">
            <div className="flex flex-col gap-2 px-4">
              <DropdownMenu open={isProfileDropdownOpen} onOpenChange={setIsProfileDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button 
                    className={cn(
                      "flex items-center gap-2 rounded-md transition-colors hover:bg-accent w-full",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Avatar
                      src={user?.image || undefined}
                      alt={user?.name || user?.email || "User"}
                      fallback={user?.name?.[0] || user?.email?.[0] || "U"}
                      className={cn(
                        "h-8 w-8",
                        isCollapsed && "mx-auto"
                      )}
                    />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user?.name || user?.email}
                        </p>
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 ml-2">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/protected/profile" className="flex items-center" onClick={handleProfileClick}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/protected/account" className="flex items-center" onClick={handleAccountClick}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Account Preferences</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <div className="flex items-center">
                      <div className="flex items-center w-2/3">
                        <button 
                          onClick={handleSignOut}
                          className="flex items-center text-destructive hover:text-destructive/90 transition-colors rounded-md px-2 py-1.5 hover:bg-accent w-full text-left"
                        >
                          <LogOutIcon className="mr-2 h-4 w-4" />
                          <span>Sign out</span>
                        </button>
                      </div>
                      <div className="h-6 w-px bg-border mx-2"></div>
                      <div className="w-1/3 flex justify-center">
                        <ThemeSwitcher onOpenChange={setIsThemeDropdownOpen} size="sm" />
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
} 