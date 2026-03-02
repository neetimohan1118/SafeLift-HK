"use client";

import { use, useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Printer,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Wrench,
  ShieldCheck,
  ClipboardCheck,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { equipmentData, maintenanceRecords, documents, hazardReports } from "@/lib/mock-data";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active 有效", className: "bg-green-100 text-green-700 border-green-200" },
  expiring: { label: "Expiring 即將到期", className: "bg-orange-100 text-orange-700 border-orange-200" },
  expired: { label: "Expired 已過期", className: "bg-red-100 text-red-700 border-red-200" },
  maintenance: { label: "Maintenance 維修中", className: "bg-blue-100 text-blue-700 border-blue-200" },
};

const maintenanceIcon: Record<string, typeof Wrench> = {
  routine: ClipboardCheck,
  repair: Wrench,
  inspection: ShieldCheck,
  certification: FileText,
};

const maintenanceColor: Record<string, string> = {
  routine: "bg-green-100 text-green-600",
  repair: "bg-orange-100 text-orange-600",
  inspection: "bg-blue-100 text-blue-600",
  certification: "bg-purple-100 text-purple-600",
};

export default function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const equipment = equipmentData.find((e) => e.id === id);

  const [toast, setToast] = useState("");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(""), 2500);
  }, []);
  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  if (!equipment) notFound();

  const status = statusConfig[equipment.status];
  const relatedDocs = documents.filter((d) => d.equipmentId === equipment.id);
  const relatedHazards = hazardReports.filter((h) => h.equipmentId === equipment.id);
  const relatedMaintenance = maintenanceRecords.filter((m) => m.equipmentId === equipment.id);

  // Calculate days until cert expiry
  const today = new Date();
  const expiry = new Date(equipment.certExpiryDate);
  const daysLeft = Math.max(0, Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Certificate donut chart SVG
  const maxDays = 365;
  const progress = Math.min(daysLeft / maxDays, 1);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);
  const donutColor = daysLeft > 90 ? "#16A34A" : daysLeft > 30 ? "#EA580C" : "#DC2626";

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
      <div className="p-4 md:p-8 space-y-6 overflow-y-auto animate-fade-in-up relative">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-sl-text-secondary">
        <Link href="/equipment" className="hover:text-sl-orange flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Equipment 設備
        </Link>
        <span>/</span>
        <span className="text-sl-text">{equipment.equipmentNumber}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-sl-text">{equipment.model} {equipment.type}</h1>
            <Badge variant="secondary" className={`${status.className} font-medium`}>
              {status.label}
            </Badge>
          </div>
          <p className="text-sm text-sl-text-secondary mt-1">
            Equipment No. {equipment.equipmentNumber} · {equipment.type} · License Plate: {equipment.licensePlate}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => showToast("Edit coming soon 編輯功能即將推出")} className="flex items-center gap-2 rounded-lg border border-sl-border px-3 py-2 text-sm text-sl-text hover:bg-white transition-colors">
            <Edit className="h-4 w-4" /> Edit 編輯
          </button>
          <button onClick={() => showToast("Print QR coming soon 列印二維碼即將推出")} className="flex items-center gap-2 rounded-lg border border-sl-border px-3 py-2 text-sm text-sl-text hover:bg-white transition-colors">
            <Printer className="h-4 w-4" /> Print QR 列印二維碼
          </button>
          <button onClick={() => showToast("Decommission coming soon 報廢功能即將推出")} className="flex items-center gap-2 rounded-lg bg-sl-orange px-3 py-2 text-sm font-medium text-white hover:bg-sl-orange/90 transition-colors">
            Decommission 報廢
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Equipment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equipment Details Card */}
          <div className="bg-white rounded-xl border border-sl-border p-6">
            <h2 className="text-base font-semibold text-sl-text mb-4">
              Equipment Details 設備詳情
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <DetailRow label="Equipment No. 設備編號" value={equipment.equipmentNumber} />
              <DetailRow label="Type 類型" value={equipment.type} />
              <DetailRow label="Manufacturer 製造商" value={equipment.manufacturer} />
              <DetailRow label="Max Capacity 最大承載" value={`${equipment.maxCapacity} tonnes`} />
              <DetailRow label="Model 型號" value={equipment.model} />
              <DetailRow label="Max Radius 最大半徑" value={equipment.maxRadius > 0 ? `${equipment.maxRadius}m` : "N/A"} />
              <DetailRow label="Project 項目" value={equipment.projectName} />
              <DetailRow label="Last Maintenance 上次維修" value={equipment.lastMaintenanceDate} />
            </div>
          </div>

          {/* Maintenance History */}
          <div className="bg-white rounded-xl border border-sl-border p-6">
            <h2 className="text-base font-semibold text-sl-text mb-4">
              Maintenance History 維修記錄
            </h2>
            {relatedMaintenance.length > 0 ? (
              <div className="space-y-4">
                {relatedMaintenance.map((record) => {
                  const Icon = maintenanceIcon[record.type] || Wrench;
                  return (
                    <div key={record.id} className="flex items-start gap-4">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${maintenanceColor[record.type]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sl-text">{record.description}</p>
                        <p className="text-xs text-sl-text-secondary mt-0.5">{record.description_zh}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-sl-text-secondary">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {record.date}
                          </span>
                          <span>By: {record.performedBy}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-sl-text-secondary">
                <Wrench className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No maintenance records 暫無維修紀錄
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Certificate Status Card */}
          <div className="bg-white rounded-xl border border-sl-border p-6">
            <h2 className="text-base font-semibold text-sl-text mb-4">
              Certificate Status 證書狀態
            </h2>
            <div className="flex flex-col items-center">
              {/* Donut Chart */}
              <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke={donutColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-sl-text">{daysLeft}</span>
                  <span className="text-xs text-sl-text-secondary">days left</span>
                </div>
              </div>
              <div className="text-center mt-3">
                <Badge variant="secondary" className={`${status.className} font-medium`}>
                  {status.label}
                </Badge>
                <p className="text-xs text-sl-text-secondary mt-2">
                  Expires: {equipment.certExpiryDate}
                </p>
                <p className="text-xs text-sl-text-secondary">
                  Last inspection 上次檢驗: {equipment.lastInspectionDate}
                </p>
              </div>
            </div>
          </div>

          {/* Related Documents */}
          <div className="bg-white rounded-xl border border-sl-border p-6">
            <h2 className="text-base font-semibold text-sl-text mb-4">
              Related Documents 相關文件
            </h2>
            {relatedDocs.length > 0 ? (
              <div className="space-y-3">
                {relatedDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => showToast(`Opening ${doc.fileName}... 開啟中...`)}
                    className="flex items-center gap-3 text-sm group cursor-pointer w-full text-left"
                  >
                    <FileText className="h-4 w-4 text-sl-orange shrink-0" />
                    <span className="text-sl-text group-hover:text-sl-orange transition-colors truncate">
                      {doc.fileName}
                    </span>
                    <ExternalLink className="h-3 w-3 text-sl-text-secondary ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-sl-text-secondary">No documents linked 暫無關聯文件</p>
            )}
          </div>

          {/* Recent Hazard Reports */}
          <div className="bg-white rounded-xl border border-sl-border p-6">
            <h2 className="text-base font-semibold text-sl-text mb-4">
              Recent Hazard Reports 近期危害報告
            </h2>
            {relatedHazards.length > 0 ? (
              <div className="space-y-3">
                {relatedHazards.map((hazard) => (
                  <div key={hazard.id} className="flex items-start gap-3 text-sm">
                    <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${
                      hazard.severity === "critical" ? "text-red-600" : "text-orange-500"
                    }`} />
                    <div>
                      <p className="text-sl-text">{hazard.description_en.split("—")[0]}</p>
                      <p className="text-xs text-sl-text-secondary">{hazard.reportedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-sl-text-secondary">
                <CheckCircle className="h-6 w-6 mx-auto mb-1 text-green-500 opacity-50" />
                No recent hazards 暫無危害報告
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-sl-text-secondary">{label}</p>
      <p className="text-sm font-medium text-sl-text mt-0.5">{value}</p>
    </div>
  );
}
