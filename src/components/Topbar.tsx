import React, { useState } from 'react';
import {
  Menu,
  Bell,
  ChevronRight,
  Search,
  Sparkles,
} from 'lucide-react';
import { SubMenuId, UserRole, AnnouncementItem } from '../types/sigap';
import { findMenuContext, MENU_GROUPS } from '../utils/sigapLogic';

interface TopbarProps {
  activeSubMenu: SubMenuId;
  onSelectSubMenu: (id: SubMenuId) => void;
  onOpenMobileMenu: () => void;
  currentRole?: UserRole;
  onOpenLogin?: () => void;
  announcements: AnnouncementItem[];
}

export const Topbar: React.FC<TopbarProps> = ({
  activeSubMenu,
  onSelectSubMenu,
  onOpenMobileMenu,
  announcements,
}) => {
  const [showNotif, setShowNotif] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const { group, item } = findMenuContext(activeSubMenu);

  const allSubMenus = MENU_GROUPS.flatMap((g) =>
    g.items.map((it) => ({
      ...it,
      groupTitle: g.title,
    }))
  );

  const filteredMenus = quickSearch.trim()
    ? allSubMenus.filter(
        (m) =>
          m.label.toLowerCase().includes(quickSearch.toLowerCase()) ||
          m.groupTitle.toLowerCase().includes(quickSearch.toLowerCase()) ||
          m.description.toLowerCase().includes(quickSearch.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Trigger + Breadcrumb & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Buka menu navigasi"
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => onSelectSubMenu('dashboard')}
                className="hover:text-blue-600 font-medium transition-colors whitespace-nowrap shrink-0"
              >
                SMART SIGAP
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-600 whitespace-nowrap shrink-0">
                {group.title}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-blue-600 whitespace-nowrap shrink-0">
                {item.label}
              </span>
            </div>
            {/* Current Page Title */}
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate font-display">
              {item.label}
            </h1>
          </div>
        </div>

        {/* Right: Search Input, AI RPP Assistant Shortcut, & Notifications */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Quick Module Search */}
          <div className="relative hidden sm:block">
            <div className="flex items-center bg-[#F4F8FF] border border-blue-200/80 rounded-xl px-3 py-2 w-56 md:w-64 focus-within:ring-2 focus-within:ring-blue-500/30">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => {
                  setQuickSearch(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 180)}
                placeholder="Cari modul atau fitur..."
                aria-label="Cari modul atau fitur SMART SIGAP"
                className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full"
              />
            </div>

            {showSearchDropdown && filteredMenus.length > 0 && (
              <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-2xl shadow-lg border border-slate-200 py-2 z-40 max-h-72 overflow-y-auto">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400">
                  Hasil Pencarian Modul ({filteredMenus.length})
                </div>
                {filteredMenus.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onMouseDown={() => {
                      onSelectSubMenu(m.id);
                      setQuickSearch('');
                      setShowSearchDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-blue-50/80 transition-colors flex flex-col"
                  >
                    <span className="text-xs font-bold text-slate-800">
                      {m.label}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {m.groupTitle} · {m.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shortcut to AI Curriculum Assistant */}
          <button
            type="button"
            onClick={() => onSelectSubMenu('ai-curriculum-assistant')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition-all whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI RPP Assistant</span>
          </button>

          {/* Notification Bell with Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotif((prev) => !prev)}
              aria-label="Notifikasi Pengumuman Sekolah"
              className="relative p-2 rounded-xl bg-[#F4F8FF] hover:bg-blue-100/70 text-slate-700 border border-blue-200/70 transition-colors"
            >
              <Bell className="w-4 h-4 text-blue-700" />
              {announcements.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-white" />
              )}
              <span className="sr-only">
                {announcements.length} informasi sekolah
              </span>
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">
                    Notifikasi &amp; Edaran Sekolah ({announcements.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotif(false);
                      onSelectSubMenu('informasi-pengumuman');
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Lihat Semua
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-1">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="py-2.5">
                      <div className="text-xs font-bold text-slate-800">
                        {ann.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {ann.category} · {ann.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
