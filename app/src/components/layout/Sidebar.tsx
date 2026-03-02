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
import { useAlerts } from "@/lib/alert-context";

const navItems = [
  { href: "/", label: "Dashboard 儀表板", shortLabel: "儀表板", icon: LayoutDashboard, badgeKey: null },
  { href: "/hazard", label: "Hazard Detection 危害檢測", shortLabel: "危害檢測", icon: ScanEye, badgeKey: null },
  { href: "/equipment", label: "Equipment 設備管理", shortLabel: "設備", icon: Container, badgeKey: null },
  { href: "/documents", label: "Documents 文件管理", shortLabel: "文件", icon: Folder, badgeKey: null },
  { href: "/alerts", label: "Alerts 通知中心", shortLabel: "通知", icon: Bell, badgeKey: "alerts" as const },
  { href: "/settings", label: "Settings 設定", shortLabel: "設定", icon: Settings, badgeKey: null },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { unreadCount } = useAlerts();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-64 flex-col bg-sl-sidebar-bg text-sl-sidebar-text flex-shrink-0">
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
            Navigation 導覽
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              const badge = item.badgeKey === "alerts" ? unreadCount : 0;
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
                    <span className="flex-1">{item.label}</span>
                    {badge > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sl-critical px-1.5 text-[10px] font-bold text-white">
                        {badge}
                      </span>
                    )}
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
              <p className="text-xs text-sl-sidebar-text truncate">Site Manager 工地經理</p>
            </div>
            <Link href="/settings" className="text-sl-sidebar-text hover:text-white" aria-label="Settings 設定">
              <MoreVertical className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-sl-sidebar-bg border-t border-white/10 safe-bottom">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const badge = item.badgeKey === "alerts" ? unreadCount : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors ${
                isActive
                  ? "text-sl-orange"
                  : "text-sl-sidebar-text"
              }`}
            >
              <div className="relative">
                <item.icon className={`h-5 w-5 ${isActive ? "text-sl-orange" : ""}`} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-sl-critical px-1 text-[8px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </div>
              <span>{item.shortLabel}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
