"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flashlight, SwitchCamera, QrCode, CheckCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
  const router = useRouter();
  const [scanState, setScanState] = useState<"scanning" | "found" | "navigating">("scanning");
  const [scanLinePos, setScanLinePos] = useState(0);
  const [scanKey, setScanKey] = useState(0);
  const [toast, setToast] = useState("");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(""), 2500);
  }, []);

  // Animate scan line
  useEffect(() => {
    if (scanState !== "scanning") return;
    const interval = setInterval(() => {
      setScanLinePos((prev) => (prev >= 100 ? 0 : prev + 1.5));
    }, 30);
    return () => clearInterval(interval);
  }, [scanState]);

  const cancelScan = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setScanState("scanning");
    setScanLinePos(0);
    setScanKey((k) => k + 1);
  }, []);

  // Auto-detect after 3 seconds for demo
  useEffect(() => {
    const timers = timersRef.current;
    const timer = setTimeout(() => {
      setScanState("found");
      const t2 = setTimeout(() => {
        setScanState("navigating");
        const t3 = setTimeout(() => {
          router.push("/equipment/LC-2024-001");
        }, 800);
        timers.push(t3);
      }, 1200);
      timers.push(t2);
    }, 3000);
    timers.push(timer);
    return () => { timers.forEach(clearTimeout); timersRef.current = []; clearTimeout(toastTimerRef.current); };
  }, [router, scanKey]);

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
          <div className="rounded-lg bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 text-sm shadow-lg">
            {toast}
          </div>
        </div>
      )}
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 text-white z-10">
        <Link href="/equipment" className="flex items-center gap-2 text-sm">
          <ArrowLeft className="h-5 w-5" />
          Back 返回
        </Link>
        <h1 className="text-sm font-medium">Scan QR Code 掃描二維碼</h1>
        <div className="w-16" />
      </div>

      {/* Camera Viewfinder */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Simulated camera feed - dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800">
          {/* Fake camera noise pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "20px 20px"
          }} />
        </div>

        {/* Scan overlay - darkened corners */}
        <div className="absolute inset-0">
          {/* Top */}
          <div className="absolute top-0 left-0 right-0 h-[25%] bg-black/50" />
          {/* Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-black/50" />
          {/* Left */}
          <div className="absolute top-[25%] left-0 w-[15%] h-[50%] bg-black/50" />
          {/* Right */}
          <div className="absolute top-[25%] right-0 w-[15%] h-[50%] bg-black/50" />
        </div>

        {/* Scan frame */}
        <div className="relative w-64 h-64 md:w-72 md:h-72">
          {/* Corner markers */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-sl-orange rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-sl-orange rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-sl-orange rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-sl-orange rounded-br-lg" />

          {/* Scan line */}
          {scanState === "scanning" && (
            <div
              className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-sl-orange to-transparent transition-none"
              style={{ top: `${scanLinePos}%` }}
            />
          )}

          {/* QR Code detected overlay */}
          {scanState !== "scanning" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 animate-fade-in-up">
                {scanState === "found" ? (
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sl-safe/20 backdrop-blur-sm">
                      <CheckCircle className="h-8 w-8 text-sl-safe" />
                    </div>
                    <p className="text-white text-sm font-medium">QR Code Detected! 已偵測到二維碼</p>
                    <p className="text-white/70 text-xs">Equipment 設備: LC-2024-001</p>
                  </>
                ) : (
                  <>
                    <div className="h-8 w-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <p className="text-white text-sm">Loading equipment... 正在載入設備</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Demo QR code in viewfinder */}
          {scanState === "scanning" && (
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <QrCode className="h-24 w-24 text-white" />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-[28%] left-0 right-0 text-center">
          <p className="text-white text-sm font-medium">
            {scanState === "scanning"
              ? "Point camera at equipment QR code"
              : scanState === "found"
                ? "Equipment found 設備已識別"
                : "Opening equipment profile... 正在開啟設備資料"}
          </p>
          <p className="text-white/60 text-xs mt-1">
            {scanState === "scanning" && "將相機對準設備二維碼"}
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center gap-8 p-6 bg-black">
        <button onClick={() => showToast("Flash not available in demo 閃光燈不適用於演示模式")} className="flex flex-col items-center gap-1 text-white/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <Flashlight className="h-5 w-5" />
          </div>
          <span className="text-[10px]">Flash 閃光</span>
        </button>

        {scanState !== "scanning" && (
          <button onClick={cancelScan} className="flex flex-col items-center gap-1 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sl-orange">
              <RotateCcw className="h-5 w-5" />
            </div>
            <span className="text-[10px]">Rescan 重掃</span>
          </button>
        )}

        <button onClick={() => showToast("Camera switch not available in demo 切換相機不適用於演示模式")} className="flex flex-col items-center gap-1 text-white/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <SwitchCamera className="h-5 w-5" />
          </div>
          <span className="text-[10px]">Switch 切換</span>
        </button>
      </div>
    </div>
  );
}
