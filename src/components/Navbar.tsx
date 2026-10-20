"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpenCheck, Bookmark, Compass, Menu, Search, X, Briefcase } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/search", label: "Search", icon: Search },
  { href: "/topics", label: "Topics", icon: Compass },
  { href: "/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/library", label: "Library", icon: Bookmark },
  { href: "/status", label: "Status", icon: null },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (href: string) => `inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${pathname === href || (href !== "/" && pathname.startsWith(href)) ? "text-indigo-700 dark:text-indigo-300 font-semibold" : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2.5 text-slate-950 dark:text-white" onClick={() => setMenuOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-white"><BookOpenCheck className="h-5 w-5" /></span>
          <span className="text-sm font-semibold tracking-tight">Research Hub</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={linkClass(href)}>{Icon && <Icon className="h-4 w-4" />}{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-slate-200 px-4 py-2 dark:border-slate-800 md:hidden">{navLinks.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`${linkClass(href)} flex w-full`} onClick={() => setMenuOpen(false)}>{Icon && <Icon className="h-4 w-4" />}{label}</Link>)}</nav>}
    </header>
  );
}
