import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  User as UserIcon,
  LogOut,
  LogIn,
} from 'lucide-react';
import { MENU_GROUPS } from '../utils/sigapLogic';
import { SubMenuId, AuthUser } from '../types/sigap';
import { OFFICIAL_LOGO_PATH } from '../data/demoData';

interface SidebarProps {
  activeSubMenu: SubMenuId;
  onSelectSubMenu: (id: SubMenuId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onLogoutClick: () => void;
}

function getInitials(name: string): string {
  if (!name) return 'PA';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSubMenu,
  onSelectSubMenu,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  currentUser,
  onOpenLogin,
  onLogoutClick,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'sigap-home': true,
    'sigap-master': true,
    'sigap-governance': true,
    'sigap-pedagogy': true,
    'sigap-assess': true,
    'sigap-digital-hub': true,
    'sigap-classhub': true,
    'sigap-control-center': true,
  });

  const toggleGroup = (groupId: string) => {
    if (isCollapsed) {
      onToggleCollapse();
      setExpandedGroups((prev) => ({ ...prev, [groupId]: true }));
      return;
    }
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleMenuClick = (id: SubMenuId) => {
    onSelectSubMenu(id);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const isAuthenticated = currentUser?.isAuthenticated;
  const displayName = currentUser?.name || 'Pengguna Aktif';
  const displayRole = currentUser?.role || 'Kepala Sekolah';
  const initials = getInitials(displayName);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0F1E36] text-slate-100 select-none border-r border-slate-800/80">
      {/* Top Official Identity Brand Header with Uploaded Square SMART SIGAP Logo */}
      <div
        className={`shrink-0 relative flex flex-col items-center justify-center border-b border-slate-800/90 bg-gradient-to-b from-[#15294B] to-[#0F1E36] transition-all duration-200 ${
          isCollapsed ? 'p-2.5' : 'px-4 pt-4 pb-3.5'
        }`}
      >
        <button
          type="button"
          onClick={() => handleMenuClick('dashboard')}
          className="group flex flex-col items-center focus:outline-none w-full"
          title="SMART SIGAP"
        >
          <div
            className={`flex items-center justify-center rounded-2xl bg-white/95 p-1.5 shadow-md ring-2 ring-blue-400/30 transition-transform duration-200 group-hover:scale-[1.02] ${
              isCollapsed ? 'w-12 h-12' : 'w-24 h-24'
            }`}
          >
            <img
              src={OFFICIAL_LOGO_PATH}
              alt="Logo Resmi SMART SIGAP"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {!isCollapsed && (
            <div className="mt-2.5 text-center">
              <div className="text-sm font-extrabold tracking-tight text-white font-display">
                SMART SIGAP
              </div>
              <div className="text-[11px] font-medium text-sky-300 leading-tight mt-0.5">
                Sistem Integrasi Guru &amp; Anak Pintar
              </div>
            </div>
          )}
        </button>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Tutup menu navigasi"
          className="lg:hidden absolute top-3 right-3 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Collapse Toggle Bar (Desktop) */}
      <div className="shrink-0 hidden lg:flex items-center justify-between px-3 py-2 border-b border-slate-800/80 bg-[#0C182B]">
        {!isCollapsed && (
          <span className="text-[11px] font-semibold text-slate-400 px-1">
            Menu Navigasi Utama
          </span>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          className={`flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-lg px-2 py-1.5 transition-colors ${
            isCollapsed ? 'mx-auto' : ''
          }`}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-sky-400" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 text-sky-400" />
              <span>Ciutkan</span>
            </>
          )}
        </button>
      </div>

      {/* 8 Clean Accordion Menu Groups without numbers or decorative icons */}
      <nav
        aria-label="Navigasi Utama SMART SIGAP"
        className="flex-1 overflow-y-auto sidebar-scroll py-3 px-2.5 space-y-1.5 min-h-0"
      >
        {MENU_GROUPS.map((group) => {
          const isOpen = !!expandedGroups[group.id];
          const hasActiveChild = group.items.some((it) => it.id === activeSubMenu);

          return (
            <div
              key={group.id}
              className={`rounded-xl transition-colors ${
                hasActiveChild
                  ? 'bg-[#162B4D]/80 ring-1 ring-sky-400/20'
                  : 'hover:bg-[#132542]/60'
              }`}
            >
              {/* Group Header: Clean text only in Plus Jakarta Sans, semibold, white, no numbers, no icons */}
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                aria-expanded={isOpen}
                className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-xl transition-colors focus:outline-none ${
                  isCollapsed ? 'justify-center px-1.5' : ''
                }`}
                title={group.title}
              >
                {!isCollapsed ? (
                  <span className="text-xs sm:text-[13px] font-semibold tracking-wide text-white font-display">
                    {group.title}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-sky-200 tracking-tighter truncate">
                    {group.title.replace('SIGAP ', '')}
                  </span>
                )}

                {!isCollapsed && (
                  <span className="text-slate-400 shrink-0 ml-1">
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>
                )}
              </button>

              {/* Submenus: Simple text, no icons, active item blue, comfortable padding */}
              {!isCollapsed && isOpen && (
                <div className="px-1.5 pb-2 pt-0.5 space-y-0.5">
                  {group.items.map((sub) => {
                    const isActive = sub.id === activeSubMenu;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleMenuClick(sub.id)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all text-left ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold shadow-xs'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50 font-medium'
                        }`}
                      >
                        <span className="truncate">{sub.label}</span>
                        {sub.badge && (
                          <span
                            className={`ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-pink-500/20 text-pink-200'
                            }`}
                          >
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Fixed Bottom User Profile Area: Compact Horizontal Layout with Avatar, Name, Role & Logout */}
      <div className="shrink-0 p-3 border-t border-slate-800/90 bg-[#0B172A]">
        {!isCollapsed ? (
          isAuthenticated ? (
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shadow-sm shrink-0 ring-1 ring-sky-300/30">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate leading-snug">
                    {displayName}
                  </div>
                  <div className="text-[11px] font-medium text-sky-300 truncate leading-snug mt-0.5">
                    {displayRole}
                  </div>
                </div>
              </div>

              {/* Clear Clickable Keluar Button */}
              <button
                type="button"
                onClick={onLogoutClick}
                title="Keluar dari sesi"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-slate-700/80 hover:border-rose-500/50 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-300 truncate leading-snug">
                    Belum Masuk
                  </div>
                  <div className="text-[11px] text-slate-400 truncate leading-snug">
                    Sesi Tamu
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shrink-0 shadow-sm cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>Masuk</span>
              </button>
            </div>
          )
        ) : (
          /* Collapsed View */
          <div className="flex flex-col items-center gap-2">
            {isAuthenticated ? (
              <>
                <div
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shadow-sm ring-1 ring-sky-300/30"
                  title={`${displayName} (${displayRole})`}
                >
                  {initials}
                </div>
                <button
                  type="button"
                  onClick={onLogoutClick}
                  title="Keluar dari sesi"
                  aria-label="Keluar dari sesi"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-900/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                title="Masuk"
                aria-label="Masuk ke portal"
                className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 h-screen sticky top-0 z-30 transition-all duration-200 ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
