import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Files,
  Settings,
  LogOut,
  BookOpen,
  Menu,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/subjects", label: "Subjects", icon: FolderOpen },
  { to: "/notes", label: "Notes", icon: FileText },
  { to: "/files", label: "Files", icon: Files },
  { to: "/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onNavigate) onNavigate();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <span className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-100">
          <BookOpen size={18} className="text-emerald-600" />
        </span>
        <span className="text-lg font-bold text-gray-800 tracking-tight">
          NoteSphere
        </span>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="ml-auto lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {NAV_LINKS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`
            }
          >
            <item.icon size={18} />
            <span className="flex-1 text-left">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Log out ({user?.name?.split(" ")[0] || "user"})
        </button>
      </div>
    </div>
  );
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-gray-200 p-4 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-white p-4 shadow-2xl">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100">
              <BookOpen size={16} className="text-emerald-600" />
            </span>
            <span className="text-base font-bold text-gray-800">NoteSphere</span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
