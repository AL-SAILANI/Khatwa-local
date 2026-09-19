import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { avatarIdFromStored, AVATARS_BY_ID } from "@/data/avatars";

interface AvatarProps {
  /** Avatar identifier (id of a chosen avatar image). */
  emoji?: string | null;
  /** Real photo URL (e.g. Google sign-in) — used when no avatar is set. */
  photoURL?: string | null;
  /** Display name used to derive an initials fallback. */
  name?: string | null;
  /** Tailwind size class for the element. */
  className?: string;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export function Avatar({ emoji, photoURL, name, className }: AvatarProps) {
  const avatarId = avatarIdFromStored(emoji);
  const option = avatarId ? AVATARS_BY_ID[avatarId] ?? null : null;

  if (option) {
    return (
      <Image
        src={option.src}
        alt={option.name}
        width={128}
        height={128}
        className={cn("shrink-0 rounded-full object-cover ring-2 ring-surface", className)}
      />
    );
  }

  if (emoji) {
    return (
      <span
        role="img"
        aria-label={name ?? undefined}
        className={cn(
          "grid shrink-0 place-items-center rounded-full bg-butter-yellow ring-2 ring-surface",
          className,
        )}
      >
        <span className="select-none leading-none">{emoji}</span>
      </span>
    );
  }

  if (photoURL) {
    return (
      <Image
        src={photoURL}
        alt={name ?? ""}
        width={128}
        height={128}
        className={cn("shrink-0 rounded-full object-cover ring-2 ring-surface", className)}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={name ?? undefined}
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-butter-yellow font-bold text-ink-violet ring-2 ring-surface",
        className,
      )}
    >
      {initialsOf(name ?? "") || "?"}
    </span>
  );
}