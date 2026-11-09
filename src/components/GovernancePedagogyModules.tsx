import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  FileText,
  Megaphone,
  Plus,
  BookOpenCheck,
  Sparkles,
  CheckCircle2,
  Printer,
  Eye,
  Edit3,
  Download,
  Trash2,
  History,
} from 'lucide-react';
import {
  SubMenuId,
  CalendarEvent,
  ScheduleItem,
  TeacherJournal,
  AnnouncementItem,
  CurriculumDoc,
  GeneratedRppResult,
} from '../types/sigap';
import { generateModulAjar, paginateItems } from '../utils/sigapLogic';
import { downloadRppAsDocx } from '../utils/docxExport';
import {
  ConfirmationDialog,
  DetailDrawer,
  ModalDialog,
  PaginationBar,
  SearchBarInput,
  LoadingStateBox,
  EmptyStateBox,
  ErrorStateBox,
} from './GlobalUI';

/* ==========================================================================
   5. SIGAP GOVERNANCE MODULES (Tahap 3: Tambah, Edit, Hapus + Konfirmasi,
      Tanggal & Jam Dapat Diatur, Detail Drawer)
   ========================================================================== */
export const GovernanceModules: React.FC<{
  subMenuId: SubMenuId;
  calendarEvents: CalendarEvent[];
  onSaveCalendarEvent: (ev: CalendarEvent, isEdit: boolean) => void;
  onDeleteCalendarEvent: (id: string) => void;
  schedules: ScheduleItem[];
  onSaveSchedule: (sc: ScheduleItem, isEdit: boolean) => void;
  onDeleteSchedule: (id: string) => void;
  journals: TeacherJournal[];
  onSaveJournal: (jr: TeacherJournal, isEdit: boolean) => void;
  onDeleteJournal: (id: string) => void;
  announcements: AnnouncementItem[];
  onSaveAnnouncement: (ann: AnnouncementItem, isEdit: boolean) => void;
  onDeleteAnnouncement: (id: string) => void;
}> = ({
  subMenuId,
  calendarEvents,
  onSaveCalendarEvent,
  onDeleteCalendarEvent,
  schedules,
  onSaveSchedule,
  onDeleteSchedule,
  journals,
  onSaveJournal,
  onDeleteJournal,
  announcements,
  onSaveAnnouncement,
  onDeleteAnnouncement,
}) => {
  // Kalender state
  const [selectedMonth, setSelectedMonth] = useState<'2026-11' | '2026-12'>(
    '2026-11'
  );
  const [editingEv, setEditingEv] = useState<CalendarEvent | null>(null);
  const [confirmDeleteEv, setConfirmDeleteEv] = useState<CalendarEvent | null>(
    null
  );
  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('2026-11-28');
  const [evTime, setEvTime] = useState('07:30 - 11:00 WIB');
  const [evCategory, setEvCategory] =
    useState<CalendarEvent['category']>('Akademik');
  const [evDesc, setEvDesc] = useState('');
  const [evError, setEvError] = useState('');

  // Jadwal state
  const [selectedHari, setSelectedHari] = useState<string>('Semua');
  const [editingSc, setEditingSc] = useState<ScheduleItem | null>(null);
  const [confirmDeleteSc, setConfirmDeleteSc] = useState<ScheduleItem | null>(
    null
  );
  const [scHari, setScHari] = useState<ScheduleItem['hari']>('Senin');
  const [scJamKe, setScJamKe] = useState('Jam 1 - 2');
  const [scWaktu, setScWaktu] = useState('07:00 - 08:10');
  const [scRombel, setScRombel] = useState('Kelas IV');
  const [scMapel, setScMapel] = useState('Bahasa Indonesia');
  const [scGuru, setScGuru] = useState('Nadia Permatasari, S.Pd. [DEMO]');
  const [scRuang, setScRuang] = useState('Ruang Kelas 4A');

  // Jurnal state
  const [journalSearch, setJournalSearch] = useState('');
  const [selectedJournal, setSelectedJournal] = useState<TeacherJournal | null>(
    null
  );
  const [editingJr, setEditingJr] = useState<TeacherJournal | null>(null);
  const [confirmDeleteJr, setConfirmDeleteJr] = useState<TeacherJournal | null>(
    null
  );
  const [jrTanggal, setJrTanggal] = useState('2026-11-06');
  const [jrJam, setJrJam] = useState('08:10 - 09:55');
  const [jrRombel, setJrRombel] = useState('Kelas IV');
  const [jrMapel, setJrMapel] = useState('IPAS');
  const [jrGuru, setJrGuru] = useState('Nadia Permatasari, S.Pd. [DEMO]');
  const [jrTopik, setJrTopik] = useState('');
  const [jrMetode, setJrMetode] = useState('Diskusi Kelompok & Eksperimen');
  const [jrHadir, setJrHadir] = useState(28);
  const [jrIzin, setJrIzin] = useState(0);
  const [jrCatatan, setJrCatatan] = useState('');

  // Pengumuman state
  const [annCategoryFilter, setAnnCategoryFilter] = useState('Semua');
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementItem | null>(null);
  const [editingAnn, setEditingAnn] = useState<AnnouncementItem | null>(null);
  const [confirmDeleteAnn, setConfirmDeleteAnn] =
    useState<AnnouncementItem | null>(null);
  const [annTitle, setAnnTitle] = useState('');
  const [annDate, setAnnDate] = useState('2026-11-06');
  const [annTime, setAnnTime] = useState('08:00 WIB');
  const [annCat, setAnnCat] =
    useState<AnnouncementItem['category']>('Pengumuman Resmi');
  const [annSummary, setAnnSummary] = useState('');

  /* ------------------- 1. KALENDER AKADEMIK ------------------- */
  if (subMenuId === 'kalender-akademik') {
    const startEditEv = (ev: CalendarEvent) => {
      setEditingEv(ev);
      setEvTitle(ev.title);
      setEvDate(ev.date);
      setEvTime(ev.time || '07:30 - 11:00 WIB');
      setEvCategory(ev.category);
      setEvDesc(ev.description);
      setEvError('');
    };

    const resetEvForm = () => {
      setEditingEv(null);
      setEvTitle('');
      setEvDate('2026-11-28');
      setEvTime('07:30 - 11:00 WIB');
      setEvCategory('Akademik');
      setEvDesc('');
      setEvError('');
    };

    const handleSaveEvent = (e: React.FormEvent) => {
      e.preventDefault();
      if (!evTitle.trim()) {
        setEvError('Nama kegiatan kalender wajib diisi.');
        return;
      }
      onSaveCalendarEvent(
        {
          id: editingEv
            ? editingEv.id
            : `CAL-${Date.now().toString().slice(-4)}`,
          title: evTitle.trim().includes('[DEMO]')
            ? evTitle.trim()
            : `${evTitle.trim()} [DEMO]`,
          date: evDate,
          time: evTime.trim() || '07:30 WIB',
          category: evCategory,
          description:
            evDesc.trim() || 'Agenda resmi sekolah tahun ajaran berjalan.',
          isDemo: true,
        },
        Boolean(editingEv)
      );
      resetEvForm();
    };

    const daysInMonth = 30;
    const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-purple-600">
                03. SIGAP GOVERNANCE · Kalender Pendidikan Bulanan Interaktif
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 font-display">
                Kalender Akademik SD Negeri Karanggintung 06 [DEMO]
              </h2>
              <p className="text-xs text-slate-500">
                Kelola tambah, edit, dan hapus kegiatan kalender akademik dengan tanggal dan jam yang dapat diatur.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
            {(['2026-11', '2026-12'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedMonth === m
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                {m === '2026-11' ? 'November 2026' : 'Desember 2026'}
              </button>
            ))}
          </div>
        </div>

        {/* Monthly Calendar Visual Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Matriks Kalender Bulanan —{' '}
              {selectedMonth === '2026-11' ? 'November 2026' : 'Desember 2026'}
            </h3>
            <span className="text-xs text-slate-500">
              Klik kegiatan di daftar bawah untuk mengedit atau menghapus [DEMO]
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-slate-500 mb-2">
            <div>Min</div>
            <div>Sen</div>
            <div>Sel</div>
            <div>Rab</div>
            <div>Kam</div>
            <div>Jum</div>
            <div>Sab</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {dayNumbers.map((day) => {
              const dateIso = `${selectedMonth}-${String(day).padStart(2, '0')}`;
              const matchingEvents = calendarEvents.filter((ev) =>
                ev.date.startsWith(dateIso)
              );
              const hasEvent = matchingEvents.length > 0;
              return (
                <div
                  key={day}
                  className={`min-h-[68px] p-2 rounded-2xl border text-left transition-all ${
                    hasEvent
                      ? 'bg-blue-50/90 border-blue-400 shadow-2xs'
                      : 'bg-[#F4F8FF]/50 border-slate-200/70'
                  }`}
                >
                  <div
                    className={`text-xs font-mono font-extrabold ${
                      hasEvent ? 'text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    {day}
                  </div>
                  {matchingEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => startEditEv(ev)}
                      className="mt-1 text-[10px] font-semibold text-blue-800 leading-tight line-clamp-2 cursor-pointer hover:underline"
                      title={ev.title}
                    >
                      • {ev.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Daftar Rincian Agenda Kalender Akademik ({calendarEvents.length}{' '}
              Kegiatan)
            </h3>
            <div className="divide-y divide-slate-100">
              {calendarEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="px-3 py-2 rounded-2xl bg-[#F4F8FF] border border-blue-100 text-xs font-mono font-bold text-blue-700 shrink-0">
                      <div>{ev.date}</div>
                      {ev.time && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {ev.time}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-purple-700">
                        {ev.category}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {ev.title}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {ev.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => startEditEv(ev)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteEv(ev)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSaveEvent}
            className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3.5 self-start text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                {editingEv
                  ? 'Edit Kegiatan Kalender'
                  : 'Tambah Kegiatan Kalender'}
              </h3>
              {editingEv && (
                <button
                  type="button"
                  onClick={resetEvForm}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Batal Edit
                </button>
              )}
            </div>
            <ErrorStateBox message={evError} />
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Kegiatan / Agenda *
              </label>
              <input
                type="text"
                value={evTitle}
                onChange={(e) => setEvTitle(e.target.value)}
                placeholder="Contoh: Rapat Pleno Kenaikan Kelas"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tanggal Kegiatan
                </label>
                <input
                  type="date"
                  value={evDate}
                  onChange={(e) => setEvDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jam Pelaksanaan
                </label>
                <input
                  type="text"
                  value={evTime}
                  onChange={(e) => setEvTime(e.target.value)}
                  placeholder="07:30 - 11:00 WIB"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kategori Kegiatan
              </label>
              <select
                value={evCategory}
                onChange={(e) =>
                  setEvCategory(e.target.value as CalendarEvent['category'])
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                <option value="Akademik">Akademik</option>
                <option value="Asesmen">Asesmen</option>
                <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                <option value="Libur Nasional">Libur Nasional</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Keterangan
              </label>
              <textarea
                rows={3}
                value={evDesc}
                onChange={(e) => setEvDesc(e.target.value)}
                placeholder="Rincian pelaksanaan agenda..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>
                {editingEv ? 'Simpan Perubahan Agenda' : 'Simpan Agenda Kalender'}
              </span>
            </button>
          </form>
        </div>

        <ConfirmationDialog
          isOpen={Boolean(confirmDeleteEv)}
          title="Konfirmasi Hapus Agenda Kalender"
          description={`Apakah Anda yakin ingin menghapus kegiatan "${confirmDeleteEv?.title}" (${confirmDeleteEv?.date})?`}
          confirmLabel="Ya, Hapus Kegiatan"
          onCancel={() => setConfirmDeleteEv(null)}
          onConfirm={() => {
            if (confirmDeleteEv) {
              onDeleteCalendarEvent(confirmDeleteEv.id);
              setConfirmDeleteEv(null);
            }
          }}
        />
      </div>
    );
  }

  /* ------------------- 2. JADWAL PEMBELAJARAN ------------------- */
  if (subMenuId === 'jadwal-pembelajaran') {
    const filteredSchedule =
      selectedHari === 'Semua'
        ? schedules
        : schedules.filter((s) => s.hari === selectedHari);

    const startEditSc = (item: ScheduleItem) => {
      setEditingSc(item);
      setScHari(item.hari);
      setScJamKe(item.jamKe);
      setScWaktu(item.waktu);
      setScRombel(item.rombel);
      setScMapel(item.mataPelajaran);
      setScGuru(item.guru);
      setScRuang(item.ruangan);
    };

    const resetScForm = () => {
      setEditingSc(null);
      setScHari('Senin');
      setScJamKe('Jam 1 - 2');
      setScWaktu('07:00 - 08:10');
      setScRombel('Kelas IV');
      setScMapel('Bahasa Indonesia');
      setScGuru('Nadia Permatasari, S.Pd. [DEMO]');
      setScRuang('Ruang Kelas 4A');
    };

    const handleSaveSc = (e: React.FormEvent) => {
      e.preventDefault();
      if (!scMapel.trim()) return;
      onSaveSchedule(
        {
          id: editingSc
            ? editingSc.id
            : `JD-${Date.now().toString().slice(-4)}`,
          hari: scHari,
          jamKe: scJamKe.trim() || 'Jam 1 - 2',
          waktu: scWaktu.trim() || '07:00 - 08:10',
          rombel: scRombel,
          mataPelajaran: scMapel.trim(),
          guru: scGuru.trim() || 'Guru Pengampu [DEMO]',
          ruangan: scRuang.trim() || `Ruang ${scRombel}`,
        },
        Boolean(editingSc)
      );
      resetScForm();
    };

    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-600">
                03. SIGAP GOVERNANCE · Tabel Jadwal Mingguan Kelas I - VI
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 font-display">
                Jadwal Pembelajaran SD Negeri Karanggintung 06 [DEMO]
              </h2>
              <p className="text-xs text-slate-500">
                Kelola tambah, edit, dan hapus jadwal pelajaran beserta jam pembelajaran.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
            {['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(
              (h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setSelectedHari(h)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedHari === h
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  {h}
                </button>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F4F8FF] border-b border-slate-200 font-bold text-slate-600">
                    <th className="py-3.5 px-4">Hari &amp; Jam</th>
                    <th className="py-3.5 px-4">Waktu</th>
                    <th className="py-3.5 px-4">Rombel / Ruang</th>
                    <th className="py-3.5 px-4">Mata Pelajaran &amp; Guru</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchedule.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {item.hari}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.jamKe}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                        {item.waktu}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-blue-700">
                          {item.rombel}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.ruangan}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">
                          {item.mataPelajaran}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.guru}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEditSc(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteSc(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSchedule.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-slate-500"
                      >
                        Belum ada jadwal pada hari {selectedHari}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <form
            onSubmit={handleSaveSc}
            className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs self-start"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                {editingSc ? 'Edit Slot Jadwal' : 'Tambah Slot Jadwal'}
              </h3>
              {editingSc && (
                <button
                  type="button"
                  onClick={resetScForm}
                  className="text-slate-500 font-bold"
                >
                  Batal
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hari
                </label>
                <select
                  value={scHari}
                  onChange={(e) =>
                    setScHari(e.target.value as ScheduleItem['hari'])
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                >
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jam Ke-
                </label>
                <input
                  type="text"
                  value={scJamKe}
                  onChange={(e) => setScJamKe(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Rentang Waktu
                </label>
                <input
                  type="text"
                  value={scWaktu}
                  onChange={(e) => setScWaktu(e.target.value)}
                  placeholder="07:00 - 08:10"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Rombel
                </label>
                <select
                  value={scRombel}
                  onChange={(e) => setScRombel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                >
                  <option value="Kelas I">Kelas I</option>
                  <option value="Kelas II">Kelas II</option>
                  <option value="Kelas III">Kelas III</option>
                  <option value="Kelas IV">Kelas IV</option>
                  <option value="Kelas V">Kelas V</option>
                  <option value="Kelas VI">Kelas VI</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mata Pelajaran *
              </label>
              <input
                type="text"
                value={scMapel}
                onChange={(e) => setScMapel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Guru Pengampu
              </label>
              <input
                type="text"
                value={scGuru}
                onChange={(e) => setScGuru(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {editingSc ? 'Simpan Perubahan Jadwal' : 'Tambahkan ke Jadwal'}
            </button>
          </form>
        </div>

        <ConfirmationDialog
          isOpen={Boolean(confirmDeleteSc)}
          title="Konfirmasi Hapus Jadwal Pembelajaran"
          description={`Apakah Anda yakin ingin menghapus jadwal "${confirmDeleteSc?.mataPelajaran}" (${confirmDeleteSc?.hari}, ${confirmDeleteSc?.rombel})?`}
          confirmLabel="Ya, Hapus Jadwal"
          onCancel={() => setConfirmDeleteSc(null)}
          onConfirm={() => {
            if (confirmDeleteSc) {
              onDeleteSchedule(confirmDeleteSc.id);
              setConfirmDeleteSc(null);
            }
          }}
        />
      </div>
    );
  }

  /* ------------------- 3. JURNAL AKTIVITAS GURU ------------------- */
  if (subMenuId === 'jurnal-guru') {
    const filteredJournals = journals.filter(
      (j) =>
        !journalSearch.trim() ||
        j.topikMateri.toLowerCase().includes(journalSearch.toLowerCase()) ||
        j.guru.toLowerCase().includes(journalSearch.toLowerCase()) ||
        j.rombel.toLowerCase().includes(journalSearch.toLowerCase())
    );

    const startEditJr = (jr: TeacherJournal) => {
      setEditingJr(jr);
      setJrTanggal(jr.tanggal);
      setJrJam(jr.jamPembelajaran || '08:10 - 09:55');
      setJrRombel(jr.rombel);
      setJrMapel(jr.mataPelajaran);
      setJrGuru(jr.guru);
      setJrTopik(jr.topikMateri);
      setJrMetode(jr.metode);
      setJrHadir(jr.hadir);
      setJrIzin(jr.izinSakit);
      setJrCatatan(jr.catatanRefleksi);
    };

    const resetJrForm = () => {
      setEditingJr(null);
      setJrTanggal('2026-11-06');
      setJrJam('08:10 - 09:55');
      setJrTopik('');
      setJrCatatan('');
    };

    const handleSaveJr = (e: React.FormEvent) => {
      e.preventDefault();
      if (!jrTopik.trim()) return;
      onSaveJournal(
        {
          id: editingJr
            ? editingJr.id
            : `JR-${Date.now().toString().slice(-4)}`,
          tanggal: jrTanggal,
          jamPembelajaran: jrJam,
          rombel: jrRombel,
          mataPelajaran: jrMapel,
          guru: jrGuru,
          topikMateri: jrTopik.trim(),
          metode: jrMetode,
          hadir: Number(jrHadir) || 28,
          izinSakit: Number(jrIzin) || 0,
          catatanRefleksi:
            jrCatatan.trim() || 'Pembelajaran berjalan kondusif dan interaktif.',
          isDemo: true,
        },
        Boolean(editingJr)
      );
      resetJrForm();
    };

    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-sky-600">
                03. SIGAP GOVERNANCE · Tabel Jurnal Mengajar Harian
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 font-display">
                Jurnal Aktivitas Guru &amp; Refleksi Kelas [DEMO]
              </h2>
              <p className="text-xs text-slate-500">
                Tambah, edit, lihat detail, dan hapus jurnal mengajar harian dengan pengaturan tanggal dan jam.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-80">
            <SearchBarInput
              value={journalSearch}
              onChange={setJournalSearch}
              placeholder="Cari topik, guru, atau kelas..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F4F8FF] border-b border-slate-200 font-bold text-slate-600">
                    <th className="py-3.5 px-4">Tanggal &amp; Jam</th>
                    <th className="py-3.5 px-4">Kelas &amp; Mapel</th>
                    <th className="py-3.5 px-4">Topik Materi &amp; Guru</th>
                    <th className="py-3.5 px-4">Presensi</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJournals.map((jr) => (
                    <tr key={jr.id} className="hover:bg-blue-50/30">
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                        <div className="font-bold">{jr.tanggal}</div>
                        <div className="text-[11px] text-slate-500">
                          {jr.jamPembelajaran || '07:00 - 08:45'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-blue-700">
                          {jr.rombel}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {jr.mataPelajaran}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {jr.topikMateri}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {jr.guru} · {jr.metode}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums whitespace-nowrap">
                        <span className="text-emerald-700 font-bold">
                          H: {jr.hadir}
                        </span>{' '}
                        / <span className="text-amber-700">I/S: {jr.izinSakit}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedJournal(jr)}
                            className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 font-semibold inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditJr(jr)}
                            className="px-2 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteJr(jr)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <form
            onSubmit={handleSaveJr}
            className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs self-start"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                {editingJr ? 'Edit Jurnal Mengajar' : 'Input Jurnal Mengajar'}
              </h3>
              {editingJr && (
                <button
                  type="button"
                  onClick={resetJrForm}
                  className="text-slate-500 font-bold"
                >
                  Batal
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={jrTanggal}
                  onChange={(e) => setJrTanggal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jam Pembelajaran
                </label>
                <input
                  type="text"
                  value={jrJam}
                  onChange={(e) => setJrJam(e.target.value)}
                  placeholder="08:10 - 09:55"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Rombel
                </label>
                <select
                  value={jrRombel}
                  onChange={(e) => setJrRombel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                >
                  <option value="Kelas I">Kelas I</option>
                  <option value="Kelas II">Kelas II</option>
                  <option value="Kelas III">Kelas III</option>
                  <option value="Kelas IV">Kelas IV</option>
                  <option value="Kelas V">Kelas V</option>
                  <option value="Kelas VI">Kelas VI</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={jrMapel}
                  onChange={(e) => setJrMapel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Topik / Materi Pembelajaran *
              </label>
              <input
                type="text"
                value={jrTopik}
                onChange={(e) => setJrTopik(e.target.value)}
                placeholder="Contoh: Siklus Air dan Pelestarian Lingkungan"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Siswa Hadir
                </label>
                <input
                  type="number"
                  value={jrHadir}
                  onChange={(e) => setJrHadir(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Izin / Sakit
                </label>
                <input
                  type="number"
                  value={jrIzin}
                  onChange={(e) => setJrIzin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Refleksi &amp; Tindak Lanjut
              </label>
              <textarea
                rows={3}
                value={jrCatatan}
                onChange={(e) => setJrCatatan(e.target.value)}
                placeholder="Catatan ketercapaian belajar siswa hari ini..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {editingJr ? 'Simpan Perubahan Jurnal' : 'Simpan Jurnal Mengajar'}
            </button>
          </form>
        </div>

        <DetailDrawer
          isOpen={Boolean(selectedJournal)}
          title={selectedJournal?.topikMateri || ''}
          subtitle={`Detail Jurnal Guru · ${selectedJournal?.tanggal} (${
            selectedJournal?.jamPembelajaran || '07:00 WIB'
          })`}
          onClose={() => setSelectedJournal(null)}
        >
          {selectedJournal && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#F4F8FF]">
                <strong>Kelas &amp; Mata Pelajaran:</strong>{' '}
                {selectedJournal.rombel} · {selectedJournal.mataPelajaran}
              </div>
              <div className="p-3 rounded-xl bg-[#F4F8FF]">
                <strong>Guru Pengampu &amp; Metode:</strong>{' '}
                {selectedJournal.guru} ({selectedJournal.metode})
              </div>
              <div className="p-3 rounded-xl bg-[#F4F8FF]">
                <strong>Kehadiran:</strong> Hadir {selectedJournal.hadir} siswa ·
                Izin/Sakit {selectedJournal.izinSakit} siswa
              </div>
              <div className="p-3 rounded-xl bg-[#F4F8FF] leading-relaxed">
                <strong>Catatan Refleksi Pembelajaran:</strong>
                <p className="mt-1 text-slate-700">
                  {selectedJournal.catatanRefleksi}
                </p>
              </div>
            </div>
          )}
        </DetailDrawer>

        <ConfirmationDialog
          isOpen={Boolean(confirmDeleteJr)}
          title="Konfirmasi Hapus Jurnal Guru"
          description={`Apakah Anda yakin ingin menghapus jurnal mengajar "${confirmDeleteJr?.topikMateri}" (${confirmDeleteJr?.rombel})?`}
          confirmLabel="Ya, Hapus Jurnal"
          onCancel={() => setConfirmDeleteJr(null)}
          onConfirm={() => {
            if (confirmDeleteJr) {
              onDeleteJournal(confirmDeleteJr.id);
              setConfirmDeleteJr(null);
            }
          }}
        />
      </div>
    );
  }

  /* ------------------- 4. INFORMASI & PENGUMUMAN ------------------- */
  const filteredAnnouncements =
    annCategoryFilter === 'Semua'
      ? announcements
      : announcements.filter((a) => a.category === annCategoryFilter);

  const startEditAnn = (ann: AnnouncementItem) => {
    setEditingAnn(ann);
    setAnnTitle(ann.title);
    setAnnDate(ann.date);
    setAnnTime(ann.time || '08:00 WIB');
    setAnnCat(ann.category);
    setAnnSummary(ann.summary);
  };

  const resetAnnForm = () => {
    setEditingAnn(null);
    setAnnTitle('');
    setAnnDate('2026-11-06');
    setAnnTime('08:00 WIB');
    setAnnCat('Pengumuman Resmi');
    setAnnSummary('');
  };

  const handleSaveAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim()) return;
    onSaveAnnouncement(
      {
        id: editingAnn
          ? editingAnn.id
          : `INF-${Date.now().toString().slice(-4)}`,
        title: annTitle.trim().includes('[DEMO]')
          ? annTitle.trim()
          : `${annTitle.trim()} [DEMO]`,
        date: annDate,
        time: annTime,
        category: annCat,
        author: 'Kepala Sekolah / Admin',
        summary:
          annSummary.trim() || 'Pengumuman resmi SD Negeri Karanggintung 06.',
        priority: 'Utama',
        isDemo: true,
      },
      Boolean(editingAnn)
    );
    resetAnnForm();
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-600">
              03. SIGAP GOVERNANCE · Papan Informasi Publik Sekolah
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              Informasi &amp; Pengumuman SD Negeri Karanggintung 06 [DEMO]
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            'Semua',
            'Pengumuman Resmi',
            'Edaran Wali Murid',
            'Agenda Guru',
            'Prestasi',
          ].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setAnnCategoryFilter(c)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                annCategoryFilter === c
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          {filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="font-bold text-blue-700">{ann.category}</span>
                  <span>·</span>
                  <span>
                    {ann.date} {ann.time ? `(${ann.time})` : ''}
                  </span>
                  <span>·</span>
                  <span>Oleh: {ann.author}</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1 font-display">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {ann.summary}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedAnnouncement(ann)}
                  className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Baca Detail Pengumuman</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => startEditAnn(ann)}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteAnn(ann)}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSaveAnn}
          className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs self-start"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              {editingAnn
                ? 'Edit Pengumuman Sekolah'
                : 'Terbitkan Pengumuman Baru'}
            </h3>
            {editingAnn && (
              <button
                type="button"
                onClick={resetAnnForm}
                className="text-slate-500 font-bold"
              >
                Batal
              </button>
            )}
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Judul Pengumuman / Edaran *
            </label>
            <input
              type="text"
              value={annTitle}
              onChange={(e) => setAnnTitle(e.target.value)}
              placeholder="Contoh: Jadwal Ekstrakurikuler Pramuka Siaga"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tanggal Terbit
              </label>
              <input
                type="date"
                value={annDate}
                onChange={(e) => setAnnDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jam Terbit
              </label>
              <input
                type="text"
                value={annTime}
                onChange={(e) => setAnnTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Kategori
            </label>
            <select
              value={annCat}
              onChange={(e) =>
                setAnnCat(e.target.value as AnnouncementItem['category'])
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
            >
              <option value="Pengumuman Resmi">Pengumuman Resmi</option>
              <option value="Edaran Wali Murid">Edaran Wali Murid</option>
              <option value="Agenda Guru">Agenda Guru</option>
              <option value="Prestasi">Prestasi</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Isi Ringkasan Pengumuman
            </label>
            <textarea
              rows={4}
              value={annSummary}
              onChange={(e) => setAnnSummary(e.target.value)}
              placeholder="Tuliskan isi edaran secara ringkas dan jelas..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            {editingAnn
              ? 'Simpan Perubahan Pengumuman'
              : 'Publikasikan Pengumuman'}
          </button>
        </form>
      </div>

      <DetailDrawer
        isOpen={Boolean(selectedAnnouncement)}
        title={selectedAnnouncement?.title || ''}
        subtitle={`${selectedAnnouncement?.category} · ${selectedAnnouncement?.date}`}
        onClose={() => setSelectedAnnouncement(null)}
      >
        {selectedAnnouncement && (
          <div className="space-y-3">
            <p className="text-slate-700 leading-relaxed bg-[#F4F8FF] p-4 rounded-2xl">
              {selectedAnnouncement.summary}
            </p>
            <div className="text-slate-500">
              Diterbitkan oleh: <strong>{selectedAnnouncement.author}</strong>
            </div>
          </div>
        )}
      </DetailDrawer>

      <ConfirmationDialog
        isOpen={Boolean(confirmDeleteAnn)}
        title="Konfirmasi Hapus Pengumuman"
        description={`Apakah Anda yakin ingin menghapus pengumuman "${confirmDeleteAnn?.title}"?`}
        confirmLabel="Ya, Hapus Pengumuman"
        onCancel={() => setConfirmDeleteAnn(null)}
        onConfirm={() => {
          if (confirmDeleteAnn) {
            onDeleteAnnouncement(confirmDeleteAnn.id);
            setConfirmDeleteAnn(null);
          }
        }}
      />
    </div>
  );
};

/* ==========================================================================
   6 & 7. SIGAP PEDAGOGY + AI CURRICULUM ASSISTANT (12 Input Generator,
      Loading Animation, Editor Hasil, Riwayat Lokal, Unduh .docx Asli)
   ========================================================================== */
export const PedagogyModules: React.FC<{
  subMenuId: SubMenuId;
  curriculumDocs: CurriculumDoc[];
  onSaveCurriculumDoc: (doc: CurriculumDoc, isEdit: boolean) => void;
  onDeleteCurriculumDoc: (id: string) => void;
  rppHistory: GeneratedRppResult[];
  onSaveRppHistory: (rpp: GeneratedRppResult) => void;
  onDeleteRppHistory: (id: string) => void;
  onNavigate: (id: SubMenuId) => void;
  onNotify?: (title: string, message: string, type?: 'success' | 'error') => void;
}> = ({
  subMenuId,
  curriculumDocs,
  onSaveCurriculumDoc,
  onDeleteCurriculumDoc,
  rppHistory,
  onSaveRppHistory,
  onDeleteRppHistory,
  onNavigate,
  onNotify,
}) => {
  const [faseFilter, setFaseFilter] = useState<string>('Semua');
  const [docSearch, setDocSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState<CurriculumDoc | null>(null);
  const [editingDoc, setEditingDoc] = useState<CurriculumDoc | null>(null);
  const [confirmDeleteDoc, setConfirmDeleteDoc] =
    useState<CurriculumDoc | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Add/Edit form state for Pedagogy Docs
  const [newJudul, setNewJudul] = useState('');
  const [newKode, setNewKode] = useState('');
  const [newMapel, setNewMapel] = useState('IPAS');
  const [newKelas, setNewKelas] = useState('Kelas IV');
  const [newFase, setNewFase] = useState<CurriculumDoc['fase']>('Fase B');
  const [newSemester, setNewSemester] =
    useState<CurriculumDoc['semester']>('Ganjil');
  const [newTipe, setNewTipe] = useState<CurriculumDoc['tipe']>('Modul Ajar');
  const [newPenyusun, setNewPenyusun] = useState(
    'Nadia Permatasari, S.Pd. [DEMO]'
  );
  const [newRingkasan, setNewRingkasan] = useState('');

  // AI Curriculum Assistant Generator state (All 12 requested inputs)
  const [rppKelas, setRppKelas] = useState('Kelas IV');
  const [rppFase, setRppFase] = useState('Fase B');
  const [rppMapel, setRppMapel] = useState(
    'IPAS (Ilmu Pengetahuan Alam dan Sosial)'
  );
  const [rppSemester, setRppSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [rppTopik, setRppTopik] = useState(
    'Perubahan Wujud Benda dan Pemanfaatannya di Lingkungan Sekitar'
  );
  const [rppAlokasi, setRppAlokasi] = useState('2 x 35 Menit (1 Pertemuan)');
  const [rppTujuanInput, setRppTujuanInput] = useState(
    '1. Peserta didik mampu mengidentifikasi proses perubahan wujud benda melalui pengamatan konkret.\n2. Peserta didik mampu menyajikan laporan hasil percobaan perubahan wujud zat secara berkelompok.'
  );
  const [rppModel, setRppModel] = useState('Problem Based Learning (PBL)');
  const [rppPendekatan, setRppPendekatan] = useState(
    'Pembelajaran Berdiferensiasi & Saintifik (TPACK)'
  );
  const [rppMetode, setRppMetode] = useState(
    'Eksperimen, Diskusi Kelompok, dan Tanya Jawab'
  );
  const [rppProfilLulusan, setRppProfilLulusan] = useState(
    'Beriman & Bertakwa, Bernalar Kritis, Gotong Royong, Mandiri'
  );
  const [rppFormat, setRppFormat] = useState<'Modul Ajar' | 'RPP'>('Modul Ajar');
  const [rppPenyusun, setRppPenyusun] = useState(
    'Nadia Permatasari, S.Pd. [DEMO]'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [confirmDeleteHistId, setConfirmDeleteHistId] = useState<string | null>(
    null
  );

  const [generatedRpp, setGeneratedRpp] = useState<GeneratedRppResult>(() =>
    generateModulAjar({
      mataPelajaran: 'IPAS (Ilmu Pengetahuan Alam dan Sosial)',
      kelas: 'Kelas IV',
      fase: 'Fase B',
      semester: 'Ganjil',
      topik: 'Perubahan Wujud Benda dan Pemanfaatannya di Lingkungan Sekitar',
      tujuanPembelajaranInput:
        '1. Peserta didik mampu mengidentifikasi proses perubahan wujud benda melalui pengamatan konkret.\n2. Peserta didik mampu menyajikan laporan hasil percobaan perubahan wujud zat secara berkelompok.',
      modelPembelajaran: 'Problem Based Learning (PBL)',
      pendekatanPembelajaran: 'Pembelajaran Berdiferensiasi & Saintifik (TPACK)',
      metodePembelajaran: 'Eksperimen, Diskusi Kelompok, dan Tanya Jawab',
      profilLulusanInput:
        'Beriman & Bertakwa, Bernalar Kritis, Gotong Royong, Mandiri',
      formatDokumen: 'Modul Ajar',
      alokasiWaktu: '2 x 35 Menit (1 Pertemuan)',
      penyusun: 'Nadia Permatasari, S.Pd. [DEMO]',
    })
  );
  const [isEditingResult, setIsEditingResult] = useState(false);
  const [editableCp, setEditableCp] = useState(
    generatedRpp.capaianPembelajaran
  );
  const [editableTpText, setEditableTpText] = useState(
    generatedRpp.tujuanPembelajaran.join('\n')
  );

  if (subMenuId === 'ai-curriculum-assistant') {
    const handleGenerate = (e: React.FormEvent) => {
      e.preventDefault();
      setIsGenerating(true);
      setTimeout(() => {
        const res = generateModulAjar({
          mataPelajaran: rppMapel,
          kelas: rppKelas,
          fase: rppFase,
          semester: rppSemester,
          topik: rppTopik,
          tujuanPembelajaranInput: rppTujuanInput,
          modelPembelajaran: rppModel,
          pendekatanPembelajaran: rppPendekatan,
          metodePembelajaran: rppMetode,
          profilLulusanInput: rppProfilLulusan,
          formatDokumen: rppFormat,
          alokasiWaktu: rppAlokasi,
          penyusun: rppPenyusun,
        });
        setGeneratedRpp(res);
        setEditableCp(res.capaianPembelajaran);
        setEditableTpText(res.tujuanPembelajaran.join('\n'));
        setIsEditingResult(false);
        setIsGenerating(false);
        onNotify?.(
          'Dokumen Simulasi Berhasil Disusun',
          `${res.formatDokumen} ${res.identitas.mataPelajaran} (${res.identitas.kelas}) siap ditinjau.`,
          'success'
        );
      }, 450);
    };

    const handleApplyEditorChanges = () => {
      const updatedTp = editableTpText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      setGeneratedRpp((prev) => ({
        ...prev,
        capaianPembelajaran: editableCp,
        tujuanPembelajaran:
          updatedTp.length > 0 ? updatedTp : prev.tujuanPembelajaran,
      }));
      setIsEditingResult(false);
      onNotify?.(
        'Hasil Edit Diterapkan',
        'Perubahan isi dokumen telah diperbarui pada pratinjau.',
        'success'
      );
    };

    const handleDownloadWordDocx = async () => {
      try {
        setIsDownloadingDocx(true);
        const fileName = await downloadRppAsDocx(generatedRpp, editableCp);
        onNotify?.(
          'Dokumen Word (.docx) Diunduh',
          `File "${fileName}" berhasil dibuat dan diunduh.`,
          'success'
        );
      } catch {
        onNotify?.(
          'Gagal Mengunduh Dokumen Word',
          'Terjadi kendala saat membuat file .docx.',
          'error'
        );
      } finally {
        setIsDownloadingDocx(false);
      }
    };

    const handleSaveToHistoryAndRepo = () => {
      const updatedRpp: GeneratedRppResult = {
        ...generatedRpp,
        capaianPembelajaran: editableCp,
      };
      onSaveRppHistory(updatedRpp);
      onSaveCurriculumDoc(
        {
          id: `DOC-${Date.now().toString().slice(-4)}`,
          kode: `AI-${
            generatedRpp.formatDokumen === 'RPP' ? 'RPP' : 'MDL'
          }-${Date.now().toString().slice(-3)}`,
          judul: `${generatedRpp.formatDokumen} ${generatedRpp.identitas.mataPelajaran}: ${generatedRpp.identitas.topik} [DEMO]`,
          mataPelajaran: generatedRpp.identitas.mataPelajaran,
          kelas: generatedRpp.identitas.kelas,
          fase: generatedRpp.identitas.fase as CurriculumDoc['fase'],
          semester: generatedRpp.identitas.semester || 'Ganjil',
          tipe: 'Modul Ajar',
          subMenuTarget: 'modul-ajar-rpp',
          penyusun: generatedRpp.identitas.penyusun,
          updatedAt: 'Baru Saja',
          status: 'Terverifikasi Kepala Sekolah',
          ringkasan: editableCp,
        },
        false
      );
    };

    return (
      <div className="space-y-6 pb-10">
        {/* Header with Demo Notice */}
        <div className="bg-gradient-to-r from-[#0F1E36] via-[#1D3557] to-[#2563EB] text-white rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>
                04. SIGAP PEDAGOGY · Simulasi DEMO Lokal (Bukan Hasil AI Sungguhan)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-display mt-1">
              AI Curriculum Assistant — Generator RPP &amp; Modul Ajar SD
            </h2>
            <p className="text-xs text-sky-100/90 mt-1 max-w-2xl">
              Susun draf RPP atau Modul Ajar Kurikulum Merdeka lengkap dengan 12 parameter, editor hasil interaktif, penyimpanan riwayat lokal, dan ekspor dokumen Word (<strong>.docx</strong>).
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('modul-ajar-rpp')}
            className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 shrink-0 self-start md:self-center"
          >
            Lihat Repositori Modul Ajar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Parameter Form with all 12 required fields */}
          <form
            onSubmit={handleGenerate}
            className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3 text-xs self-start"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                12 Parameter Generator RPP / Modul Ajar
              </h3>
              <span className="text-[11px] font-bold text-amber-700">
                Hasil Simulasi [DEMO]
              </span>
            </div>

            {/* 1. Bentuk Dokumen */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                1. Bentuk Dokumen
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                {(['Modul Ajar', 'RPP'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setRppFormat(fmt)}
                    className={`py-2 rounded-lg font-bold transition-colors ${
                      rppFormat === fmt
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bentuk {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Kelas, 3. Fase, 4. Semester */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  2. Kelas
                </label>
                <select
                  value={rppKelas}
                  onChange={(e) => {
                    const k = e.target.value;
                    setRppKelas(k);
                    if (k === 'Kelas I' || k === 'Kelas II') setRppFase('Fase A');
                    else if (k === 'Kelas III' || k === 'Kelas IV')
                      setRppFase('Fase B');
                    else setRppFase('Fase C');
                  }}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                >
                  <option value="Kelas I">Kelas I</option>
                  <option value="Kelas II">Kelas II</option>
                  <option value="Kelas III">Kelas III</option>
                  <option value="Kelas IV">Kelas IV</option>
                  <option value="Kelas V">Kelas V</option>
                  <option value="Kelas VI">Kelas VI</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  3. Fase
                </label>
                <select
                  value={rppFase}
                  onChange={(e) => setRppFase(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                >
                  <option value="Fase A">Fase A</option>
                  <option value="Fase B">Fase B</option>
                  <option value="Fase C">Fase C</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  4. Semester
                </label>
                <select
                  value={rppSemester}
                  onChange={(e) =>
                    setRppSemester(e.target.value as 'Ganjil' | 'Genap')
                  }
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>

            {/* 5. Mata Pelajaran */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                5. Mata Pelajaran
              </label>
              <select
                value={rppMapel}
                onChange={(e) => setRppMapel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                <option value="IPAS (Ilmu Pengetahuan Alam dan Sosial)">
                  IPAS (Ilmu Pengetahuan Alam dan Sosial)
                </option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Matematika">Matematika</option>
                <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                <option value="Seni Rupa & Budaya">Seni Rupa &amp; Budaya</option>
                <option value="PAI & Budi Pekerti">PAI &amp; Budi Pekerti</option>
                <option value="PJOK">PJOK</option>
              </select>
            </div>

            {/* 6. Materi & 7. Alokasi Waktu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  6. Materi Pokok
                </label>
                <input
                  type="text"
                  value={rppTopik}
                  onChange={(e) => setRppTopik(e.target.value)}
                  placeholder="Topik / Materi pokok..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  7. Alokasi Waktu
                </label>
                <input
                  type="text"
                  value={rppAlokasi}
                  onChange={(e) => setRppAlokasi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
            </div>

            {/* 8. Tujuan Pembelajaran */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                8. Tujuan Pembelajaran (TP)
              </label>
              <textarea
                rows={2}
                value={rppTujuanInput}
                onChange={(e) => setRppTujuanInput(e.target.value)}
                placeholder="Tuliskan rumusan Tujuan Pembelajaran (1 baris per TP)..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>

            {/* 9. Model Pembelajaran & 10. Pendekatan Pembelajaran */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  9. Model Pembelajaran
                </label>
                <select
                  value={rppModel}
                  onChange={(e) => setRppModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                >
                  <option value="Problem Based Learning (PBL)">
                    Problem Based Learning (PBL)
                  </option>
                  <option value="Project Based Learning (PjBL)">
                    Project Based Learning (PjBL)
                  </option>
                  <option value="Discovery Inquiry Learning">
                    Discovery Inquiry Learning
                  </option>
                  <option value="Cooperative Learning">
                    Cooperative Learning
                  </option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  10. Pendekatan Pembelajaran
                </label>
                <select
                  value={rppPendekatan}
                  onChange={(e) => setRppPendekatan(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                >
                  <option value="Pembelajaran Berdiferensiasi & Saintifik (TPACK)">
                    Berdiferensiasi &amp; Saintifik (TPACK)
                  </option>
                  <option value="Contextual Teaching and Learning (CTL)">
                    Contextual Teaching and Learning (CTL)
                  </option>
                  <option value="Culturally Responsive Teaching (CRT)">
                    Culturally Responsive Teaching (CRT)
                  </option>
                  <option value="Teaching at The Right Level (TaRL)">
                    Teaching at The Right Level (TaRL)
                  </option>
                </select>
              </div>
            </div>

            {/* 11. Metode Pembelajaran & 12. Profil Lulusan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  11. Metode Pembelajaran
                </label>
                <input
                  type="text"
                  value={rppMetode}
                  onChange={(e) => setRppMetode(e.target.value)}
                  placeholder="Diskusi, Eksperimen, Tanya Jawab"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  12. Profil Lulusan / Pancasila
                </label>
                <input
                  type="text"
                  value={rppProfilLulusan}
                  onChange={(e) => setRppProfilLulusan(e.target.value)}
                  placeholder="Bernalar Kritis, Gotong Royong..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isGenerating ? 'Menyusun Dokumen...' : 'Generate RPP / Modul Ajar'}
              </span>
            </button>
          </form>

          {/* Right Preview Hasil + Editor + Riwayat */}
          <div className="lg:col-span-7 space-y-6">
            {isGenerating ? (
              <LoadingStateBox label="Menyusun dokumen RPP / Modul Ajar simulasi lokal..." />
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex flex-col gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-amber-700">
                      Preview Hasil Simulasi [DEMO] · Bukan Hasil AI Sungguhan
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
                      {generatedRpp.formatDokumen.toUpperCase()} —{' '}
                      {generatedRpp.identitas.satuanPendidikan}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (isEditingResult) {
                          handleApplyEditorChanges();
                        } else {
                          setIsEditingResult(true);
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Edit3 className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {isEditingResult ? 'Simpan Editan' : 'Editor Hasil'}
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={isDownloadingDocx}
                      onClick={handleDownloadWordDocx}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {isDownloadingDocx
                          ? 'Membuat .docx...'
                          : 'Unduh Word (.docx)'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveToHistoryAndRepo}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Simpan ke Riwayat</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                      title="Cetak Dokumen"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Identitas Modul */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F4F8FF] text-xs">
                  <div>
                    <span className="text-slate-500">
                      Mata Pelajaran &amp; Bentuk:
                    </span>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {generatedRpp.identitas.mataPelajaran} (
                      {generatedRpp.formatDokumen})
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">
                      Kelas / Fase / Semester:
                    </span>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {generatedRpp.identitas.kelas} (
                      {generatedRpp.identitas.fase}) ·{' '}
                      {generatedRpp.identitas.semester || 'Ganjil'} ·{' '}
                      {generatedRpp.identitas.alokasiWaktu}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">
                      Model, Pendekatan &amp; Metode:
                    </span>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {generatedRpp.identitas.modelPembelajaran} ·{' '}
                      {generatedRpp.identitas.metodePembelajaran ||
                        'Diskusi & Eksperimen'}
                    </div>
                  </div>
                </div>

                {/* Komponen Inti */}
                <div className="space-y-4 text-xs leading-relaxed">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      A. Capaian Pembelajaran &amp; Profil Lulusan
                    </h4>
                    {isEditingResult ? (
                      <textarea
                        rows={3}
                        value={editableCp}
                        onChange={(e) => setEditableCp(e.target.value)}
                        className="w-full mt-1.5 p-3 rounded-xl border border-blue-400 bg-blue-50/30 text-slate-800"
                      />
                    ) : (
                      <p className="text-slate-700 mt-1">{editableCp}</p>
                    )}
                    <div className="mt-2 text-slate-600">
                      <strong>Profil Lulusan / Pelajar Pancasila:</strong>{' '}
                      {generatedRpp.profilPelajarPancasila.join(' · ')}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      B. Tujuan Pembelajaran (TP)
                    </h4>
                    {isEditingResult ? (
                      <textarea
                        rows={3}
                        value={editableTpText}
                        onChange={(e) => setEditableTpText(e.target.value)}
                        className="w-full mt-1.5 p-3 rounded-xl border border-blue-400 bg-blue-50/30 text-slate-800"
                      />
                    ) : (
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700">
                        {generatedRpp.tujuanPembelajaran.map((tp, idx) => (
                          <li key={idx}>{tp}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      C. Langkah-Langkah Kegiatan Pembelajaran (
                      {generatedRpp.identitas.modelPembelajaran})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      <div className="p-3.5 rounded-2xl border border-slate-200">
                        <div className="font-bold text-blue-700 mb-1.5">
                          1. Kegiatan Pendahuluan
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                          {generatedRpp.langkahPembelajaran.pendahuluan.map(
                            (s, i) => (
                              <li key={i}>{s}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="p-3.5 rounded-2xl border border-slate-200">
                        <div className="font-bold text-blue-700 mb-1.5">
                          2. Kegiatan Inti
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                          {generatedRpp.langkahPembelajaran.kegiatanInti.map(
                            (s, i) => (
                              <li key={i}>{s}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="p-3.5 rounded-2xl border border-slate-200">
                        <div className="font-bold text-blue-700 mb-1.5">
                          3. Kegiatan Penutup
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                          {generatedRpp.langkahPembelajaran.penutup.map(
                            (s, i) => (
                              <li key={i}>{s}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Riwayat Dokumen RPP Lokal */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600" />
                  <h3 className="text-base font-extrabold text-slate-900 font-display">
                    Riwayat Generator Dokumen Lokal ({rppHistory.length})
                  </h3>
                </div>
                <span className="text-slate-500">Tersimpan di localStorage</span>
              </div>

              <div className="divide-y divide-slate-100">
                {rppHistory.map((hist) => (
                  <div
                    key={hist.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        [{hist.formatDokumen}] {hist.identitas.mataPelajaran} —{' '}
                        {hist.identitas.topik}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {hist.identitas.kelas} ({hist.identitas.fase}) ·{' '}
                        {hist.createdAt || 'Tersimpan'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setGeneratedRpp(hist);
                          setEditableCp(hist.capaianPembelajaran);
                          setEditableTpText(hist.tujuanPembelajaran.join('\n'));
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold"
                      >
                        Muat Pratinjau
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteHistId(hist.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-700"
                        title="Hapus dari riwayat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {rppHistory.length === 0 && (
                  <div className="py-6 text-center text-slate-500">
                    Belum ada riwayat dokumen yang disimpan. Klik &quot;Simpan ke Riwayat&quot; pada pratinjau di atas.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ConfirmationDialog
          isOpen={Boolean(confirmDeleteHistId)}
          title="Konfirmasi Hapus Riwayat RPP"
          description="Apakah Anda yakin ingin menghapus dokumen ini dari riwayat lokal?"
          confirmLabel="Ya, Hapus Riwayat"
          onCancel={() => setConfirmDeleteHistId(null)}
          onConfirm={() => {
            if (confirmDeleteHistId) {
              onDeleteRppHistory(confirmDeleteHistId);
              setConfirmDeleteHistId(null);
            }
          }}
        />
      </div>
    );
  }

  /* ------------------- OTHER 7 SIGAP PEDAGOGY SUBMENUS ------------------- */
  const titleMap: Record<
    string,
    { title: string; subtitle: string; defaultType: CurriculumDoc['tipe'] }
  > = {
    'pemetaan-kurikulum': {
      title: 'Pemetaan Kurikulum Merdeka (Capaian Pembelajaran Fase A, B, C)',
      subtitle:
        'Kelola tambah, edit, cari, dan hapus dokumen pemetaan elemen CP SD Negeri Karanggintung 06.',
      defaultType: 'CP/TP',
    },
    'tujuan-pembelajaran': {
      title: 'Rumusan Tujuan Pembelajaran (TP)',
      subtitle:
        'Kelola rumusan kompetensi dan lingkup materi esensial per Fase.',
      defaultType: 'CP/TP',
    },
    'alur-tujuan-pembelajaran': {
      title: 'Alur Tujuan Pembelajaran (ATP)',
      subtitle:
        'Pengelolaan rangkaian Tujuan Pembelajaran sistematis dari awal hingga akhir fase.',
      defaultType: 'ATP',
    },
    'prota-promes': {
      title: 'Program Tahunan (Prota) & Program Semester (Promes)',
      subtitle:
        'Pengelolaan distribusi alokasi waktu jam pelajaran efektif tahunan dan semesteran.',
      defaultType: 'Prota/Promes',
    },
    'modul-ajar-rpp': {
      title: 'Repositori Modul Ajar & RPP Kurikulum Merdeka',
      subtitle:
        'Pengelolaan perangkat ajar guru kelas dan guru mata pelajaran yang terverifikasi.',
      defaultType: 'Modul Ajar',
    },
    'bahan-ajar-digital': {
      title: 'Bahan Ajar Digital & Literasi Berjenjang',
      subtitle:
        'Pengelolaan E-Modul, buku cerita bergambar, dan materi pengayaan literasi-numerasi.',
      defaultType: 'Bahan Ajar',
    },
    'media-pembelajaran': {
      title: 'Media Pembelajaran Visual & Alat Peraga Interaktif',
      subtitle:
        'Pengelolaan media presentasi, kartu bilangan digital, dan video pembelajaran SD.',
      defaultType: 'Media Interaktif',
    },
  };

  const currentMeta = titleMap[subMenuId] || titleMap['modul-ajar-rpp'];
  const filteredDocs = curriculumDocs.filter((d) => {
    const matchFase = faseFilter === 'Semua' || d.fase === faseFilter;
    const matchQuery =
      !docSearch.trim() ||
      d.judul.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.mataPelajaran.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.penyusun.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.kode.toLowerCase().includes(docSearch.toLowerCase());
    return matchFase && matchQuery;
  });

  const { pagedItems, totalPages, startIndex, endIndex } = paginateItems(
    filteredDocs,
    currentPage,
    6
  );

  const openAddDocModal = () => {
    setEditingDoc(null);
    setNewJudul('');
    setNewKode(`PDG-${Date.now().toString().slice(-3)}`);
    setNewMapel('IPAS');
    setNewKelas('Kelas IV');
    setNewFase('Fase B');
    setNewSemester('Ganjil');
    setNewTipe(currentMeta.defaultType);
    setNewPenyusun('Nadia Permatasari, S.Pd. [DEMO]');
    setNewRingkasan('');
    setIsFormOpen(true);
  };

  const openEditDocModal = (doc: CurriculumDoc) => {
    setEditingDoc(doc);
    setNewJudul(doc.judul);
    setNewKode(doc.kode);
    setNewMapel(doc.mataPelajaran);
    setNewKelas(doc.kelas);
    setNewFase(doc.fase);
    setNewSemester(doc.semester);
    setNewTipe(doc.tipe);
    setNewPenyusun(doc.penyusun);
    setNewRingkasan(doc.ringkasan);
    setIsFormOpen(true);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim()) return;
    onSaveCurriculumDoc(
      {
        id: editingDoc
          ? editingDoc.id
          : `DOC-${Date.now().toString().slice(-4)}`,
        kode: newKode.trim() || `PDG-${Date.now().toString().slice(-3)}`,
        judul: newJudul.trim().includes('[DEMO]')
          ? newJudul.trim()
          : `${newJudul.trim()} [DEMO]`,
        mataPelajaran: newMapel,
        kelas: newKelas,
        fase: newFase,
        semester: newSemester,
        tipe: newTipe,
        subMenuTarget: subMenuId,
        penyusun: newPenyusun.trim() || 'Tim Guru SD Negeri Karanggintung 06 [DEMO]',
        updatedAt: '06 Nov 2026',
        status: 'Terverifikasi Kepala Sekolah',
        ringkasan:
          newRingkasan.trim() ||
          'Dokumen perangkat ajar Kurikulum Merdeka SD Negeri Karanggintung 06.',
      },
      Boolean(editingDoc)
    );
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-pink-600">
              04. SIGAP PEDAGOGY · Perangkat Kurikulum Merdeka [DEMO]
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              {currentMeta.title}
            </h2>
            <p className="text-xs text-slate-500">{currentMeta.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('ai-curriculum-assistant')}
            className="px-3.5 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generator AI RPP</span>
          </button>
          <button
            type="button"
            onClick={openAddDocModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data</span>
          </button>
        </div>
      </div>

      {/* Search & Fase Filter */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <SearchBarInput
          value={docSearch}
          onChange={(val) => {
            setDocSearch(val);
            setCurrentPage(1);
          }}
          placeholder="Cari judul perangkat ajar, kode, mata pelajaran, atau penyusun..."
        />
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
          {['Semua', 'Fase A', 'Fase B', 'Fase C'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFaseFilter(f);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                faseFilter === f
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pagedItems.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-blue-700">
                  {doc.fase} · {doc.kelas} ({doc.semester})
                </span>
                <span className="font-mono">{doc.kode}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-1.5 font-display">
                {doc.judul}
              </h3>
              <div className="text-xs text-slate-500 mt-1">
                Mapel:{' '}
                <strong className="text-slate-800">{doc.mataPelajaran}</strong> ·
                Tipe: {doc.tipe}
              </div>
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                {doc.ringkasan}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setSelectedDoc(doc)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 font-bold inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Detail</span>
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEditDocModal(doc)}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteDoc(doc)}
                  className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700"
                  title="Hapus dokumen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200">
          <EmptyStateBox
            title="Tidak ada dokumen perangkat ajar yang sesuai filter"
            description="Reset filter fase atau kata kunci pencarian untuk melihat seluruh perangkat ajar."
            actionLabel="Tampilkan Semua Dokumen"
            onAction={() => {
              setFaseFilter('Semua');
              setDocSearch('');
              setCurrentPage(1);
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredDocs.length}
            startIndex={startIndex}
            endIndex={endIndex}
            perPage={6}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Detail Document Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedDoc)}
        title={selectedDoc?.judul || ''}
        subtitle={`Detail Perangkat Ajar · ${selectedDoc?.kode}`}
        onClose={() => setSelectedDoc(null)}
        footer={
          selectedDoc && (
            <>
              <button
                type="button"
                onClick={() => {
                  const d = selectedDoc;
                  setSelectedDoc(null);
                  openEditDocModal(d);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Edit Dokumen
              </button>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Tutup
              </button>
            </>
          )
        }
      >
        {selectedDoc && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#F4F8FF]">
              <strong>Mata Pelajaran &amp; Kelas:</strong>{' '}
              {selectedDoc.mataPelajaran} · {selectedDoc.kelas} (
              {selectedDoc.fase} · Semester {selectedDoc.semester})
            </div>
            <div className="p-3 rounded-xl bg-[#F4F8FF]">
              <strong>Guru Penyusun:</strong> {selectedDoc.penyusun}
            </div>
            <div className="p-3 rounded-xl bg-[#F4F8FF]">
              <strong>Status Supervisi:</strong> {selectedDoc.status}
            </div>
            <div className="p-3 rounded-xl bg-[#F4F8FF] leading-relaxed">
              <strong>Ringkasan Isi Perangkat:</strong>
              <p className="mt-1 text-slate-700">{selectedDoc.ringkasan}</p>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Confirmation Delete Doc */}
      <ConfirmationDialog
        isOpen={Boolean(confirmDeleteDoc)}
        title="Konfirmasi Hapus Perangkat Ajar"
        description={`Apakah Anda yakin ingin menghapus dokumen "${confirmDeleteDoc?.judul}" (${confirmDeleteDoc?.kode})?`}
        confirmLabel="Ya, Hapus Dokumen"
        onCancel={() => setConfirmDeleteDoc(null)}
        onConfirm={() => {
          if (confirmDeleteDoc) {
            onDeleteCurriculumDoc(confirmDeleteDoc.id);
            setConfirmDeleteDoc(null);
          }
        }}
      />

      {/* Add / Edit Document Modal */}
      <ModalDialog
        isOpen={isFormOpen}
        title={
          editingDoc ? 'Edit Perangkat Ajar' : 'Tambah Perangkat Ajar Baru'
        }
        subtitle={currentMeta.title}
        onClose={() => setIsFormOpen(false)}
      >
        <form onSubmit={handleSaveDoc} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Judul Perangkat Ajar *
            </label>
            <input
              type="text"
              value={newJudul}
              onChange={(e) => setNewJudul(e.target.value)}
              placeholder="Contoh: Modul Ajar Matematika Pecahan Senilai"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mata Pelajaran
              </label>
              <input
                type="text"
                value={newMapel}
                onChange={(e) => setNewMapel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kelas &amp; Fase
              </label>
              <select
                value={newFase}
                onChange={(e) =>
                  setNewFase(e.target.value as CurriculumDoc['fase'])
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                <option value="Fase A">Fase A (Kelas I-II)</option>
                <option value="Fase B">Fase B (Kelas III-IV)</option>
                <option value="Fase C">Fase C (Kelas V-VI)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kelas Sasaran
              </label>
              <input
                type="text"
                value={newKelas}
                onChange={(e) => setNewKelas(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Guru Penyusun
              </label>
              <input
                type="text"
                value={newPenyusun}
                onChange={(e) => setNewPenyusun(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Ringkasan Kompetensi / Materi
            </label>
            <textarea
              rows={3}
              value={newRingkasan}
              onChange={(e) => setNewRingkasan(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
            >
              Simpan Perangkat
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
};
