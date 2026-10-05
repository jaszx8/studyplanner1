"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Subjects", href: "/subjects", icon: "📚" },
  { name: "Tasks", href: "/tasks", icon: "✅" },
  { name: "Schedule", href: "/schedule", icon: "📅" },
  { name: "Progress", href: "/progress", icon: "📊" },
  { name: "AI Assistant", href: "/ai-assistant", icon: "🤖" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r bg-white lg:block">
      <div className="sticky top-0 flex min-h-screen flex-col">
        {/* Logo */}
        <div className="border-b px-6 py-6">
          <Link href="/" className="block">
            <h1 className="text-xl font-bold text-slate-900">
              StudyPlanner
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Smart Study Management
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Help Card */}
        <div className="p-4">
          <div className="rounded-2xl bg-slate-900 p-5 text-white">
            <div className="text-2xl">💡</div>

            <h2 className="mt-3 text-sm font-semibold">
              Need help studying?
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-300">
              Ask our AI Assistant for study plans, explanations and revision
              help.
            </p>

            <Link
              href="/ai-assistant"
              className="mt-4 block rounded-lg bg-white px-3 py-2 text-center text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Ask AI
            </Link>
          </div>
        </div>

        {/* User */}
        <div className="border-t px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              J
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Jash</p>
              <p className="text-xs text-slate-500">Student</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}