"use client";

import { useState } from "react";
import {
  Bell,
  ShieldAlert,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  FileWarning,
  Clock,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAlerts } from "@/lib/alert-context";

const tabs = [
  { id: "all", label: "All 全部", icon: Bell },
  { id: "unread", label: "Unread 未讀", icon: Eye },
  { id: "cert-expiry", label: "Cert Expiry 證書到期", icon: FileWarning },
  { id: "critical-hazard", label: "Hazards 危害", icon: AlertTriangle },
  { id: "maintenance-due", label: "Maintenance 維修", icon: Wrench },
];

const priorityConfig: Record<string, {
  label: string;
  className: string;
  borderColor: string;
  icon: typeof ShieldAlert;
  iconColor: string;
}> = {
  critical: {
    label: "Critical 嚴重",
    className: "bg-red-100 text-red-700",
    borderColor: "border-l-red-500",
    icon: ShieldAlert,
    iconColor: "text-red-600",
  },
  high: {
    label: "High 高危",
    className: "bg-orange-100 text-orange-700",
    borderColor: "border-l-orange-500",
    icon: AlertTriangle,
    iconColor: "text-orange-600",
  },
  normal: {
    label: "Normal 一般",
    className: "bg-blue-100 text-blue-700",
    borderColor: "border-l-blue-400",
    icon: Bell,
    iconColor: "text-blue-500",
  },
  resolved: {
    label: "Resolved 已處理",
    className: "bg-green-100 text-green-700",
    borderColor: "border-l-green-500",
    icon: CheckCircle2,
    iconColor: "text-green-600",
  },
};

export default function AlertCenterPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { alerts, unreadCount, markAllRead } = useAlerts();

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !a.isRead;
    return a.type === activeTab;
  });

  // Group by date
  const grouped = filteredAlerts.reduce(
    (acc, alert) => {
      const date = alert.createdAt.split(" ")[0];
      const label = isToday(date) ? "Today 今天" : isYesterday(date) ? "Yesterday 昨天" : date;
      if (!acc[label]) acc[label] = [];
      acc[label].push(alert);
      return acc;
    },
    {} as Record<string, typeof alerts>,
  );

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-sl-text">
            Alert Center 通知中心
          </h1>
          <p className="text-sm text-sl-text-secondary mt-1">
            Safety alerts and notifications 安全警報及通知
          </p>
        </div>
        <button
          onClick={markAllRead}
          className={`text-sm hover:underline self-start sm:self-auto whitespace-nowrap ${
            unreadCount > 0 ? "text-sl-orange" : "text-sl-text-secondary cursor-default"
          }`}
          disabled={unreadCount === 0}
        >
          {unreadCount > 0 ? "Mark all read 全部標為已讀" : "All read 全部已讀 ✓"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-sl-border pb-0 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const count = tab.id === "unread"
            ? unreadCount
            : tab.id === "all"
              ? alerts.length
              : alerts.filter((a) => a.type === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-2.5 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? "border-sl-orange text-sl-orange"
                  : "border-transparent text-sl-text-secondary hover:text-sl-text"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                isActive ? "bg-sl-orange/10 text-sl-orange" : "bg-sl-bg text-sl-text-secondary"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Alert List */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([dateLabel, dateAlerts]) => (
          <div key={dateLabel}>
            <h3 className="text-sm font-semibold text-sl-text-secondary mb-3">
              {dateLabel}
            </h3>
            <div className="space-y-3">
              {dateAlerts.map((alert) => {
                const config = priorityConfig[alert.priority];
                const Icon = config.icon;
                return (
                  <div
                    key={alert.id}
                    className={`rounded-xl border border-sl-border border-l-4 ${config.borderColor} p-5 hover:shadow-sm transition-shadow ${
                      !alert.isRead ? "bg-white" : "bg-sl-bg/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.className}`}>
                        <Icon className={`h-5 w-5 ${config.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-sl-text">
                              {alert.title_zh}
                            </h4>
                            <p className="text-sm text-sl-text-secondary mt-1 leading-relaxed">
                              {alert.message_zh}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-sl-text-secondary">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {alert.createdAt}
                              </span>
                              <span>Equipment: {alert.equipmentId}</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className={`${config.className} text-xs font-medium shrink-0`}>
                            {config.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return dateStr === today;
}

function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split("T")[0];
}
