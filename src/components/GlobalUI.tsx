import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Inbox,
} from 'lucide-react';
import { ToastMessage } from '../types/sigap';

/* ==========================================================================
   1. TOAST NOTIFICATION CONTAINER
   ========================================================================== */
export const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-[70] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const isError = t.type === 'error';
        return (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-2xl border p-4 shadow-xl flex items-start gap-3 transition-all ${
              isError
                ? 'bg-rose-950 text-white border-rose-700'
                : 'bg-[#0F1E36] text-white border-blue-500/40'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isError
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {isError ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="font-extrabold">{t.title}</div>
              <div className="text-slate-200 mt-0.5 leading-relaxed">
                {t.message}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

/* ==========================================================================
   2. CONFIRMATION DIALOG
   ========================================================================== */
export const ConfirmationDialog: React.FC<{
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const btnColors =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 text-white'
      : variant === 'warning'
      ? 'bg-amber-600 hover:bg-amber-700 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              variant === 'danger'
                ? 'bg-rose-50 text-rose-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              {title}
            </h3>
            <p className="text-xs text-slate-500">
              Konfirmasi tindakan pada penyimpanan lokal SMART SIGAP
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed bg-[#F4F8FF] p-3.5 rounded-2xl border border-blue-100">
          {description}
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${btnColors}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   3. DETAIL DRAWER (Slide-over right panel)
   ========================================================================== */
export const DetailDrawer: React.FC<{
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ isOpen, title, subtitle, onClose, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-lg h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-3 bg-[#F4F8FF]/60">
          <div>
            {subtitle && (
              <div className="text-xs font-bold text-blue-600">{subtitle}</div>
            )}
            <h3 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600"
            aria-label="Tutup panel detail"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {children}
        </div>

        {footer && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   4. MODAL DIALOG
   ========================================================================== */
export const ModalDialog: React.FC<{
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClass?: string;
}> = ({
  isOpen,
  title,
  subtitle,
  onClose,
  children,
  maxWidthClass = 'max-w-xl',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white rounded-3xl ${maxWidthClass} w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto`}
      >
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            {subtitle && (
              <div className="text-xs font-bold text-blue-600">{subtitle}</div>
            )}
            <h3 className="text-lg font-extrabold text-slate-900 font-display">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/* ==========================================================================
   5. PAGINATION BAR
   ========================================================================== */
export const PaginationBar: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}> = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  perPage,
  onPageChange,
  onPerPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="px-4 py-3 border-t border-slate-100 bg-[#F4F8FF]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3 text-slate-600">
        <span>
          Menampilkan{' '}
          <strong className="font-mono text-slate-900">
            {totalItems === 0 ? 0 : startIndex + 1}–{endIndex}
          </strong>{' '}
          dari <strong className="font-mono text-slate-900">{totalItems}</strong>{' '}
          data
        </span>

        {onPerPageChange && (
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            aria-label="Jumlah baris per halaman"
            className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold"
          >
            <option value={5}>5 / hal</option>
            <option value={10}>10 / hal</option>
            <option value={20}>20 / hal</option>
          </select>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors ${
              p === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

/* ==========================================================================
   6. SEARCH BAR, TABS, EMPTY / LOADING / ERROR STATES
   ========================================================================== */
export const SearchBarInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}> = ({ value, onChange, placeholder }) => (
  <div className="flex items-center bg-[#F4F8FF] border border-slate-200 rounded-xl px-3.5 py-2 flex-1">
    <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-transparent text-xs text-slate-800 w-full focus:outline-none"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        className="text-slate-400 hover:text-slate-600 ml-1"
        aria-label="Bersihkan pencarian"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

export const TabsNav: React.FC<{
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
}> = ({ tabs, activeTab, onChange }) => (
  <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
    {tabs.map((tab) => {
      const active = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            active
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>{tab.label}</span>
          {typeof tab.count === 'number' && (
            <span
              className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-slate-200/70 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export const LoadingStateBox: React.FC<{ label?: string }> = ({
  label = 'Memproses simulasi dokumen...',
}) => (
  <div className="p-8 rounded-3xl bg-[#F4F8FF] border border-blue-200 flex flex-col items-center justify-center text-center space-y-2.5">
    <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
    <div className="text-xs font-extrabold text-slate-900">{label}</div>
    <p className="text-[11px] text-slate-500">
      Menyusun struktur komponen Kurikulum Merdeka [DEMO]
    </p>
  </div>
);

export const EmptyStateBox: React.FC<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, description, actionLabel, onAction }) => (
  <div className="p-10 text-center space-y-2 text-xs text-slate-500">
    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-2">
      <Inbox className="w-5 h-5" />
    </div>
    <div className="font-extrabold text-slate-800 text-sm">{title}</div>
    <p className="max-w-md mx-auto">{description}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-block"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export const ErrorStateBox: React.FC<{ message: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
      <span>{message}</span>
    </div>
  );
};
