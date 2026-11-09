import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../types/sigap';
import { OFFICIAL_LOGO_PATH } from '../data/demoData';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (identifier: string, resolvedRole: UserRole, displayName: string) => void;
  onDemoAccess: () => void;
  onClose?: () => void;
  canClose?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLogin,
  onDemoAccess,
  onClose,
  canClose = true,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setErrorMessage('Harap masukkan ID Pengguna, Email, atau NISN Anda.');
      return;
    }

    if (!cleanPass) {
      setErrorMessage('Harap masukkan kata sandi Anda.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    // Resolve simulated role & name from user identifier (ready to replace with Supabase Auth)
    let role: UserRole = 'Kepala Sekolah';
    const lower = cleanId.toLowerCase();
    if (lower.includes('guru') || lower.includes('wali')) {
      role = 'Guru';
    } else if (lower.includes('siswa') || /^\d{8,12}$/.test(lower)) {
      role = 'Siswa';
    } else if (lower.includes('admin') || lower.includes('operator')) {
      role = 'Administrator';
    } else if (lower.includes('kepala') || lower.includes('yeni')) {
      role = 'Kepala Sekolah';
    }

    // Format clean display name from identifier or default
    let displayName = cleanId;
    if (cleanId.includes('@')) {
      const prefix = cleanId.split('@')[0];
      displayName = prefix
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    } else if (/^\d+$/.test(cleanId)) {
      displayName = `Siswa (${cleanId})`;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(cleanId, role, displayName);
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1E36]/80 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden my-auto p-6 sm:p-8">
        {/* Optional Close Button if user is already authenticated and just inspecting */}
        {canClose && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Official SMART SIGAP Logo (Unaltered, Proportional) */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#F4F8FF] border border-blue-200/80 p-2 flex items-center justify-center shadow-xs">
            <img
              src={OFFICIAL_LOGO_PATH}
              alt="Logo SMART SIGAP"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <h2
            id="login-title"
            className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display mt-4"
          >
            Selamat Datang di SMART SIGAP
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-blue-600 mt-1">
            Masuk ke Portal Sekolah
          </p>
        </div>

        {/* Validation Error Banner */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Clean, Professional Form (No demo lists, no role cards) */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="sigap-id-pengguna"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              ID Pengguna / Email / NISN
            </label>
            <div className="flex items-center bg-[#F4F8FF] border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-all">
              <User className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                id="sigap-id-pengguna"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Masukkan ID Pengguna, Email, atau NISN..."
                className="bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 w-full focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="sigap-kata-sandi"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Kata Sandi
            </label>
            <div className="flex items-center bg-[#F4F8FF] border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-all">
              <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                id="sigap-kata-sandi"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Masukkan kata sandi..."
                className="bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 w-full focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 focus:outline-none shrink-0"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2 mt-5 cursor-pointer"
          >
            <span>{isSubmitting ? 'Memproses...' : 'MASUK'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onDemoAccess}
            className="w-full py-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs sm:text-sm border border-slate-200 hover:border-blue-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>MASUK MODE PRATINJAU</span>
          </button>
        </form>

        {/* Minimalist Note for Next Stage Integration */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            SMART SIGAP · SD Negeri Karanggintung 06
          </p>
        </div>
      </div>
    </div>
  );
};
