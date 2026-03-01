"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScanEye,
  Container,
  Folder,
  Bell,
  Settings,
  HardHat,
  MoreVertical,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard 儀表板", icon: LayoutDashboard },
  { href: "/hazard", label: "Hazard Detection 危害檢測", icon: ScanEye },
  { href: "/equipment", label: "Equipment 設備管理", icon: Container },
  { href: "/documents", label: "Documents 文件管理", icon: Folder },
  { href: "/alerts", label: "Alerts 通知中心", icon: Bell },
  { href: "/settings", label: "Settings 設定", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col bg-sl-sidebar-bg text-sl-sidebar-text flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sl-orange">
          <HardHat className="h-5 w-5 text-white" />
        </div>
        <span className="text-[15px] font-bold text-white">SafeLift HK</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sl-sidebar-text">
          Navigation
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] transition-colors ${
                    isActive
                      ? "bg-sl-orange/15 text-sl-orange font-medium"
                      : "text-sl-sidebar-text hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${isActive ? "text-sl-orange" : ""}`}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sl-orange text-xs font-bold text-white">
            陳
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">陳大文</p>
            <p className="text-xs text-sl-sidebar-text truncate">Site Manager</p>
          </div>
          <button className="text-sl-sidebar-text hover:text-white">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
