import React from "react";
import Link from "next/link";
import { Home, Calendar, User } from "lucide-react";

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-[100dvh] bg-muted/20 overflow-hidden sm:max-w-md sm:mx-auto sm:border-x sm:shadow-xl">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 scrollbar-hide">
        {children}
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="fixed sm:absolute bottom-0 w-full sm:w-[calc(100%-2px)] max-w-md bg-background border-t pb-safe">
        <div className="flex items-center justify-around h-16">
          <Link href="/trips" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary transition-colors">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Hari Ini</span>
          </Link>
          <Link href="/trips/schedule" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary transition-colors">
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Jadwal</span>
          </Link>
          <Link href="/trips/profile" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary transition-colors">
            <User className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Profil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
