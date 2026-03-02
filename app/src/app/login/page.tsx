"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HardHat, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [toast, setToast] = useState("");

  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(""), 2500);
  }, []);
  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
          <div className="rounded-lg bg-sl-sidebar-bg text-white px-4 py-2.5 text-sm shadow-lg">
            {toast}
          </div>
        </div>
      )}
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sl-sidebar-bg flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full border border-white/20" />
          <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border border-white/15" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sl-orange">
            <HardHat className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">SafeLift HK</h1>
            <p className="text-xs text-sl-sidebar-text">工地安全智能助手</p>
          </div>
        </div>

        {/* Main message */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            讓每一次吊運
            <br />
            都更安全
          </h2>
          <p className="text-lg text-sl-sidebar-text max-w-md">
            AI-powered safety management for crane and lifting operations in Hong Kong construction sites.
          </p>
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-sl-orange">89.4%</p>
              <p className="text-sl-sidebar-text">AI Accuracy AI偵測精確度</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-sl-orange">3 sec 秒</p>
              <p className="text-sl-sidebar-text">Analysis Speed 分析速度</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-sl-orange">$0.025</p>
              <p className="text-sl-sidebar-text">Cost per Analysis 每張分析成本</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-sl-sidebar-text relative z-10">
          © 2026 SafeLift HK. Construction Site Safety Assistant.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-sl-bg">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sl-orange">
              <HardHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold text-sl-text">SafeLift HK</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-sl-text">
              Welcome Back 歡迎回來
            </h2>
            <p className="text-sm text-sl-text-secondary mt-1">
              Sign in to access your safety dashboard 登入以查看安全儀表板
            </p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex rounded-lg bg-white border border-sl-border p-1">
            <button
              onClick={() => setLoginMethod("email")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
                loginMethod === "email"
                  ? "bg-sl-orange text-white"
                  : "text-sl-text-secondary hover:text-sl-text"
              }`}
            >
              <Mail className="h-4 w-4" />
              Email 電郵
            </button>
            <button
              onClick={() => setLoginMethod("phone")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
                loginMethod === "phone"
                  ? "bg-sl-orange text-white"
                  : "text-sl-text-secondary hover:text-sl-text"
              }`}
            >
              <Phone className="h-4 w-4" />
              Phone 電話
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginMethod === "email" ? (
              <div>
                <label htmlFor="login-email" className="text-xs font-medium text-sl-text-secondary mb-1.5 block">
                  Email Address 電郵地址
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sl-text-secondary" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@company.com"
                    defaultValue="chan.tw@safelift.hk"
                    className="pl-10 bg-white border-sl-border h-11"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="login-phone" className="text-xs font-medium text-sl-text-secondary mb-1.5 block">
                  Phone Number 電話號碼
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sl-text-secondary" />
                  <Input
                    id="login-phone"
                    type="tel"
                    placeholder="+852 XXXX XXXX"
                    defaultValue="+852 9123 4567"
                    className="pl-10 bg-white border-sl-border h-11"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="login-password" className="text-xs font-medium text-sl-text-secondary mb-1.5 block">
                Password 密碼
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sl-text-secondary" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password 輸入密碼"
                  defaultValue="demo123"
                  className="pl-10 pr-10 bg-white border-sl-border h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password 隱藏密碼" : "Show password 顯示密碼"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sl-text-secondary hover:text-sl-text"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label htmlFor="remember-me" className="flex items-center gap-2 text-sl-text-secondary">
                <input
                  id="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-sl-border accent-sl-orange"
                />
                Remember me 記住我
              </label>
              <button type="button" onClick={() => showToast("Please contact admin 請聯繫管理員")} className="text-sl-orange hover:underline">
                Forgot password? 忘記密碼？
              </button>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-sl-orange py-3 text-sm font-semibold text-white hover:bg-sl-orange/90 transition-colors"
            >
              Sign In 登入
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center">
            <p className="text-xs text-sl-text-secondary">
              Demo Account 示範帳號: chan.tw@safelift.hk / demo123
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sl-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-sl-bg px-4 text-sl-text-secondary">
                Or continue with 或使用
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-sl-border bg-white py-3 text-sm font-medium text-sl-text hover:bg-sl-bg transition-colors"
          >
            <HardHat className="h-4 w-4 text-sl-orange" />
            Continue as Demo User 以示範用戶繼續
          </button>
        </div>
      </div>
    </div>
  );
}
