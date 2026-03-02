"use client";

import { useState, useCallback } from "react";
import { User, Globe, Bell, Shield, Palette, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [toast, setToast] = useState("");
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);
  const [language, setLanguage] = useState("zh-HK");
  const [notifications, setNotifications] = useState({
    certExpiry: true,
    hazardAlerts: true,
    maintenance: true,
    email: true,
    push: false,
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-3xl animate-fade-in-up relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
          <div className="rounded-lg bg-sl-sidebar-bg text-white px-4 py-2.5 text-sm shadow-lg">
            {toast}
          </div>
        </div>
      )}
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-sl-text">Settings 設定</h1>
        <p className="text-sm text-sl-text-secondary mt-1">
          Manage your account and app preferences 管理帳戶及應用程式偏好設定
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl border border-sl-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-5 w-5 text-sl-orange" />
          <h2 className="text-base font-semibold text-sl-text">
            Profile 個人資料
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="settings-name" className="text-xs text-sl-text-secondary mb-1 block">
              Name 姓名
            </label>
            <Input id="settings-name" defaultValue="陳大文" className="bg-white border-sl-border" />
          </div>
          <div>
            <label htmlFor="settings-role" className="text-xs text-sl-text-secondary mb-1 block">
              Role 角色
            </label>
            <div className="flex items-center gap-2">
              <Input id="settings-role" defaultValue="Site Manager" className="bg-white border-sl-border" disabled />
              <Badge variant="secondary" className="bg-sl-orange/10 text-sl-orange">Admin</Badge>
            </div>
          </div>
          <div>
            <label htmlFor="settings-email" className="text-xs text-sl-text-secondary mb-1 block">
              Email 電郵
            </label>
            <Input id="settings-email" defaultValue="chan.tw@safelift.hk" className="bg-white border-sl-border" />
          </div>
          <div>
            <label htmlFor="settings-phone" className="text-xs text-sl-text-secondary mb-1 block">
              Phone 電話
            </label>
            <Input id="settings-phone" defaultValue="+852 9123 4567" className="bg-white border-sl-border" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="settings-company" className="text-xs text-sl-text-secondary mb-1 block">
              Company 公司
            </label>
            <Input id="settings-company" defaultValue="SafeLift Construction Ltd." className="bg-white border-sl-border" />
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-xl border border-sl-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-sl-orange" />
          <h2 className="text-base font-semibold text-sl-text">
            Language 語言
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setLanguage("zh-HK")}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              language === "zh-HK"
                ? "border-sl-orange bg-sl-orange/10 text-sl-orange"
                : "border-sl-border text-sl-text hover:bg-sl-bg"
            }`}
          >
            繁體中文
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              language === "en"
                ? "border-sl-orange bg-sl-orange/10 text-sl-orange"
                : "border-sl-border text-sl-text hover:bg-sl-bg"
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-sl-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5 text-sl-orange" />
          <h2 className="text-base font-semibold text-sl-text">
            Notifications 通知設定
          </h2>
        </div>
        <div className="space-y-4">
          <ToggleRow
            label="Certificate Expiry 證書到期提醒"
            description="30-day and 14-day reminders for expiring certificates"
            checked={notifications.certExpiry}
            onChange={() => setNotifications((p) => ({ ...p, certExpiry: !p.certExpiry }))}
          />
          <ToggleRow
            label="Hazard Alerts 危害警報"
            description="Immediate alerts for critical and high severity hazards"
            checked={notifications.hazardAlerts}
            onChange={() => setNotifications((p) => ({ ...p, hazardAlerts: !p.hazardAlerts }))}
          />
          <ToggleRow
            label="Maintenance Due 維修到期"
            description="Reminders for scheduled maintenance"
            checked={notifications.maintenance}
            onChange={() => setNotifications((p) => ({ ...p, maintenance: !p.maintenance }))}
          />
          <div className="border-t border-sl-border pt-4 mt-4" />
          <ToggleRow
            label="Email Notifications 電郵通知"
            description="Receive alerts via email"
            checked={notifications.email}
            onChange={() => setNotifications((p) => ({ ...p, email: !p.email }))}
          />
          <ToggleRow
            label="Push Notifications 推送通知"
            description="Browser push notifications (requires PWA install)"
            checked={notifications.push}
            onChange={() => setNotifications((p) => ({ ...p, push: !p.push }))}
          />
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-sl-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-sl-orange" />
          <h2 className="text-base font-semibold text-sl-text">
            Security 安全設定
          </h2>
        </div>
        <div className="space-y-3">
          <button onClick={() => showToast("Password change coming soon 更改密碼功能即將推出")} className="text-sm text-sl-orange hover:underline">
            Change Password 更改密碼
          </button>
          <p className="text-xs text-sl-text-secondary">
            Last password change: 2026-01-15
          </p>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-xl border border-sl-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="h-5 w-5 text-sl-orange" />
          <h2 className="text-base font-semibold text-sl-text">
            About 關於
          </h2>
        </div>
        <div className="text-sm text-sl-text-secondary space-y-1">
          <p>SafeLift HK v1.0.0 (MVP)</p>
          <p>工地安全智能助手 — Construction Site Safety Assistant</p>
          <p className="text-xs mt-2">
            Powered by AI Vision (Qwen2.5-VL + GLM-4V + Doubao Vision)
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={() => showToast("Settings saved 設定已儲存 ✓")} className="flex items-center gap-2 rounded-lg bg-sl-orange px-6 py-2.5 text-sm font-medium text-white hover:bg-sl-orange/90 transition-colors">
          <Save className="h-4 w-4" />
          Save Changes 儲存更改
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-sl-text">{label}</p>
        <p className="text-xs text-sl-text-secondary">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-sl-orange" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
