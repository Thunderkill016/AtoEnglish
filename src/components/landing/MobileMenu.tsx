"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

// Shared state via module-level event (simple, no context needed)
const listeners: ((open: boolean) => void)[] = [];
let _isOpen = false;

function setOpen(val: boolean) {
  _isOpen = val;
  listeners.forEach((fn) => fn(val));
}

function useMenuOpen() {
  const [open, setOpenState] = useState(_isOpen);
  // register listener
  if (!listeners.includes(setOpenState)) {
    listeners.push(setOpenState);
  }
  return open;
}

export function MobileMenuButton() {
  const open = useMenuOpen();
  return (
    <button
      onClick={() => setOpen(!open)}
      aria-label={open ? "Đóng menu" : "Mở menu"}
      className="md:hidden flex items-center justify-center size-9 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 transition-colors duration-200"
    >
      {open ? <X className="size-5" /> : <Menu className="size-5" />}
    </button>
  );
}

export function MobileMenu() {
  const open = useMenuOpen();

  const links = [
    { href: "#how-it-works", label: "Cách học" },
    { href: "#science", label: "Phương pháp" },
    { href: "#faq", label: "Hỏi đáp" },
  ];

  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-zinc-200/40 dark:border-zinc-800/40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md ${
        open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="px-5 py-4 flex flex-col gap-1">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="flex items-center h-11 px-3 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all duration-200"
          >
            {link.label}
          </a>
        ))}
        <div className="border-t border-zinc-200/40 dark:border-zinc-800/40 my-1" />
        <Link
          href="/login?mode=login"
          onClick={() => setOpen(false)}
          className="flex items-center h-11 px-3 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all duration-200"
        >
          Đăng nhập
        </Link>
        <Link
          href="/login"
          onClick={() => setOpen(false)}
          className="flex items-center justify-center h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-colors duration-200"
        >
          Bắt đầu học ngay →
        </Link>
      </div>
    </div>
  );
}
