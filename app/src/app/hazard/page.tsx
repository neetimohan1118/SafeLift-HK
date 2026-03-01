"use client";

import { useState } from "react";
import {
  Camera,
  ZoomIn,
  Zap,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Eye,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockHazards = [
  {
    id: 1,
    type: "ZONE_VIOLATION",
    severity: "critical" as const,
    description_en: "Person in crane swing zone — worker detected within 5m of active boom radius",
    description_zh: "有人站在吊運範圍內 — 偵測到工人距離吊臂不足5米",
    confidence: 0.92,
    location: "center-left",
    recommended_en: "Immediately evacuate all personnel from the swing zone",
    recommended_zh: "立即疏散所有人員離開吊運範圍",
  },
  {
    id: 2,
    type: "RIGGING_IMPROPER",
    severity: "high" as const,
    description_en: "Overloaded sling detected — sling capacity exceeds recommended load by 15%",
    description_zh: "偵測到吊索超載 — 吊索負載超出建議量15%",
    confidence: 0.85,
    location: "top-right",
    recommended_en: "Replace sling with appropriate SWL rating",
    recommended_zh: "更換為合適安全工作負荷評級的吊索",
  },
  {
    id: 3,
    type: "RIGGING_IMPROPER",
    severity: "medium" as const,
    description_en: "Improper sling usage — 吊索使用不當，建議檢查夾角及固定方式",
    description_zh: "吊索使用不當，夾角過大",
    confidence: 0.78,
    location: "center",
    recommended_en: "Adjust sling angle to below 120 degrees",
    recommended_zh: "調整吊索夾角至120度以下",
  },
  {
    id: 4,
    type: "PPE_MISSING",
    severity: "medium" as const,
    description_en: "PPE violation — 一名工人未佩戴安全帽，位於吊運範圍附近",
    description_zh: "個人防護裝備缺失 — 工人未佩戴安全帽",
    confidence: 0.81,
    location: "bottom-left",
    recommended_en: "Ensure all workers wear hard hats in lifting zones",
    recommended_zh: "確保所有在吊運區域的工人佩戴安全帽",
  },
];

const severityConfig = {
  critical: { label: "CRITICAL 嚴重", color: "bg-red-600", textColor: "text-red-700", bgLight: "bg-red-50 border-red-200", icon: ShieldAlert },
  high: { label: "HIGH 高危", color: "bg-orange-500", textColor: "text-orange-700", bgLight: "bg-orange-50 border-orange-200", icon: AlertTriangle },
  medium: { label: "MEDIUM 中等", color: "bg-yellow-500", textColor: "text-yellow-700", bgLight: "bg-yellow-50 border-yellow-200", icon: Info },
  low: { label: "LOW 低危", color: "bg-blue-500", textColor: "text-blue-700", bgLight: "bg-blue-50 border-blue-200", icon: Eye },
};

export default function HazardDetectionPage() {
  const [isAnalyzed] = useState(true);

  const criticalCount = mockHazards.filter((h) => h.severity === "critical").length;
  const highCount = mockHazards.filter((h) => h.severity === "high").length;
  const mediumCount = mockHazards.filter((h) => h.severity === "medium").length;

  return (
    <div className="flex h-full">
      {/* Photo Panel */}
      <div className="flex-1 flex flex-col bg-slate-100 p-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-sl-text">
            Hazard Detection 危害檢測
          </h1>
          <p className="text-sm text-sl-text-secondary">
            AI-powered site photo analysis 智能工地相片分析
          </p>
        </div>

        {/* Photo Area */}
        <div className="relative flex-1 rounded-xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 min-h-[400px]">
          {/* Simulated construction site image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Construction Site Photo</p>
              <p className="text-sm">工地現場照片</p>
            </div>
          </div>

          {/* LIVE badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-600 text-white px-3 py-1 text-xs font-bold">
              LIVE
            </Badge>
          </div>

          {/* AI Detection badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-black/60 text-white px-3 py-1 text-xs">
              AI Detection On
            </Badge>
          </div>

          {/* Simulated detection boxes */}
          {isAnalyzed && (
            <>
              <div className="absolute top-[20%] left-[15%] w-[30%] h-[40%] border-2 border-red-500 rounded">
                <span className="absolute -top-5 left-0 text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                  Zone Violation
                </span>
              </div>
              <div className="absolute top-[10%] right-[20%] w-[20%] h-[25%] border-2 border-orange-400 rounded">
                <span className="absolute -top-5 left-0 text-xs bg-orange-400 text-white px-2 py-0.5 rounded">
                  Rigging Issue
                </span>
              </div>
              <div className="absolute bottom-[25%] left-[40%] w-[15%] h-[20%] border-2 border-yellow-400 rounded">
                <span className="absolute -top-5 left-0 text-xs bg-yellow-400 text-white px-2 py-0.5 rounded">
                  PPE Missing
                </span>
              </div>
            </>
          )}
        </div>

        {/* Camera Controls */}
        <div className="flex items-center justify-center gap-6 py-2">
          <button className="flex flex-col items-center gap-1 text-sl-text-secondary hover:text-sl-text transition-colors">
            <ZoomIn className="h-5 w-5" />
            <span className="text-xs">Zoom</span>
          </button>
          <button className="flex items-center justify-center h-14 w-14 rounded-full bg-sl-orange text-white hover:bg-sl-orange/90 transition-colors shadow-lg">
            <Camera className="h-6 w-6" />
          </button>
          <button className="flex flex-col items-center gap-1 text-sl-text-secondary hover:text-sl-text transition-colors">
            <Zap className="h-5 w-5" />
            <span className="text-xs">Flash</span>
          </button>
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="w-[460px] flex flex-col bg-white border-l border-sl-border overflow-y-auto">
        <div className="p-6 border-b border-sl-border">
          <h2 className="text-lg font-bold text-sl-text">
            AI Analysis Results
          </h2>
          <p className="text-sm text-sl-text-secondary mt-1">
            {mockHazards.length} hazards detected 偵測到{mockHazards.length}項危害
          </p>

          {/* Overall Risk */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-sl-text-secondary">Overall Risk:</span>
            <Badge className="bg-orange-500 text-white font-bold px-3">
              HIGH 高危
            </Badge>
          </div>

          {/* Summary Counts */}
          <div className="mt-3 flex gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              Critical: {criticalCount}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              High: {highCount}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              Medium: {mediumCount}
            </span>
          </div>
        </div>

        {/* Detected Hazards */}
        <div className="p-4 space-y-3 flex-1">
          <h3 className="text-sm font-semibold text-sl-text px-2">
            Detected Hazards 偵測到的危害
          </h3>
          {mockHazards.map((hazard) => {
            const config = severityConfig[hazard.severity];
            const Icon = config.icon;
            return (
              <div
                key={hazard.id}
                className={`rounded-lg border p-4 ${config.bgLight}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${config.textColor}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`${config.color} text-white text-[10px] font-bold px-2`}>
                        {config.label}
                      </Badge>
                      <span className="text-xs text-sl-text-secondary">
                        {Math.round(hazard.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-sl-text leading-relaxed">
                      {hazard.description_en}
                    </p>
                    <p className="text-xs text-sl-text-secondary mt-1">
                      {hazard.description_zh}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-sl-border flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-sl-orange px-4 py-3 text-sm font-medium text-white hover:bg-sl-orange/90 transition-colors">
            <CheckCircle className="h-4 w-4" />
            Confirm Hazards 確認危害
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-sl-border px-4 py-3 text-sm font-medium text-sl-text hover:bg-sl-bg transition-colors">
            <RotateCcw className="h-4 w-4" />
            Retake 重新拍攝
          </button>
        </div>
      </div>
    </div>
  );
}
