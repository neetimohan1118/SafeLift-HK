import Link from "next/link";
import { HardHat, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sl-orange/10 mb-6">
        <Search className="h-8 w-8 text-sl-orange" />
      </div>
      <h1 className="text-4xl font-bold text-sl-text mb-2">404</h1>
      <h2 className="text-lg font-semibold text-sl-text mb-1">
        Page Not Found 找不到頁面
      </h2>
      <p className="text-sm text-sl-text-secondary max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
        <br />
        您要查找的頁面不存在或已被移動。
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-lg bg-sl-orange px-6 py-3 text-sm font-medium text-white hover:bg-sl-orange/90 transition-colors"
        >
          <HardHat className="h-4 w-4" />
          Back to Dashboard 返回儀表板
        </Link>
        <Link
          href="/equipment"
          className="flex items-center justify-center gap-2 rounded-lg border border-sl-border px-6 py-3 text-sm font-medium text-sl-text hover:bg-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Equipment List 設備列表
        </Link>
      </div>
    </div>
  );
}
