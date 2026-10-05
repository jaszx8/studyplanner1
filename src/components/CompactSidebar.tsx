"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Subjects", href: "/subjects", icon: "📚" },
  { name: "Tasks", href: "/tasks", icon: "✅" },
  { name: "Schedule", href: "/schedule", icon: "📅" },
  { name: "Smart Planner", href: "/planner", icon: "🧠" },
  { name: "Progress", href: "/progress", icon: "📊" },
  { name: "AI Assistant", href: "/ai-assistant", icon: "🤖" },
];

export default function CompactSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-20 border-r border-slate-800 bg-slate-950 lg:flex lg:flex-col">
      <div className="flex h-20 items-center justify-center border-b border-slate-800">
        <Link
          href="/"
          title="StudyPlanner"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-lg"
        >
          S
        </Link>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-3 py-6">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.name}
              className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
            </Link>
          );
        })}
      </nav>

      <div className="flex justify-center border-t border-slate-800 py-5">
        <div
          title="Jash - Student"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700"
        >
          J
        </div>
      </div>
    </aside>
  );
}