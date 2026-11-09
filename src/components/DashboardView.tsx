import React from 'react';
import {
  Users,
  GraduationCap,
  Layers,
  Cpu,
  Building2,
  Compass,
  Target,
  Award,
} from 'lucide-react';
import {
  SubMenuId,
  UserRole,
  SchoolIdentity,
  TeacherRecord,
  StudentRecord,
  RombelRecord,
  DigitalHubApp,
  AnnouncementItem,
  CalendarEvent,
  ActivityLogItem,
  CurriculumDoc,
} from '../types/sigap';
import { calculateDashboardStats } from '../utils/sigapLogic';
import { SchoolBuildingIllustration } from './ChibiIllustrations';

interface DashboardViewProps {
  currentRole: UserRole;
  schoolIdentity: SchoolIdentity;
  onUpdateBanner?: (dataUrl: string) => void;
  teachers: TeacherRecord[];
  students: StudentRecord[];
  rombel: RombelRecord[];
  digitalApps: DigitalHubApp[];
  announcements: AnnouncementItem[];
  calendarEvents: CalendarEvent[];
  activityLogs: ActivityLogItem[];
  curriculumDocs: CurriculumDoc[];
  onNavigate: (id: SubMenuId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  schoolIdentity,
  teachers,
  students,
  rombel,
  digitalApps,
  onNavigate,
}) => {
  const stats = calculateDashboardStats(
    teachers,
    students,
    rombel,
    digitalApps
  );

  // Clean Kepala Sekolah display without [DEMO] suffix if present in old localStorage
  const cleanKepalaSekolah = (
    schoolIdentity.kepalaSekolah || 'Yeni Andriyani, S.Pd.SD.'
  )
    .replace(/\s*\[DEMO\]/gi, '')
    .trim();

  const misiItems = (schoolIdentity.misiSekolah || '')
    .split('\n')
    .map((m) => m.trim())
    .filter(Boolean);

  const tujuanItems = (schoolIdentity.tujuanSekolah || '')
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6 pb-10">
      {/* 1. BANNER UTAMA DASHBOARD */}
      <section className="relative rounded-3xl overflow-hidden border border-blue-200/80 bg-[#0F1E36] shadow-sm">
        <div className="relative h-64 sm:h-72 lg:h-80 w-full">
          {schoolIdentity.bannerImageUrl ? (
            <img
              src={schoolIdentity.bannerImageUrl}
              alt="Foto Banner Resmi SD Negeri Karanggintung 06"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <SchoolBuildingIllustration className="w-full h-full" />
          )}

          {/* Soft gradient scrim for legible typography */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#091326]/95 via-[#0F1E36]/45 to-transparent" />

          {/* Bottom-Left Main Title & Supporting Text (No upload/settings buttons on banner) */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/15 backdrop-blur-xs border border-white/20 text-[11px] font-semibold text-sky-200 mb-2">
              <span>Tahun Ajaran {schoolIdentity.tahunAjaranAktif}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display text-white">
              Selamat Datang di SMART SIGAP
            </h2>
            <p className="text-sm sm:text-base font-medium text-sky-100/95 mt-1">
              Portal Digital SD Negeri Karanggintung 06
            </p>
          </div>
        </div>
      </section>

      {/* 2. IDENTITAS SEKOLAH */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wide font-display uppercase">
            IDENTITAS SEKOLAH
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="p-4 rounded-2xl bg-[#F4F8FF] border border-blue-100/80">
            <div className="text-xs font-medium text-slate-500">
              Nama Sekolah
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              {schoolIdentity.namaSekolah}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F8FF] border border-blue-100/80">
            <div className="text-xs font-medium text-slate-500">
              Status Sekolah
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              {schoolIdentity.statusSekolah}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F8FF] border border-blue-100/80">
            <div className="text-xs font-medium text-slate-500">
              Kepala Sekolah
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              {cleanKepalaSekolah}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F8FF] border border-blue-100/80">
            <div className="text-xs font-medium text-slate-500">
              Tahun Ajaran
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              {schoolIdentity.tahunAjaranAktif}
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATISTIK SEKOLAH (Minimalis: Fokus Angka, Ikon Sederhana, Label Pendek, Penanda DEMO) */}
      <section aria-label="Statistik Sekolah">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('data-guru')}
            className="text-left bg-white hover:bg-blue-50/40 rounded-3xl p-5 border border-slate-200/90 shadow-xs transition-all flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  Total Guru
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                  DEMO
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                {stats.totalGuru}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('data-siswa')}
            className="text-left bg-white hover:bg-blue-50/40 rounded-3xl p-5 border border-slate-200/90 shadow-xs transition-all flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  Total Siswa
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-50 text-pink-600">
                  DEMO
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                {stats.totalSiswa}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('data-rombel')}
            className="text-left bg-white hover:bg-blue-50/40 rounded-3xl p-5 border border-slate-200/90 shadow-xs transition-all flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  Total Rombel
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">
                  DEMO
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                {stats.totalRombel}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('manajemen-aplikasi')}
            className="text-left bg-white hover:bg-blue-50/40 rounded-3xl p-5 border border-slate-200/90 shadow-xs transition-all flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  Aplikasi Digital Aktif
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                {stats.activeApps}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
          </button>
        </div>
      </section>

      {/* 4. ARAH DAN TUJUAN SEKOLAH (Visi, Misi, dan Tujuan Sekolah) */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wide font-display uppercase">
            ARAH DAN TUJUAN SEKOLAH
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* A. VISI SEKOLAH */}
          <div className="rounded-2xl bg-[#F4F8FF] border border-blue-100/90 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 font-display uppercase">
                  VISI SEKOLAH
                </h4>
              </div>

              {schoolIdentity.visiSekolah &&
              schoolIdentity.visiSekolah.trim() ? (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {schoolIdentity.visiSekolah}
                </p>
              ) : (
                <div className="rounded-xl border border-dashed border-blue-200 bg-white/80 p-4 text-xs text-slate-500 leading-relaxed">
                  Belum ada data visi resmi sekolah yang dimasukkan. Silakan
                  tambahkan rumusan Visi Sekolah melalui menu{' '}
                  <strong className="text-slate-700">
                    SIGAP CONTROL CENTER → Identitas &amp; Banner Sekolah
                  </strong>
                  .
                </div>
              )}
            </div>
          </div>

          {/* B. MISI SEKOLAH */}
          <div className="rounded-2xl bg-[#F4F8FF] border border-blue-100/90 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 font-display uppercase">
                  MISI SEKOLAH
                </h4>
              </div>

              {misiItems.length > 0 ? (
                <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {misiItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              ) : (
                <div className="rounded-xl border border-dashed border-blue-200 bg-white/80 p-4 text-xs text-slate-500 leading-relaxed">
                  Belum ada daftar misi resmi sekolah yang dimasukkan. Silakan
                  tambahkan daftar Misi Sekolah melalui menu{' '}
                  <strong className="text-slate-700">
                    SIGAP CONTROL CENTER → Identitas &amp; Banner Sekolah
                  </strong>
                  .
                </div>
              )}
            </div>
          </div>

          {/* C. TUJUAN SEKOLAH */}
          <div className="rounded-2xl bg-[#F4F8FF] border border-blue-100/90 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 font-display uppercase">
                  TUJUAN SEKOLAH
                </h4>
              </div>

              {tujuanItems.length > 0 ? (
                <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {tujuanItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              ) : (
                <div className="rounded-xl border border-dashed border-blue-200 bg-white/80 p-4 text-xs text-slate-500 leading-relaxed">
                  Belum ada data tujuan pendidikan sekolah yang dimasukkan.
                  Silakan tambahkan Tujuan Sekolah melalui menu{' '}
                  <strong className="text-slate-700">
                    SIGAP CONTROL CENTER → Identitas &amp; Banner Sekolah
                  </strong>
                  .
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
