"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownAZ, ArrowUpDown, Calendar } from "lucide-react";
import { useCallback } from "react";

export type SortOption = "created_desc" | "created_asc" | "title_asc" | "title_desc";

interface SortDropdownProps {
  currentSort: SortOption;
}

export function SortDropdown({ currentSort }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleSort = (sort: SortOption) => {
    router.push(`?${createQueryString('sort', sort)}`);
  };

  const getActiveLabel = () => {
    switch (currentSort) {
      case "created_desc":
        return "Newest first";
      case "created_asc":
        return "Oldest first";
      case "title_asc":
        return "Title (A-Z)";
      case "title_desc":
        return "Title (Z-A)";
      default:
        return "Sort by";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          {getActiveLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSort("created_desc")}>
          <Calendar className="mr-2 h-4 w-4" />
          Newest first
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort("created_asc")}>
          <Calendar className="mr-2 h-4 w-4" />
          Oldest first
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort("title_asc")}>
          <ArrowDownAZ className="mr-2 h-4 w-4" />
          Title (A-Z)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort("title_desc")}>
          <ArrowDownAZ className="mr-2 h-4 w-4 rotate-180" />
          Title (Z-A)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
