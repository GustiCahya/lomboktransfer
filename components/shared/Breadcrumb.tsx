"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <div className="hidden sm:flex items-center text-sm text-muted-foreground">
        <Home className="w-4 h-4 mr-2" />
        <span className="font-medium text-foreground">Dashboard</span>
      </div>
    );
  }

  const paths = pathname.split("/").filter(Boolean);

  return (
    <div className="hidden sm:flex items-center text-sm text-muted-foreground space-x-1">
      <Link href="/admin" className="hover:text-foreground flex items-center transition-colors">
        <Home className="w-4 h-4" />
      </Link>

      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-4 h-4 mx-1 opacity-50" />
            {isLast ? (
              <span className="font-medium text-foreground">{title}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {title}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
