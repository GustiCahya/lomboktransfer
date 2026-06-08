"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserInfo = {
  email: string;
  displayName: string;
  initials: string;
};

export default function UserMenu() {
  const router = useRouter();
  const supabase = createClient();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const email = user.email ?? "";
      // Try display_name from metadata, then email prefix, then fallback
      const rawName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        email.split("@")[0] ||
        "Admin";

      // Build initials (up to 2 chars)
      const parts = rawName.trim().split(/\s+/);
      const initials =
        parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : rawName.substring(0, 2).toUpperCase();

      setUserInfo({ email, displayName: rawName, initials });
    };

    loadUser();

    // Listen for auth changes (e.g. after login)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleGoToProfile = () => {
    router.push("/settings/profile");
  };

  const handleGoToSettings = () => {
    router.push("/settings");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary cursor-pointer transition-colors select-none font-semibold text-sm">
          {userInfo ? userInfo.initials : <User className="w-4 h-4" />}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        {/* User info label */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-sm">
                {userInfo ? userInfo.initials : <User className="w-4 h-4" />}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold leading-none truncate">
                  {userInfo?.displayName ?? "Memuat..."}
                </p>
                <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                  {userInfo?.email ?? ""}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Navigation items */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer gap-2" onClick={handleGoToProfile}>
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2" onClick={handleGoToSettings}>
            <Settings className="h-4 w-4" />
            <span>Pengaturan</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={handleSignOut}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
