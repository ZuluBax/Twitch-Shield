import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

// Route group "(app)" holds every dashboard page. In Stage 2, access checks go
// in the data layer (src/lib/data) and proxy rather than only here: Next.js
// layouts don't re-run on client navigation, so a layout check alone is unsafe.
export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
