"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOutAction } from "@/app/actions";
import { Menu, Home, FileText, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  user: { email: string };
}

export function SidebarNav({
  className,
  isCollapsed,
  setIsCollapsed,
  user,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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

  const navItems = [
    {
      title: "Home",
      href: "/protected",
      icon: Home,
      shortcut: "⌘H",
    },
    {
      title: "Notes",
      href: "/protected/notes",
      icon: FileText,
      shortcut: "⌘N",
    },
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Navigation</span>
              <ThemeSwitcher />
            </div>
            <nav className="grid gap-2 px-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md hover:bg-accent",
                    pathname === item.href && "bg-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {item.shortcut}
                  </span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-4 border-t">
              <div className="flex items-center justify-between px-2">
                <form action={signOutAction}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </form>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <nav
        className={cn(
          "hidden lg:flex flex-col border-r bg-background h-screen fixed left-0 top-0 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
        {...props}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <span className={cn(
              "font-semibold transition-opacity duration-300",
              isCollapsed ? "opacity-0 hidden" : "opacity-100"
            )}>
              Navigation
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors",
                  pathname === item.href && "bg-accent"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="transition-opacity duration-300">
                      {item.title}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground transition-opacity duration-300">
                      {item.shortcut}
                    </span>
                  </>
                )}
              </Link>
            ))}
          </ScrollArea>

          <div className="mt-auto border-t">
            <div className={cn(
              "p-4",
              isCollapsed ? "text-center" : "text-left"
            )}>
              <p className={cn(
                "text-sm text-muted-foreground mb-2 truncate transition-opacity duration-300",
                isCollapsed && "hidden"
              )}>
                {user.email}
              </p>
              <div className={cn(
                "flex items-center",
                isCollapsed ? "justify-center" : "justify-between"
              )}>
                {!isCollapsed && (
                  <form action={signOutAction}>
                    <Button
                      type="submit"
                      variant="ghost"
                      className="justify-start gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                  </form>
                )}
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
} 