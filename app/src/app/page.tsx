"use client";

import {
  Construction,
  FileWarning,
  AlertTriangle,
  FileText,
  Plus,
  QrCode,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  dashboardStats,
  hazardReports,
  upcomingExpirations,
} from "@/lib/mock-data";
import Link from "next/link";

const severityColor: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-blue-100 text-blue-700",
};

const statusColor: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  confirmed: "bg-orange-100 text-orange-700",
  resolved: "bg-green-100 text-green-700",
  in_review: "bg-blue-100 text-blue-700",
};

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-sl-text">Dashboard 儀表板</h1>
        <p className="text-sm text-sl-text-secondary mt-1">
          Construction site safety overview 建造工地安全概覽
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Active Equipment 運行中設備"
          value={dashboardStats.activeEquipment}
          icon={<Construction className="h-5 w-5 text-sl-orange" />}
          color="border-l-sl-orange"
        />
        <StatCard
          label="Expiring Certs 即將到期證書"
          value={dashboardStats.expiringCertificates}
          icon={<FileWarning className="h-5 w-5 text-sl-high" />}
          color="border-l-sl-high"
        />
        <StatCard
          label="Open Hazards 未處理危害"
          value={dashboardStats.openHazards}
          icon={<AlertTriangle className="h-5 w-5 text-sl-critical" />}
          color="border-l-sl-critical"
        />
        <StatCard
          label="Reports 本月報告數量"
          value={dashboardStats.reportsThisMonth}
          icon={<FileText className="h-5 w-5 text-sl-low" />}
          color="border-l-sl-low"
        />
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Hazard Reports */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-sl-border">
          <div className="flex items-center justify-between px-6 py-4 border-b border-sl-border">
            <h2 className="text-base font-semibold text-sl-text">
              Recent Hazard Reports 最新危害報告
            </h2>
            <Link
              href="/hazard"
              className="text-sm text-sl-orange hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sl-border text-left text-sl-text-secondary">
                  <th className="px-6 py-3 font-medium">Date 日期</th>
                  <th className="px-6 py-3 font-medium">Equipment 設備</th>
                  <th className="px-6 py-3 font-medium">Hazard Type 類型</th>
                  <th className="px-6 py-3 font-medium">Severity 嚴重性</th>
                  <th className="px-6 py-3 font-medium">Status 狀態</th>
                </tr>
              </thead>
              <tbody>
                {hazardReports.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-sl-border/50 hover:bg-sl-bg/50 transition-colors"
                  >
                    <td className="px-6 py-3 text-sl-text-secondary">
                      {r.reportedAt.split(" ")[0]}
                    </td>
                    <td className="px-6 py-3 font-medium text-sl-text">
                      {r.equipmentName}
                    </td>
                    <td className="px-6 py-3 text-sl-text-secondary">
                      {r.hazardType.replace("_", " ")}
                    </td>
                    <td className="px-6 py-3">
                      <Badge
                        variant="secondary"
                        className={`${severityColor[r.severity]} text-xs font-medium`}
                      >
                        {r.severity.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-3">
                      <Badge
                        variant="secondary"
                        className={`${statusColor[r.status]} text-xs font-medium`}
                      >
                        {r.status.replace("_", " ")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Cards */}
          <div className="md:hidden p-3 space-y-2">
            {hazardReports.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 rounded-lg border border-sl-border/50 hover:bg-sl-bg/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-sl-text truncate">{r.equipmentName}</p>
                  <p className="text-xs text-sl-text-secondary">{r.reportedAt.split(" ")[0]} · {r.hazardType.replace("_", " ")}</p>
                </div>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                  <Badge variant="secondary" className={`${severityColor[r.severity]} text-xs font-medium`}>
                    {r.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary" className={`${statusColor[r.status]} text-xs font-medium`}>
                    {r.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Upcoming Expirations */}
          <div className="bg-white rounded-xl border border-sl-border">
            <div className="px-6 py-4 border-b border-sl-border">
              <h2 className="text-base font-semibold text-sl-text">
                Upcoming Expirations 即將到期
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {upcomingExpirations.map((e, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-sl-bg transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-sl-text">
                      {e.equipment}
                    </p>
                    <p className="text-xs text-sl-text-secondary">
                      Certificate expires in {e.daysLeft} days
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs font-medium ${
                      e.daysLeft <= 7
                        ? "bg-red-100 text-red-700"
                        : e.daysLeft <= 14
                          ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {e.daysLeft} days
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-sl-border">
            <div className="px-6 py-4 border-b border-sl-border">
              <h2 className="text-base font-semibold text-sl-text">
                Quick Actions 快速操作
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <Link
                href="/hazard"
                className="flex items-center gap-3 w-full rounded-lg bg-sl-orange px-4 py-3 text-sm font-medium text-white hover:bg-sl-orange/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                New Hazard Report 新增危害報告
              </Link>
              <Link
                href="/equipment"
                className="flex items-center gap-3 w-full rounded-lg border border-sl-border px-4 py-3 text-sm font-medium text-sl-text hover:bg-sl-bg transition-colors"
              >
                <QrCode className="h-4 w-4" />
                Scan QR Code 掃描二維碼
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-sl-border border-l-4 ${color} p-5`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-sl-text-secondary uppercase tracking-wide">
          {label}
        </span>
        {icon}
      </div>
      <p className="text-3xl font-bold text-sl-text">{value}</p>
    </div>
  );
}
