import { StatLine } from "@/components/ui/page";
"use client";

import { useState } from "react";
import { User } from "lucide-react";

interface UserAvatarProps {
  avatarUrl?: string | null;
  fullName?: string | null;
  className?: string;
}

const gradientColors = [
  "from-pink-500 to-rose-500",
  "from-purple-500 to-indigo-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
];

const getGradientClass = (name: string) => {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return gradientColors[sum % gradientColors.length];
};

const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export function UserAvatar({ avatarUrl, fullName, className = "size-7" }: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const name = fullName || "User";
  const initials = getInitials(name);
  const gradientClass = getGradientClass(name);

  if (avatarUrl && !hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`${className} rounded-full object-cover border border-zinc-200 dark:border-zinc-800 shadow-sm`}
      />
    );
  }

  // Fallback to initials with beautiful gradient background
  if (initials) {
    return (
      <div
        className={`${className} rounded-full bg-gradient-to-br ${gradientClass} text-white flex items-center justify-center text-[10px] font-bold tracking-wider shadow-sm select-none border border-white/10`}
      >
        {initials}
      </div>
    );
  }

  // Final fallback to user icon
  return (
    <div
      className={`${className} rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-sm`}
    >
      <User className="size-3.5" />
    </div>
  );
}
