"use client";

import { useState } from "react";
import { Plus, QrCode, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { equipmentData } from "@/lib/mock-data";
import Link from "next/link";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active 有效", className: "bg-green-100 text-green-700" },
  expiring: { label: "Expiring 即將到期", className: "bg-orange-100 text-orange-700" },
  expired: { label: "Expired 已過期", className: "bg-red-100 text-red-700" },
  maintenance: { label: "Maintenance 維修中", className: "bg-blue-100 text-blue-700" },
};

export default function EquipmentListPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = equipmentData.filter((e) => {
    const matchSearch =
      e.equipmentNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      e.model.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || e.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchSearch && matchType;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-sl-text">
            Equipment 設備管理
          </h1>
          <p className="text-sm text-sl-text-secondary mt-1">
            Manage all lifting equipment and certificates 管理所有起重設備及證書
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg bg-sl-orange px-3 md:px-4 py-2.5 text-sm font-medium text-white hover:bg-sl-orange/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Equipment</span> 新增設備
          </button>
          <Link href="/scan" className="flex items-center gap-2 rounded-lg border border-sl-border px-3 md:px-4 py-2.5 text-sm font-medium text-sl-text hover:bg-white transition-colors">
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">Scan QR</span> 掃碼查詢
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sl-text-secondary" />
          <Input
            placeholder="Search by plate or equipment no. 按車牌或編號搜尋..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border-sl-border"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 sm:flex-none rounded-lg border border-sl-border bg-white px-3 py-2.5 text-sm text-sl-text"
          >
            <option value="all">Type 類型 ▾</option>
            <option value="lorry">Lorry Crane 貨車吊機</option>
            <option value="tower">Tower Crane 塔式起重機</option>
            <option value="chain">Chain Block 鏈條葫蘆</option>
            <option value="mobile">Mobile Crane 流動吊機</option>
            <option value="gantry">Gantry Crane 門式起重機</option>
          </select>
          <select className="flex-1 sm:flex-none rounded-lg border border-sl-border bg-white px-3 py-2.5 text-sm text-sl-text">
            <option>Status 狀態 ▾</option>
            <option>Active 有效</option>
            <option>Expiring 即將到期</option>
            <option>Expired 已過期</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-sl-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sl-border bg-sl-bg/50 text-left">
                <th className="px-6 py-3 font-medium text-sl-text-secondary">Equipment No. 設備編號</th>
                <th className="px-6 py-3 font-medium text-sl-text-secondary">License Plate 車牌</th>
                <th className="px-6 py-3 font-medium text-sl-text-secondary">Type 類型</th>
                <th className="px-6 py-3 font-medium text-sl-text-secondary">Model 型號</th>
                <th className="px-6 py-3 font-medium text-sl-text-secondary">Max Cap. 承載(t)</th>
                <th className="px-6 py-3 font-medium text-sl-text-secondary">Status 狀態</th>
                <th className="px-6 py-3 font-medium text-sl-text-secondary">Cert Expiry 證書到期</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((eq) => {
                const status = statusConfig[eq.status];
                return (
                  <tr
                    key={eq.id}
                    className="border-b border-sl-border/50 hover:bg-sl-bg/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/equipment/${eq.id}`}
                        className="font-medium text-sl-text hover:text-sl-orange transition-colors"
                      >
                        {eq.equipmentNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sl-text">{eq.licensePlate}</td>
                    <td className="px-6 py-4 text-sl-text-secondary">{eq.type}</td>
                    <td className="px-6 py-4 text-sl-text-secondary">{eq.model}</td>
                    <td className="px-6 py-4 text-sl-text">{eq.maxCapacity}T</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className={`${status.className} text-xs font-medium`}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sl-text-secondary">{eq.certExpiryDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-sl-border">
          <p className="text-sm text-sl-text-secondary">
            Showing {filtered.length} of {equipmentData.length} equipment 顯示{filtered.length}項設備
          </p>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 rounded-lg border border-sl-border px-3 py-1.5 text-sm text-sl-text-secondary hover:bg-sl-bg">
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button className="flex items-center gap-1 rounded-lg border border-sl-border px-3 py-1.5 text-sm text-sl-text-secondary hover:bg-sl-bg">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filtered.map((eq) => {
          const status = statusConfig[eq.status];
          return (
            <Link
              key={eq.id}
              href={`/equipment/${eq.id}`}
              className="block bg-white rounded-xl border border-sl-border p-4 hover:border-sl-orange/30 transition-colors active:bg-sl-bg/50"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-sl-text">{eq.equipmentNumber}</p>
                  <p className="text-xs text-sl-text-secondary">{eq.type}</p>
                </div>
                <Badge variant="secondary" className={`${status.className} text-xs font-medium`}>
                  {status.label}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                <div>
                  <p className="text-sl-text-secondary">車牌</p>
                  <p className="font-medium text-sl-text">{eq.licensePlate || "—"}</p>
                </div>
                <div>
                  <p className="text-sl-text-secondary">型號</p>
                  <p className="font-medium text-sl-text truncate">{eq.model}</p>
                </div>
                <div>
                  <p className="text-sl-text-secondary">承載</p>
                  <p className="font-medium text-sl-text">{eq.maxCapacity}T</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-sl-border/50">
                <p className="text-xs text-sl-text-secondary">Cert expiry: {eq.certExpiryDate}</p>
                <ChevronRight className="h-4 w-4 text-sl-text-secondary" />
              </div>
            </Link>
          );
        })}
        <p className="text-center text-xs text-sl-text-secondary py-2">
          {filtered.length} of {equipmentData.length} equipment 顯示{filtered.length}項設備
        </p>
      </div>
    </div>
  );
}
