"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { NAV_ITEMS, isActivePath } from "@/lib/navigation";
import { Icon } from "@/components/ui/Icon";

function Brand() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 rounded-md text-lg font-semibold"
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-strong text-accent-ink">
        <Icon name="shield" className="h-5 w-5" />
      </span>
      Twitch Shield
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-accent-strong/20 text-text"
                  : "text-muted hover:bg-surface-2 hover:text-text"
              }`}
            >
              <Icon
                name={item.icon}
                className={`h-5 w-5 ${active ? "text-accent" : ""}`}
              />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="min-h-screen lg:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent-strong focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:block">
        <div className="sticky top-0 flex h-screen flex-col gap-8 p-5">
          <Brand />
          <nav aria-label="Main">
            <NavLinks />
          </nav>
          <p className="mt-auto text-xs text-muted">
            Stage 1 preview · not yet connected to Twitch
          </p>
        </div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-text"
        >
          <Icon name={menuOpen ? "close" : "menu"} />
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-b border-border bg-surface px-4 py-3 lg:hidden"
        >
          <NavLinks onNavigate={() => setMenuOpen(false)} />
        </nav>
      )}

      <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
