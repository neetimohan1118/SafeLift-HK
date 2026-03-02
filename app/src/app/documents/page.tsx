"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Upload,
  Search,
  SearchX,
  FileText,
  ShieldCheck,
  ClipboardCheck,
  Wrench,
  GraduationCap,
  TestTube,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Link2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { documents } from "@/lib/mock-data";

const typeConfig: Record<string, { label: string; icon: typeof FileText; color: string; bgColor: string }> = {
  certificate: { label: "Certificate 證書", icon: ShieldCheck, color: "text-green-700", bgColor: "bg-green-100" },
  "inspection-report": { label: "Inspection Report 檢驗報告", icon: ClipboardCheck, color: "text-blue-700", bgColor: "bg-blue-100" },
  "maintenance-record": { label: "Maintenance 維修紀錄", icon: Wrench, color: "text-orange-700", bgColor: "bg-orange-100" },
  "safety-training": { label: "Safety Training 安全培訓", icon: GraduationCap, color: "text-purple-700", bgColor: "bg-purple-100" },
  "load-test": { label: "Load Test 負重測試", icon: TestTube, color: "text-teal-700", bgColor: "bg-teal-100" },
  pdf: { label: "PDF Document PDF文件", icon: FileText, color: "text-red-700", bgColor: "bg-red-100" },
  image: { label: "Photo 相片", icon: FileText, color: "text-gray-700", bgColor: "bg-gray-100" },
};

const statusBadge: Record<string, { label: string; className: string }> = {
  valid: { label: "Valid 有效", className: "bg-green-100 text-green-700" },
  expiring: { label: "Expiring 即將到期", className: "bg-orange-100 text-orange-700" },
  expired: { label: "Expired 已過期", className: "bg-red-100 text-red-700" },
};

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [equipmentFilter, setEquipmentFilter] = useState("all");
  const [toast, setToast] = useState("");

  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(""), 2500);
  }, []);
  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  // Extract unique equipment names for filter
  const uniqueEquipment = [...new Set(documents.map((d) => d.equipmentName))];

  const filtered = documents.filter((d) => {
    const matchSearch =
      d.fileName.toLowerCase().includes(search.toLowerCase()) ||
      d.equipmentName.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || d.fileType === typeFilter;
    const matchEquipment = equipmentFilter === "all" || d.equipmentName === equipmentFilter;
    return matchSearch && matchType && matchEquipment;
  });

  return (
    <>
      {/* Toast — rendered outside animated container to fix fixed positioning */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
          <div className="rounded-lg bg-sl-sidebar-bg text-white px-4 py-2.5 text-sm shadow-lg">
            {toast}
          </div>
        </div>
      )}
      <div className="p-4 md:p-8 space-y-6 animate-fade-in-up relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-sl-text">
            Documents 文件管理
          </h1>
          <p className="text-sm text-sl-text-secondary mt-1">
            Manage certificates, inspection reports, and safety records 管理證書、檢驗報告及安全紀錄
          </p>
        </div>
        <button
          onClick={() => showToast("Upload coming soon 上傳功能即將推出")}
          className="flex items-center gap-2 rounded-lg bg-sl-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-sl-orange/90 transition-colors self-start sm:self-auto"
        >
          <Upload className="h-4 w-4" />
          Upload Document 上傳文件
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sl-text-secondary" />
          <Input
            aria-label="Search documents 搜尋文件"
            placeholder="Search by equipment no., plate, or keyword 搜尋..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border-sl-border"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by document type 按文件類型篩選"
            className="rounded-lg border border-sl-border bg-white px-3 py-2.5 text-sm text-sl-text whitespace-nowrap"
          >
            <option value="all">Document Type 文件類型 ▾</option>
            <option value="certificate">Certificate 證書</option>
            <option value="inspection-report">Inspection Report 檢驗報告</option>
            <option value="maintenance-record">Maintenance Record 維修紀錄</option>
            <option value="safety-training">Safety Training 安全培訓</option>
            <option value="load-test">Load Test 負重測試</option>
          </select>
          <select
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            aria-label="Filter by equipment 按設備篩選"
            className="rounded-lg border border-sl-border bg-white px-3 py-2.5 text-sm text-sl-text"
          >
            <option value="all">Equipment 設備 ▾</option>
            {uniqueEquipment.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-sl-border">
          <SearchX className="h-12 w-12 text-sl-text-secondary/40 mb-4" />
          <p className="text-sm font-medium text-sl-text">No documents found 找不到文件</p>
          <p className="text-xs text-sl-text-secondary mt-1">Try adjusting your search or filters 請嘗試調整搜尋條件或篩選器</p>
          <button
            onClick={() => { setSearch(""); setTypeFilter("all"); setEquipmentFilter("all"); }}
            className="mt-4 text-sm text-sl-orange hover:underline"
          >
            Clear all filters 清除所有篩選
          </button>
        </div>
      ) : (
        <>
          {/* Document Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((doc) => {
              const config = typeConfig[doc.fileType] || typeConfig.pdf;
              const Icon = config.icon;
              const badge = statusBadge[doc.status];
              return (
                <div
                  key={doc.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open ${doc.fileName}`}
                  onClick={() => showToast(`Opening ${doc.fileName}... 開啟中...`)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showToast(`Opening ${doc.fileName}... 開啟中...`); } }}
                  className="bg-white rounded-xl border border-sl-border hover:border-sl-orange/30 hover:shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sl-orange/30"
                >
                  <div className="p-5">
                    {/* Type Badge + Status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bgColor} ${config.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {config.label}
                      </div>
                      {badge && (
                        <Badge variant="secondary" className={`${badge.className} text-[10px] font-medium`}>
                          {badge.label}
                        </Badge>
                      )}
                    </div>

                    {/* File Name */}
                    <h3 className="text-sm font-semibold text-sl-text mb-1 line-clamp-2">
                      {doc.fileName}
                    </h3>

                    {/* Meta */}
                    <div className="space-y-1.5 mt-3">
                      <div className="flex items-center gap-2 text-xs text-sl-text-secondary">
                        <Link2 className="h-3 w-3" />
                        <span className="truncate">{doc.equipmentName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-sl-text-secondary">
                        <Calendar className="h-3 w-3" />
                        <span>Uploaded 上傳日期: {doc.uploadedAt}</span>
                      </div>
                      {doc.expiryDate && (
                        <div className="flex items-center gap-2 text-xs text-sl-text-secondary">
                          <Calendar className="h-3 w-3" />
                          <span>Expires 到期日: {doc.expiryDate}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-sl-text-secondary">
                        <User className="h-3 w-3" />
                        <span>{doc.uploadedBy} · {doc.fileSize}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {doc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-sl-bg px-2 py-0.5 text-[10px] text-sl-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-sl-text-secondary">
              Showing {filtered.length} of {documents.length} documents 顯示{filtered.length}份文件
            </p>
            <div className="flex items-center gap-2">
              <button disabled className="flex items-center gap-1 rounded-lg border border-sl-border px-3 py-1.5 text-sm text-sl-text-secondary/50 cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" /> Previous 上一頁
              </button>
              <button aria-current="page" aria-label="Page 頁碼 1" className="flex items-center justify-center h-8 w-8 rounded-lg bg-sl-orange text-white text-sm font-medium">
                1
              </button>
              <button disabled className="flex items-center gap-1 rounded-lg border border-sl-border px-3 py-1.5 text-sm text-sl-text-secondary/50 cursor-not-allowed">
                Next 下一頁 <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
}
