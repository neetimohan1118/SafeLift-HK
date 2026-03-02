"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  Loader2,
  Sparkles,
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
    description_en: "Improper sling usage — sling angle exceeds 120°, check attachment points",
    description_zh: "吊索使用不當，夾角過大，建議檢查固定點",
    confidence: 0.78,
    location: "center",
    recommended_en: "Adjust sling angle to below 120 degrees",
    recommended_zh: "調整吊索夾角至120度以下",
  },
  {
    id: 4,
    type: "PPE_MISSING",
    severity: "medium" as const,
    description_en: "PPE violation — worker without hard hat near lifting zone",
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

type AnalysisState = "idle" | "analyzing" | "done";

export default function HazardDetectionPage() {
  const [state, setState] = useState<AnalysisState>("done");
  const [analysisProgress, setAnalysisProgress] = useState(100);
  const [visibleHazards, setVisibleHazards] = useState(mockHazards.length);
  const timerCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => { timerCleanupRef.current?.(); };
  }, []);

  const criticalCount = mockHazards.filter((h) => h.severity === "critical").length;
  const highCount = mockHazards.filter((h) => h.severity === "high").length;
  const mediumCount = mockHazards.filter((h) => h.severity === "medium").length;

  const runAnalysis = useCallback(() => {
    setState("analyzing");
    setAnalysisProgress(0);
    setVisibleHazards(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + 2;
      });
    }, 60);

    // Reveal hazards one by one
    const t1 = setTimeout(() => setVisibleHazards(1), 1500);
    const t2 = setTimeout(() => setVisibleHazards(2), 2200);
    const t3 = setTimeout(() => setVisibleHazards(3), 2800);
    const t4 = setTimeout(() => {
      setVisibleHazards(4);
      setState("done");
      clearInterval(progressInterval);
      setAnalysisProgress(100);
    }, 3500);

    timerCleanupRef.current = () => {
      clearInterval(progressInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleRetake = () => {
    setState("idle");
    setVisibleHazards(0);
    setAnalysisProgress(0);
  };


  return (
    <div className="flex flex-col lg:flex-row lg:h-full">
      {/* Photo Panel */}
      <div className="flex-1 flex flex-col bg-slate-100 p-4 md:p-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-sl-text">
            Hazard Detection 危害檢測
          </h1>
          <p className="text-sm text-sl-text-secondary">
            AI-powered site photo analysis 智能工地相片分析
          </p>
        </div>

        {/* Photo Area with stock image */}
        <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-800 min-h-[400px]">
          {/* Background: construction site photo or idle state */}
          <div className="absolute inset-0">
            {state === "idle" ? (
              <div className="absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Take a photo to begin analysis</p>
                  <p className="text-sm mt-1">拍攝工地照片以開始AI分析</p>
                </div>
              </div>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80"
                  alt="Construction site with crane"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </>
            )}
          </div>

          {/* LIVE badge */}
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-red-600 text-white px-3 py-1 text-xs font-bold animate-pulse">
              LIVE
            </Badge>
          </div>

          {/* AI Detection badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-black/60 text-white px-3 py-1 text-xs flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              {state === "analyzing" ? "Analyzing..." : "AI Detection On"}
            </Badge>
          </div>

          {/* Analyzing overlay */}
          {state === "analyzing" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-8 py-6 text-center">
                <Loader2 className="h-8 w-8 text-sl-orange mx-auto animate-spin" />
                <p className="text-white font-medium mt-3">Analyzing with Qwen2.5-VL...</p>
                <p className="text-slate-300 text-sm mt-1">正在使用 AI 分析工地照片</p>
                <div className="mt-3 w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sl-orange rounded-full transition-all duration-100"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Detection boxes */}
          {visibleHazards >= 1 && (
            <div className="absolute top-[15%] left-[12%] w-[32%] h-[42%] border-2 border-red-500 rounded z-10 animate-in fade-in duration-300">
              <span className="absolute -top-5 left-0 text-xs bg-red-500 text-white px-2 py-0.5 rounded font-medium">
                Zone Violation 92%
              </span>
              <div className="absolute inset-0 bg-red-500/10" />
            </div>
          )}
          {visibleHazards >= 2 && (
            <div className="absolute top-[8%] right-[18%] w-[22%] h-[28%] border-2 border-orange-400 rounded z-10 animate-in fade-in duration-300">
              <span className="absolute -top-5 left-0 text-xs bg-orange-400 text-white px-2 py-0.5 rounded font-medium">
                Rigging Issue 85%
              </span>
              <div className="absolute inset-0 bg-orange-400/10" />
            </div>
          )}
          {visibleHazards >= 3 && (
            <div className="absolute top-[40%] left-[45%] w-[18%] h-[22%] border-2 border-yellow-400 rounded z-10 animate-in fade-in duration-300">
              <span className="absolute -top-5 left-0 text-xs bg-yellow-400 text-slate-900 px-2 py-0.5 rounded font-medium">
                Sling Angle 78%
              </span>
              <div className="absolute inset-0 bg-yellow-400/10" />
            </div>
          )}
          {visibleHazards >= 4 && (
            <div className="absolute bottom-[22%] left-[20%] w-[14%] h-[18%] border-2 border-yellow-400 rounded z-10 animate-in fade-in duration-300">
              <span className="absolute -top-5 left-0 text-xs bg-yellow-400 text-slate-900 px-2 py-0.5 rounded font-medium">
                PPE Missing 81%
              </span>
              <div className="absolute inset-0 bg-yellow-400/10" />
            </div>
          )}

          {/* Timestamp overlay */}
          {state !== "idle" && (
            <div className="absolute bottom-4 left-4 z-10 text-xs text-white/70">
              2026-03-01 09:23:15 · GPS: 22.3193°N, 114.1694°E · Cheung Sha Wan 長沙灣
            </div>
          )}
        </div>

        {/* Camera Controls */}
        <div className="flex items-center justify-center gap-6 py-2">
          <button className="flex flex-col items-center gap-1 text-sl-text-secondary hover:text-sl-text transition-colors">
            <ZoomIn className="h-5 w-5" />
            <span className="text-xs">Zoom</span>
          </button>
          <button
            onClick={state !== "analyzing" ? runAnalysis : undefined}
            className={`flex items-center justify-center h-14 w-14 rounded-full text-white shadow-lg transition-all ${
              state === "analyzing"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-sl-orange hover:bg-sl-orange/90 hover:scale-105 active:scale-95"
            }`}
          >
            {state === "analyzing" ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Camera className="h-6 w-6" />
            )}
          </button>
          <button className="flex flex-col items-center gap-1 text-sl-text-secondary hover:text-sl-text transition-colors">
            <Zap className="h-5 w-5" />
            <span className="text-xs">Flash</span>
          </button>
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="w-full lg:w-[460px] flex flex-col bg-white lg:border-l border-t lg:border-t-0 border-sl-border overflow-y-auto">
        <div className="p-6 border-b border-sl-border">
          <h2 className="text-lg font-bold text-sl-text">
            AI Analysis Results
          </h2>
          {state === "done" ? (
            <>
              <p className="text-sm text-sl-text-secondary mt-1">
                {mockHazards.length} hazards detected 偵測到{mockHazards.length}項危害
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-sl-text-secondary">Overall Risk:</span>
                <Badge className="bg-orange-500 text-white font-bold px-3">
                  HIGH 高危
                </Badge>
              </div>
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
            </>
          ) : state === "analyzing" ? (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-sm text-sl-text-secondary">
                <Loader2 className="h-4 w-4 animate-spin text-sl-orange" />
                Analyzing image with AI... 正在分析中...
              </div>
              <div className="mt-3 text-xs text-sl-text-secondary space-y-1">
                <p>Model: Qwen2.5-VL-72B (阿里巴巴)</p>
                <p>Checking: zone safety, rigging, load, PPE, ground stability</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-sl-text-secondary mt-1">
              Take a photo to start AI analysis 拍攝照片以開始分析
            </p>
          )}
        </div>

        {/* Detected Hazards */}
        <div className="p-4 space-y-3 flex-1">
          {state === "done" && (
            <>
              <h3 className="text-sm font-semibold text-sl-text px-2">
                Detected Hazards 偵測到的危害
              </h3>
              {mockHazards.slice(0, visibleHazards).map((hazard) => {
                const config = severityConfig[hazard.severity];
                const Icon = config.icon;
                return (
                  <div
                    key={hazard.id}
                    className={`rounded-lg border p-4 ${config.bgLight} transition-all`}
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
            </>
          )}

          {state === "analyzing" && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-4 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <div className="h-5 w-20 rounded bg-slate-200" />
                        <div className="h-5 w-8 rounded bg-slate-200" />
                      </div>
                      <div className="h-4 w-full rounded bg-slate-200" />
                      <div className="h-3 w-2/3 rounded bg-slate-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {state === "idle" && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <Camera className="h-12 w-12 text-sl-text-secondary/30 mb-4" />
              <p className="text-sm text-sl-text-secondary">
                No analysis results yet
              </p>
              <p className="text-xs text-sl-text-secondary mt-1">
                點擊拍攝按鈕開始分析
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-sl-border flex gap-3">
          <button
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              state === "done"
                ? "bg-sl-orange text-white hover:bg-sl-orange/90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={state !== "done"}
          >
            <CheckCircle className="h-4 w-4" />
            Confirm Hazards 確認危害
          </button>
          <button
            onClick={handleRetake}
            className="flex items-center justify-center gap-2 rounded-lg border border-sl-border px-4 py-3 text-sm font-medium text-sl-text hover:bg-sl-bg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Retake 重新拍攝
          </button>
        </div>
      </div>
    </div>
  );
}
