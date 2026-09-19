"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LogOut, Settings } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Avatar } from "@/components/ui/avatar";
import { logout } from "@/lib/firebase/auth";

export function UserMenu() {
  const t = useTranslations("topbar");
  const { user, profile } = useUserProfile();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("userMenuAria")}
        className="transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Avatar
          emoji={profile?.avatarEmoji}
          photoURL={profile?.photoURL ?? user?.photoURL}
          name={profile?.name ?? user?.displayName ?? user?.email}
          className="size-9 text-lg"
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute end-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-border bg-surface"
        >
          <div className="border-b border-border px-4 py-3">
            <div className="truncate text-sm font-semibold">{user?.displayName ?? user?.email}</div>
            <div className="truncate text-xs text-muted" dir="ltr">
              {user?.email}
            </div>
          </div>

          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-surface-muted"
          >
            <Settings className="size-4" />
            {t("settings")}
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={() => logout()}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm text-foreground/80 transition-colors hover:bg-surface-muted"
          >
            <LogOut className="size-4" />
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
