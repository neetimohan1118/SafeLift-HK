"use client";

import { usePathname } from "next/navigation";
import { HardHat, Bell } from "lucide-react";
import Link from "next/link";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 bg-sl-sidebar-bg mobile-header">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sl-orange">
              <HardHat className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">SafeLift HK</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/alerts" className="relative">
              <Bell className="h-5 w-5 text-sl-sidebar-text" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sl-critical text-[9px] font-bold text-white">
                3
              </span>
            </Link>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sl-orange text-[10px] font-bold text-white">
              陳
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-sl-bg pb-16 md:pb-0">{children}</main>
      </div>
    </div>
  );
}
