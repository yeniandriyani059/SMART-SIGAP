import React, { useState, useRef } from 'react';
import {
  ClipboardList,
  Plus,
  Cpu,
  ExternalLink,
  CheckCircle2,
  GraduationCap,
  Settings,
  Camera,
  Download,
  RefreshCw,
  Shield,
  BookOpen,
  Send,
  Eye,
  ArrowLeft,
  AlertCircle,
  FileText,
  Edit3,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  SubMenuId,
  QuestionBankItem,
  AssessProgramItem,
  KktpCriterionItem,
  DigitalHubApp,
  ClassHubRoom,
  ClassHubAssignment,
  StudentSubmission,
  SchoolIdentity,
  PortalDisplaySettings,
  ActivityLogItem,
  CurriculumDoc,
} from '../types/sigap';
import { evaluateKktpStatus, validateExternalUrl } from '../utils/sigapLogic';
import { OFFICIAL_LOGO_PATH } from '../data/demoData';
import {
  ConfirmationDialog,
  DetailDrawer,
  ModalDialog,
  SearchBarInput,
  TabsNav,
  EmptyStateBox,
  ErrorStateBox,
} from './GlobalUI';

/* ==========================================================================
   8. SIGAP ASSESS MODULES (Tahap 3: Tambah, Edit, Hapus + Konfirmasi,
      Pencarian, Filter, Detail Drawer untuk Instrumen, KKTP, Bank Soal/LKPD,
      Remedial & Pengayaan)
   ========================================================================== */
export const AssessModules: React.FC<{
  subMenuId: SubMenuId;
  questions: QuestionBankItem[];
  onSaveQuestion: (q: QuestionBankItem, isEdit: boolean) => void;
  onDeleteQuestion: (id: string) => void;
  assessPrograms: AssessProgramItem[];
  onSaveAssessProgram: (item: AssessProgramItem, isEdit: boolean) => void;
  onDeleteAssessProgram: (id: string) => void;
  kktpCriteria: KktpCriterionItem[];
  onSaveKktpCriterion: (item: KktpCriterionItem, isEdit: boolean) => void;
  onDeleteKktpCriterion: (id: string) => void;
}> = ({
  subMenuId,
  questions,
  onSaveQuestion,
  onDeleteQuestion,
  assessPrograms,
  onSaveAssessProgram,
  onDeleteAssessProgram,
  kktpCriteria,
  onSaveKktpCriterion,
  onDeleteKktpCriterion,
}) => {
  // KKTP states
  const [testScore, setTestScore] = useState<number>(82);
  const kktpEval = evaluateKktpStatus(testScore);
  const [kktpSearch, setKktpSearch] = useState('');
  const [editingKktp, setEditingKktp] = useState<KktpCriterionItem | null>(
    null
  );
  const [confirmDeleteKktp, setConfirmDeleteKktp] =
    useState<KktpCriterionItem | null>(null);
  const [kkMapel, setKkMapel] = useState('IPAS');
  const [kkKelas, setKkKelas] = useState('Kelas IV');
  const [kkFase, setKkFase] = useState<KktpCriterionItem['fase']>('Fase B');
  const [kkTp, setKkTp] = useState('');
  const [kkBatas, setKkBatas] = useState(72);
  const [kkMahir, setKkMahir] = useState('');

  // Bank Soal & LKPD states
  const [qSearch, setQSearch] = useState('');
  const [qBankTab, setQBankTab] = useState<'Semua' | 'Bank Soal' | 'Bank LKPD'>(
    'Semua'
  );
  const [qLevelFilter, setQLevelFilter] = useState('Semua');
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionBankItem | null>(null);
  const [editingQ, setEditingQ] = useState<QuestionBankItem | null>(null);
  const [confirmDeleteQ, setConfirmDeleteQ] =
    useState<QuestionBankItem | null>(null);
  const [qMapel, setQMapel] = useState('Matematika');
  const [qKelas, setQKelas] = useState('Kelas IV');
  const [qKategoriBank, setQKategoriBank] =
    useState<QuestionBankItem['kategoriBank']>('Bank Soal');
  const [qLevel, setQLevel] =
    useState<QuestionBankItem['levelKognitif']>('L2 - Penerapan');
  const [qTipe, setQTipe] =
    useState<QuestionBankItem['tipeSoal']>('Pilihan Ganda');
  const [qText, setQText] = useState('');
  const [qKey, setQKey] = useState('');
  const [qTp, setQTp] = useState('');

  // Instrumen & Remedial states
  const [assessSearch, setAssessSearch] = useState('');
  const [assessCategory, setAssessCategory] = useState('Semua');
  const [selectedAssessItem, setSelectedAssessItem] =
    useState<AssessProgramItem | null>(null);
  const [editingAssess, setEditingAssess] =
    useState<AssessProgramItem | null>(null);
  const [confirmDeleteAssess, setConfirmDeleteAssess] =
    useState<AssessProgramItem | null>(null);
  const [newInsJudul, setNewInsJudul] = useState('');
  const [newInsJenis, setNewInsJenis] =
    useState<AssessProgramItem['jenis']>('Formatif');
  const [newInsKelas, setNewInsKelas] = useState('Kelas IV');
  const [newInsMapel, setNewInsMapel] = useState('IPAS');
  const [newInsSasaran, setNewInsSasaran] = useState('Siswa Kelas IV [DEMO]');
  const [newInsDesc, setNewInsDesc] = useState('');

  /* ------------------- 1. PENGELOLAAN KKTP ------------------- */
  if (subMenuId === 'kktp') {
    const filteredKktp = kktpCriteria.filter(
      (k) =>
        !kktpSearch.trim() ||
        k.mataPelajaran.toLowerCase().includes(kktpSearch.toLowerCase()) ||
        k.tujuanPembelajaran.toLowerCase().includes(kktpSearch.toLowerCase()) ||
        k.kelas.toLowerCase().includes(kktpSearch.toLowerCase())
    );

    const startEditKktp = (item: KktpCriterionItem) => {
      setEditingKktp(item);
      setKkMapel(item.mataPelajaran);
      setKkKelas(item.kelas);
      setKkFase(item.fase);
      setKkTp(item.tujuanPembelajaran);
      setKkBatas(item.batasTuntasMinimal);
      setKkMahir(item.deskripsiMahir);
    };

    const resetKktpForm = () => {
      setEditingKktp(null);
      setKkTp('');
      setKkMahir('');
      setKkBatas(72);
    };

    const handleSaveKktp = (e: React.FormEvent) => {
      e.preventDefault();
      if (!kkTp.trim()) return;
      onSaveKktpCriterion(
        {
          id: editingKktp
            ? editingKktp.id
            : `KKTP-${Date.now().toString().slice(-4)}`,
          kode: editingKktp
            ? editingKktp.kode
            : `KKTP-${kkMapel.slice(0, 3).toUpperCase()}-${Date.now()
                .toString()
                .slice(-2)}`,
          mataPelajaran: kkMapel,
          kelas: kkKelas,
          fase: kkFase,
          tujuanPembelajaran: kkTp.trim().includes('[DEMO]')
            ? kkTp.trim()
            : `${kkTp.trim()} [DEMO]`,
          batasTuntasMinimal: Number(kkBatas) || 70,
          deskripsiMahir:
            kkMahir.trim() ||
            'Mampu menguasai konsep secara mandiri dan menyelesaikan soal tantangan (86-100%).',
        },
        Boolean(editingKktp)
      );
      resetKktpForm();
    };

    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-600">
              05. SIGAP ASSESS · Pengelolaan Standar Ketuntasan Kurikulum Merdeka [DEMO]
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
              Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Kelola kriteria ketuntasan per mata pelajaran dan uji simulasi interval nilai (tanpa menduplikasi Analisis Hasil Asesmen).
            </p>
          </div>
          <div className="w-full sm:w-72">
            <SearchBarInput
              value={kktpSearch}
              onChange={setKktpSearch}
              placeholder="Cari KKTP mapel, kelas, atau TP..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Daftar Kriteria KKTP Terdaftar ({filteredKktp.length})
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {filteredKktp.map((item) => (
                  <div key={item.id} className="py-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-700">
                        {item.kode} · {item.mataPelajaran} ({item.kelas} /{' '}
                        {item.fase})
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-bold">
                        Batas Tuntas: {item.batasTuntasMinimal}%
                      </span>
                    </div>
                    <div className="font-bold text-slate-900">
                      TP: {item.tujuanPembelajaran}
                    </div>
                    <div className="text-slate-600">
                      Kriteria Mahir: {item.deskripsiMahir}
                    </div>
                    <div className="pt-1 flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => startEditKktp(item)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteKktp(item)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulasi Kalkulator Interval KKTP */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Simulasi Kalkulator Interval KKTP
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Masukkan Skor Capaian Siswa (0 - 100):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={testScore}
                    onChange={(e) => setTestScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F4F8FF] font-mono text-base font-extrabold text-slate-900"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-[#F4F8FF] border border-blue-200/80 space-y-1">
                  <div className="font-extrabold text-blue-700">
                    {kktpEval.predikat} ({kktpEval.interval})
                  </div>
                  <div className="text-slate-600">{kktpEval.rekomendasi}</div>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSaveKktp}
            className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs self-start"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                {editingKktp ? 'Edit Kriteria KKTP' : 'Tambah Kriteria KKTP Baru'}
              </h3>
              {editingKktp && (
                <button
                  type="button"
                  onClick={resetKktpForm}
                  className="text-slate-500 font-bold"
                >
                  Batal
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={kkMapel}
                  onChange={(e) => setKkMapel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kelas
                </label>
                <select
                  value={kkKelas}
                  onChange={(e) => setKkKelas(e.target.value)}
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Fase
                </label>
                <select
                  value={kkFase}
                  onChange={(e) =>
                    setKkFase(e.target.value as KktpCriterionItem['fase'])
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                >
                  <option value="Fase A">Fase A</option>
                  <option value="Fase B">Fase B</option>
                  <option value="Fase C">Fase C</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Batas Minimal Tuntas (%)
                </label>
                <input
                  type="number"
                  value={kkBatas}
                  onChange={(e) => setKkBatas(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Rumusan Tujuan Pembelajaran (TP) *
              </label>
              <textarea
                rows={2}
                value={kkTp}
                onChange={(e) => setKkTp(e.target.value)}
                placeholder="Tuliskan TP yang diukur..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Deskripsi Kriteria Mahir (86-100%)
              </label>
              <textarea
                rows={2}
                value={kkMahir}
                onChange={(e) => setKkMahir(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {editingKktp ? 'Simpan Perubahan KKTP' : 'Simpan Kriteria KKTP'}
            </button>
          </form>
        </div>

        <ConfirmationDialog
          isOpen={Boolean(confirmDeleteKktp)}
          title="Konfirmasi Hapus Kriteria KKTP"
          description={`Apakah Anda yakin ingin menghapus kriteria KKTP "${confirmDeleteKktp?.kode}"?`}
          confirmLabel="Ya, Hapus KKTP"
          onCancel={() => setConfirmDeleteKktp(null)}
          onConfirm={() => {
            if (confirmDeleteKktp) {
              onDeleteKktpCriterion(confirmDeleteKktp.id);
              setConfirmDeleteKktp(null);
            }
          }}
        />
      </div>
    );
  }

  /* ------------------- 2. BANK SOAL & BANK LKPD ------------------- */
  if (subMenuId === 'bank-soal-lkpd') {
    const filteredQuestions = questions.filter((q) => {
      const cat =
        q.kategoriBank ||
        (q.tipeSoal === 'LKPD Praktik' ? 'Bank LKPD' : 'Bank Soal');
      const matchTab = qBankTab === 'Semua' || cat === qBankTab;
      const matchLevel =
        qLevelFilter === 'Semua' || q.levelKognitif === qLevelFilter;
      const matchSearch =
        !qSearch.trim() ||
        q.pertanyaan.toLowerCase().includes(qSearch.toLowerCase()) ||
        q.mataPelajaran.toLowerCase().includes(qSearch.toLowerCase()) ||
        q.kodeSoal.toLowerCase().includes(qSearch.toLowerCase());
      return matchTab && matchLevel && matchSearch;
    });

    const startEditQ = (q: QuestionBankItem) => {
      setEditingQ(q);
      setQMapel(q.mataPelajaran);
      setQKelas(q.kelas);
      setQKategoriBank(
        q.kategoriBank ||
          (q.tipeSoal === 'LKPD Praktik' ? 'Bank LKPD' : 'Bank Soal')
      );
      setQLevel(q.levelKognitif);
      setQTipe(q.tipeSoal);
      setQText(q.pertanyaan);
      setQKey(q.kunciJawaban);
      setQTp(q.indikatorTP);
    };

    const resetQForm = () => {
      setEditingQ(null);
      setQText('');
      setQKey('');
      setQTp('');
    };

    const handleSaveQ = (e: React.FormEvent) => {
      e.preventDefault();
      if (!qText.trim()) return;
      onSaveQuestion(
        {
          id: editingQ
            ? editingQ.id
            : `SOAL-${Date.now().toString().slice(-4)}`,
          kodeSoal: editingQ
            ? editingQ.kodeSoal
            : `${qKategoriBank === 'Bank LKPD' ? 'LKPD' : 'BNK'}-${Date.now()
                .toString()
                .slice(-3)}`,
          mataPelajaran: qMapel,
          kelas: qKelas,
          kategoriBank: qKategoriBank,
          levelKognitif: qLevel,
          tipeSoal:
            qKategoriBank === 'Bank LKPD' ? 'LKPD Praktik' : qTipe,
          pertanyaan: qText.trim().includes('[DEMO]')
            ? qText.trim()
            : `${qText.trim()} [DEMO]`,
          kunciJawaban: qKey.trim() || 'Sesuai rubrik penilaian guru.',
          indikatorTP:
            qTp.trim() ||
            'Memahami konsep esensial sesuai Tujuan Pembelajaran.',
        },
        Boolean(editingQ)
      );
      resetQForm();
    };

    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-600">
              05. SIGAP ASSESS · Repositori Bank Soal &amp; Bank LKPD [DEMO]
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
              Bank Soal Literasi-Numerasi &amp; Bank LKPD SD Negeri Karanggintung 06
            </h2>
          </div>

          <TabsNav
            tabs={[
              { id: 'Semua', label: 'Semua Koleksi', count: questions.length },
              {
                id: 'Bank Soal',
                label: 'Bank Soal',
                count: questions.filter(
                  (q) =>
                    (q.kategoriBank ||
                      (q.tipeSoal === 'LKPD Praktik'
                        ? 'Bank LKPD'
                        : 'Bank Soal')) === 'Bank Soal'
                ).length,
              },
              {
                id: 'Bank LKPD',
                label: 'Bank LKPD',
                count: questions.filter(
                  (q) =>
                    (q.kategoriBank ||
                      (q.tipeSoal === 'LKPD Praktik'
                        ? 'Bank LKPD'
                        : 'Bank Soal')) === 'Bank LKPD'
                ).length,
              },
            ]}
            activeTab={qBankTab}
            onChange={(id) =>
              setQBankTab(id as 'Semua' | 'Bank Soal' | 'Bank LKPD')
            }
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <SearchBarInput
            value={qSearch}
            onChange={setQSearch}
            placeholder="Cari butir soal, instruksi LKPD, mata pelajaran, atau kode..."
          />
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
            {[
              'Semua',
              'L1 - Pemahaman',
              'L2 - Penerapan',
              'L3 - Penalaran (HOTS)',
            ].map((lv) => (
              <button
                key={lv}
                type="button"
                onClick={() => setQLevelFilter(lv)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                  qLevelFilter === lv
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                {lv}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold text-blue-700">
                    [{q.kategoriBank || 'Bank Soal'}] {q.mataPelajaran} ·{' '}
                    {q.kelas} · {q.tipeSoal}
                  </span>
                  <span className="font-mono">{q.kodeSoal}</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-700">
                  Level Kognitif: {q.levelKognitif}
                </div>
                <p className="text-sm font-bold text-slate-900 leading-relaxed">
                  {q.pertanyaan}
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedQuestion(q)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 font-bold inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Kunci &amp; Detail</span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => startEditQ(q)}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteQ(q)}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredQuestions.length === 0 && (
              <div className="bg-white rounded-3xl border border-slate-200">
                <EmptyStateBox
                  title="Belum ada butir soal / LKPD yang sesuai filter"
                  description="Silakan ubah tab kategori atau tambahkan soal/LKPD baru."
                />
              </div>
            )}
          </div>

          <form
            onSubmit={handleSaveQ}
            className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs self-start"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                {editingQ
                  ? 'Edit Soal / LKPD'
                  : 'Tambah ke Bank Soal / Bank LKPD'}
              </h3>
              {editingQ && (
                <button
                  type="button"
                  onClick={resetQForm}
                  className="text-slate-500 font-bold"
                >
                  Batal
                </button>
              )}
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kategori Penyimpanan
              </label>
              <select
                value={qKategoriBank}
                onChange={(e) =>
                  setQKategoriBank(
                    e.target.value as QuestionBankItem['kategoriBank']
                  )
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                <option value="Bank Soal">Bank Soal Evaluasi</option>
                <option value="Bank LKPD">
                  Bank LKPD (Lembar Kerja Peserta Didik)
                </option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={qMapel}
                  onChange={(e) => setQMapel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kelas
                </label>
                <select
                  value={qKelas}
                  onChange={(e) => setQKelas(e.target.value)}
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Level Kognitif
                </label>
                <select
                  value={qLevel}
                  onChange={(e) =>
                    setQLevel(
                      e.target.value as QuestionBankItem['levelKognitif']
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                >
                  <option value="L1 - Pemahaman">L1 - Pemahaman</option>
                  <option value="L2 - Penerapan">L2 - Penerapan</option>
                  <option value="L3 - Penalaran (HOTS)">
                    L3 - Penalaran (HOTS)
                  </option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tipe Instrumen
                </label>
                <select
                  value={qTipe}
                  onChange={(e) =>
                    setQTipe(e.target.value as QuestionBankItem['tipeSoal'])
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                >
                  <option value="Pilihan Ganda">Pilihan Ganda</option>
                  <option value="Uraian">Uraian</option>
                  <option value="LKPD Praktik">LKPD Praktik</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Butir Pertanyaan / Instruksi LKPD *
              </label>
              <textarea
                rows={3}
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Tuliskan soal atau instruksi aktivitas..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kunci Jawaban / Rubrik Penilaian
              </label>
              <input
                type="text"
                value={qKey}
                onChange={(e) => setQKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>
                {editingQ ? 'Simpan Perubahan' : 'Simpan ke Bank Soal / LKPD'}
              </span>
            </button>
          </form>
        </div>

        <DetailDrawer
          isOpen={Boolean(selectedQuestion)}
          title={`${selectedQuestion?.mataPelajaran} · ${selectedQuestion?.kelas}`}
          subtitle={`Detail ${selectedQuestion?.kategoriBank || 'Bank Soal'} (${
            selectedQuestion?.kodeSoal
          })`}
          onClose={() => setSelectedQuestion(null)}
        >
          {selectedQuestion && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#F4F8FF]">
                <strong>Pertanyaan / Instruksi:</strong>
                <p className="mt-1 text-slate-800 font-semibold">
                  {selectedQuestion.pertanyaan}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F4F8FF]">
                <strong>Kunci Jawaban / Rubrik:</strong>
                <p className="mt-1 text-emerald-800 font-bold">
                  {selectedQuestion.kunciJawaban}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F4F8FF]">
                <strong>Indikator TP &amp; Level:</strong>{' '}
                {selectedQuestion.indikatorTP} ({selectedQuestion.levelKognitif})
              </div>
            </div>
          )}
        </DetailDrawer>

        <ConfirmationDialog
          isOpen={Boolean(confirmDeleteQ)}
          title="Konfirmasi Hapus Soal / LKPD"
          description={`Apakah Anda yakin ingin menghapus item "${confirmDeleteQ?.kodeSoal}" dari penyimpanan lokal?`}
          confirmLabel="Ya, Hapus"
          onCancel={() => setConfirmDeleteQ(null)}
          onConfirm={() => {
            if (confirmDeleteQ) {
              onDeleteQuestion(confirmDeleteQ.id);
              setConfirmDeleteQ(null);
            }
          }}
        />
      </div>
    );
  }

  /* ------------------- 3. INSTRUMEN ASESMEN & REMEDIAL/PENGAYAAN ------------------- */
  const isRemedial = subMenuId === 'remedial-pengayaan';
  const currentList = assessPrograms.filter((p) =>
    isRemedial
      ? p.kategoriModul === 'remedial-pengayaan'
      : p.kategoriModul === 'instrumen-asesmen'
  );
  const categories = isRemedial
    ? ['Semua', 'Remedial', 'Pengayaan']
    : ['Semua', 'Diagnostik', 'Formatif', 'Sumatif'];

  const filteredAssess = currentList.filter((item) => {
    const matchCat =
      assessCategory === 'Semua' || item.jenis === assessCategory;
    const matchSearch =
      !assessSearch.trim() ||
      item.judul.toLowerCase().includes(assessSearch.toLowerCase()) ||
      item.mapel.toLowerCase().includes(assessSearch.toLowerCase()) ||
      item.kelas.toLowerCase().includes(assessSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const startEditAssess = (item: AssessProgramItem) => {
    setEditingAssess(item);
    setNewInsJudul(item.judul);
    setNewInsJenis(item.jenis);
    setNewInsKelas(item.kelas);
    setNewInsMapel(item.mapel);
    setNewInsSasaran(item.pesertaSasaran || 'Siswa Kelas IV [DEMO]');
    setNewInsDesc(item.deskripsi);
  };

  const resetAssessForm = () => {
    setEditingAssess(null);
    setNewInsJudul('');
    setNewInsDesc('');
  };

  const handleSaveAssess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInsJudul.trim()) return;
    onSaveAssessProgram(
      {
        id: editingAssess
          ? editingAssess.id
          : `ASR-${Date.now().toString().slice(-4)}`,
        kode: editingAssess
          ? editingAssess.kode
          : `${isRemedial ? 'REM' : 'INS'}-${Date.now().toString().slice(-3)}`,
        judul: newInsJudul.trim().includes('[DEMO]')
          ? newInsJudul.trim()
          : `${newInsJudul.trim()} [DEMO]`,
        kategoriModul: isRemedial ? 'remedial-pengayaan' : 'instrumen-asesmen',
        jenis: isRemedial
          ? newInsJenis === 'Pengayaan'
            ? 'Pengayaan'
            : 'Remedial'
          : newInsJenis,
        kelas: newInsKelas,
        mapel: newInsMapel,
        pesertaSasaran: newInsSasaran,
        deskripsi:
          newInsDesc.trim() ||
          'Instrumen/program tindak lanjut pembelajaran Kurikulum Merdeka.',
      },
      Boolean(editingAssess)
    );
    resetAssessForm();
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-600">
              05. SIGAP ASSESS ·{' '}
              {isRemedial
                ? 'Data Remedial & Data Pengayaan'
                : 'Instrumen Penilaian Kelas'}{' '}
              [DEMO]
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              {isRemedial
                ? 'Program Remedial & Pengayaan Terpadu'
                : 'Instrumen Asesmen Diagnostik, Formatif & Sumatif'}
            </h2>
            <p className="text-xs text-slate-500">
              Kelola tambah, edit, cari, lihat detail, dan hapus data secara lokal.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <SearchBarInput
          value={assessSearch}
          onChange={setAssessSearch}
          placeholder="Cari judul instrumen/program, kelas, atau mata pelajaran..."
        />
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setAssessCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                assessCategory === c
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
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F4F8FF] border-b border-slate-200 font-bold text-slate-600">
                  <th className="py-3.5 px-4">Kode &amp; Jenis</th>
                  <th className="py-3.5 px-4">Judul Program / Instrumen</th>
                  <th className="py-3.5 px-4">Kelas &amp; Mapel</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssess.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-800">
                        {item.kode}
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700">
                        {item.jenis}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {item.judul}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {item.deskripsi}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-blue-700">
                        {item.kelas}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.mapel}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedAssessItem(item)}
                          className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 font-semibold inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditAssess(item)}
                          className="px-2 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteAssess(item)}
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
          onSubmit={handleSaveAssess}
          className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs self-start"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              {editingAssess
                ? 'Edit Data'
                : `Tambah ${
                    isRemedial
                      ? 'Data Remedial/Pengayaan'
                      : 'Instrumen Asesmen'
                  }`}
            </h3>
            {editingAssess && (
              <button
                type="button"
                onClick={resetAssessForm}
                className="text-slate-500 font-bold"
              >
                Batal
              </button>
            )}
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Judul *
            </label>
            <input
              type="text"
              value={newInsJudul}
              onChange={(e) => setNewInsJudul(e.target.value)}
              placeholder="Masukkan judul..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jenis
              </label>
              <select
                value={newInsJenis}
                onChange={(e) =>
                  setNewInsJenis(e.target.value as AssessProgramItem['jenis'])
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                {isRemedial ? (
                  <>
                    <option value="Remedial">Remedial</option>
                    <option value="Pengayaan">Pengayaan</option>
                  </>
                ) : (
                  <>
                    <option value="Diagnostik">Diagnostik</option>
                    <option value="Formatif">Formatif</option>
                    <option value="Sumatif">Sumatif</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kelas
              </label>
              <input
                type="text"
                value={newInsKelas}
                onChange={(e) => setNewInsKelas(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mata Pelajaran
            </label>
            <input
              type="text"
              value={newInsMapel}
              onChange={(e) => setNewInsMapel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Deskripsi Pelaksanaan
            </label>
            <textarea
              rows={3}
              value={newInsDesc}
              onChange={(e) => setNewInsDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            {editingAssess ? 'Simpan Perubahan' : 'Simpan Data'}
          </button>
        </form>
      </div>

      <DetailDrawer
        isOpen={Boolean(selectedAssessItem)}
        title={selectedAssessItem?.judul || ''}
        subtitle={`${selectedAssessItem?.kode} · ${selectedAssessItem?.jenis}`}
        onClose={() => setSelectedAssessItem(null)}
      >
        {selectedAssessItem && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#F4F8FF]">
              <strong>Sasaran Kelas &amp; Mapel:</strong>{' '}
              {selectedAssessItem.kelas} · {selectedAssessItem.mapel}
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F4F8FF]">
              <strong>Rincian Pelaksanaan:</strong>
              <p className="mt-1 text-slate-700">
                {selectedAssessItem.deskripsi}
              </p>
            </div>
          </div>
        )}
      </DetailDrawer>

      <ConfirmationDialog
        isOpen={Boolean(confirmDeleteAssess)}
        title="Konfirmasi Hapus Data"
        description={`Apakah Anda yakin ingin menghapus "${confirmDeleteAssess?.judul}"?`}
        confirmLabel="Ya, Hapus"
        onCancel={() => setConfirmDeleteAssess(null)}
        onConfirm={() => {
          if (confirmDeleteAssess) {
            onDeleteAssessProgram(confirmDeleteAssess.id);
            setConfirmDeleteAssess(null);
          }
        }}
      />
    </div>
  );
};

/* ==========================================================================
   9. SIGAP DIGITAL HUB INTEGRATION PAGES (Tahap 3: Form URL, Validasi URL,
      Simpan, Edit URL, Buka Aplikasi, Status Belum/Sudah Dikonfigurasi)
   ========================================================================== */
export const DigitalHubIntegrationModule: React.FC<{
  subMenuId: SubMenuId;
  digitalApps: DigitalHubApp[];
  onUpdateAppEndpoint: (id: SubMenuId, endpointUrl: string) => void;
  onNavigate?: (id: SubMenuId) => void;
}> = ({ subMenuId, digitalApps, onUpdateAppEndpoint, onNavigate }) => {
  const currentApp =
    digitalApps.find((a) => a.id === subMenuId) || digitalApps[0];
  const [endpointInput, setEndpointInput] = useState(currentApp.endpointUrl);
  const [isEditingUrl, setIsEditingUrl] = useState(!currentApp.endpointUrl);
  const [urlError, setUrlError] = useState('');
  const [syncMessage, setSyncMessage] = useState('');
  const [launchNoticeApp, setLaunchNoticeApp] = useState<DigitalHubApp | null>(
    null
  );

  React.useEffect(() => {
    setEndpointInput(currentApp.endpointUrl);
    setIsEditingUrl(!currentApp.endpointUrl);
    setUrlError('');
    setSyncMessage('');
  }, [currentApp]);

  const handleSaveEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateExternalUrl(endpointInput);
    if (!validation.isValid) {
      setUrlError(validation.error || 'URL tidak valid.');
      setSyncMessage('');
      return;
    }
    setUrlError('');
    onUpdateAppEndpoint(currentApp.id, validation.normalizedUrl);
    setIsEditingUrl(false);
    setSyncMessage(
      validation.normalizedUrl
        ? `Status diperbarui menjadi "URL Sudah Dikonfigurasi" dan tersimpan di localStorage.`
        : `URL dikosongkan. Status kembali menjadi "URL Belum Dikonfigurasi".`
    );
  };

  const handleOpenApp = (app: DigitalHubApp) => {
    if (app.endpointUrl && app.endpointUrl.trim()) {
      window.open(app.endpointUrl, '_blank', 'noopener,noreferrer');
    } else {
      setLaunchNoticeApp(app);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F1E36] via-[#162C52] to-[#2563EB] text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-sky-300">
              06. SIGAP DIGITAL HUB · Pengaturan URL Aplikasi Eksternal [DEMO]
            </div>
            <h2 className="text-2xl font-extrabold font-display mt-1">
              {currentApp.name}
            </h2>
            <p className="text-xs sm:text-sm text-sky-100/90 mt-1 max-w-2xl">
              {currentApp.tagline} — {currentApp.description}
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-right shrink-0">
            <div className="text-[11px] text-sky-200">Status Konfigurasi URL</div>
            <div
              className={`text-sm font-extrabold mt-0.5 ${
                currentApp.endpointUrl ? 'text-emerald-300' : 'text-amber-300'
              }`}
            >
              {currentApp.endpointUrl
                ? 'URL Sudah Dikonfigurasi'
                : 'URL Belum Dikonfigurasi'}
            </div>
            <button
              type="button"
              onClick={() => handleOpenApp(currentApp)}
              className="mt-2.5 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <span>Buka Aplikasi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Application Cards Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <h3 className="text-base font-extrabold text-slate-900 font-display">
          Daftar 4 Aplikasi Ekosistem SIGAP DIGITAL HUB
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Konfigurasi URL tersimpan secara permanen di penyimpanan lokal (localStorage):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {digitalApps.map((app) => {
            const isCurrent = app.id === currentApp.id;
            const isConfigured = Boolean(app.endpointUrl);
            return (
              <div
                key={app.id}
                className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-blue-50/60 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-[#F4F8FF]/50 border-slate-200/90 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[11px] font-bold ${
                        isConfigured ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {isConfigured
                        ? 'URL Sudah Dikonfigurasi'
                        : 'URL Belum Dikonfigurasi'}
                    </span>
                  </div>
                  <h4
                    onClick={() => onNavigate && onNavigate(app.id)}
                    className="text-sm font-extrabold text-slate-900 mt-3 font-display cursor-pointer hover:text-blue-600"
                  >
                    {app.name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {app.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) onNavigate(app.id);
                      setIsEditingUrl(true);
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Atur URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenApp(app)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>Buka Aplikasi</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Memasukkan & Mengedit URL dengan Validasi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Lingkup Integrasi Modul {currentApp.name}
            </h3>
          </div>
          <div className="space-y-2.5">
            {currentApp.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#F4F8FF] text-xs font-semibold text-slate-800"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSaveEndpoint}
          className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4 text-xs self-start"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Konfigurasi URL ({currentApp.name})
            </h3>
            {currentApp.endpointUrl && !isEditingUrl && (
              <button
                type="button"
                onClick={() => setIsEditingUrl(true)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold inline-flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit URL</span>
              </button>
            )}
          </div>

          <p className="text-slate-500">
            Status saat ini:{' '}
            <strong
              className={
                currentApp.endpointUrl ? 'text-emerald-700' : 'text-amber-700'
              }
            >
              {currentApp.endpointUrl
                ? 'URL Sudah Dikonfigurasi'
                : 'URL Belum Dikonfigurasi'}
            </strong>
          </p>

          <ErrorStateBox message={urlError} />

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Alamat URL Aplikasi (Wajib diawali https:// atau http://)
            </label>
            <input
              type="text"
              disabled={!isEditingUrl && Boolean(currentApp.endpointUrl)}
              value={endpointInput}
              onChange={(e) => setEndpointInput(e.target.value)}
              placeholder="Contoh: https://sikumer-sdnkaranggintung06.sch.id"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-[#F4F8FF] disabled:opacity-70 font-mono text-xs"
            />
          </div>

          {syncMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
              {syncMessage}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {(isEditingUrl || !currentApp.endpointUrl) && (
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
              >
                Simpan URL
              </button>
            )}
            <button
              type="button"
              onClick={() => handleOpenApp(currentApp)}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold inline-flex items-center gap-1.5"
            >
              <span>Buka Aplikasi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Modal Informasi Saat URL Belum Dikonfigurasi */}
      <ModalDialog
        isOpen={Boolean(launchNoticeApp)}
        title={launchNoticeApp?.name || ''}
        subtitle="Status: URL Belum Dikonfigurasi"
        onClose={() => setLaunchNoticeApp(null)}
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed bg-[#F4F8FF] p-3.5 rounded-2xl">
            Tautan URL eksternal untuk aplikasi{' '}
            <strong>{launchNoticeApp?.name}</strong> saat ini berstatus{' '}
            <strong>&quot;URL Belum Dikonfigurasi&quot;</strong>. Silakan masukkan
            alamat URL yang valid pada form pengaturan URL untuk membuka aplikasi.
          </p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setLaunchNoticeApp(null)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
            >
              Mengerti &amp; Tutup
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
};

/* ==========================================================================
   10. SIGAP CLASSHUB MODULES (Tahap 3: Membuat Kelas, Tambah/Edit/Hapus Materi,
       Buat/Edit/Hapus Tugas, Detail Tugas, Simulasi Pengumpulan & Status)
   ========================================================================== */
export const ClassHubModules: React.FC<{
  subMenuId: SubMenuId;
  classHubRooms: ClassHubRoom[];
  onSaveClassHubRoom: (room: ClassHubRoom, isEdit: boolean) => void;
  onDeleteClassHubRoom: (id: string) => void;
  assignments: ClassHubAssignment[];
  onSaveAssignment: (a: ClassHubAssignment, isEdit: boolean) => void;
  onDeleteAssignment: (id: string) => void;
  submissions: StudentSubmission[];
  onSaveSubmission: (s: StudentSubmission, isEdit: boolean) => void;
  onDeleteSubmission: (id: string) => void;
  onGradeSubmission: (id: string, nilai: number, catatan: string) => void;
  curriculumDocs: CurriculumDoc[];
  onSaveCurriculumDoc: (doc: CurriculumDoc, isEdit: boolean) => void;
  onDeleteCurriculumDoc: (id: string) => void;
}> = ({
  subMenuId,
  classHubRooms,
  onSaveClassHubRoom,
  onDeleteClassHubRoom,
  assignments,
  onSaveAssignment,
  onDeleteAssignment,
  submissions,
  onSaveSubmission,
  onDeleteSubmission,
  onGradeSubmission,
  curriculumDocs,
  onSaveCurriculumDoc,
  onDeleteCurriculumDoc,
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState('Semua');

  // Room states
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<ClassHubRoom | null>(null);
  const [confirmDeleteRoom, setConfirmDeleteRoom] =
    useState<ClassHubRoom | null>(null);
  const [rmNama, setRmNama] = useState('');
  const [rmRombel, setRmRombel] = useState('Kelas IV');
  const [rmWali, setRmWali] = useState('Nadia Permatasari, S.Pd. [DEMO]');
  const [rmMapel, setRmMapel] = useState('IPAS & Literasi');
  const [rmSiswa, setRmSiswa] = useState(30);

  // Material states
  const [selectedMaterialDetail, setSelectedMaterialDetail] =
    useState<CurriculumDoc | null>(null);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<CurriculumDoc | null>(
    null
  );
  const [confirmDeleteMaterial, setConfirmDeleteMaterial] =
    useState<CurriculumDoc | null>(null);
  const [matJudul, setMatJudul] = useState('');
  const [matMapel, setMatMapel] = useState('IPAS');
  const [matKelas, setMatKelas] = useState('Kelas IV');
  const [matRingkasan, setMatRingkasan] = useState('');

  // Assignment states
  const [selectedTaskDetail, setSelectedTaskDetail] =
    useState<ClassHubAssignment | null>(null);
  const [editingTask, setEditingTask] = useState<ClassHubAssignment | null>(
    null
  );
  const [confirmDeleteTask, setConfirmDeleteTask] =
    useState<ClassHubAssignment | null>(null);
  const [asJudul, setAsJudul] = useState('');
  const [asMapel, setAsMapel] = useState('IPAS');
  const [asKelas, setAsKelas] = useState('Kelas IV');
  const [asTenggat, setAsTenggat] = useState('2026-11-20');
  const [asInstruksi, setAsInstruksi] = useState('');

  // Submission states
  const [selectedStudentWork, setSelectedStudentWork] =
    useState<StudentSubmission | null>(null);
  const [confirmDeleteSub, setConfirmDeleteSub] =
    useState<StudentSubmission | null>(null);
  const [subStudent, setSubStudent] = useState('Khansa Zahra Amalia [DEMO]');
  const [subRombel, setSubRombel] = useState('Kelas IV');
  const [subTaskTitle, setSubTaskTitle] = useState(
    assignments[0]?.judul || 'Laporan Pengamatan Tumbuhan [DEMO]'
  );
  const [subJawaban, setSubJawaban] = useState('');

  /* ------------------- 1. MATERI PEMBELAJARAN ------------------- */
  if (subMenuId === 'materi-pembelajaran') {
    const openAddMat = () => {
      setEditingMaterial(null);
      setMatJudul('');
      setMatMapel('IPAS');
      setMatKelas('Kelas IV');
      setMatRingkasan('');
      setIsMaterialModalOpen(true);
    };

    const openEditMat = (doc: CurriculumDoc) => {
      setEditingMaterial(doc);
      setMatJudul(doc.judul);
      setMatMapel(doc.mataPelajaran);
      setMatKelas(doc.kelas);
      setMatRingkasan(doc.ringkasan);
      setIsMaterialModalOpen(true);
    };

    const handleSaveMaterial = (e: React.FormEvent) => {
      e.preventDefault();
      if (!matJudul.trim()) return;
      onSaveCurriculumDoc(
        {
          id: editingMaterial
            ? editingMaterial.id
            : `DOC-${Date.now().toString().slice(-4)}`,
          kode: editingMaterial
            ? editingMaterial.kode
            : `MAT-${Date.now().toString().slice(-3)}`,
          judul: matJudul.trim().includes('[DEMO]')
            ? matJudul.trim()
            : `${matJudul.trim()} [DEMO]`,
          mataPelajaran: matMapel,
          kelas: matKelas,
          fase:
            matKelas === 'Kelas I' || matKelas === 'Kelas II'
              ? 'Fase A'
              : matKelas === 'Kelas III' || matKelas === 'Kelas IV'
              ? 'Fase B'
              : 'Fase C',
          semester: 'Ganjil',
          tipe: 'Bahan Ajar',
          penyusun: 'Guru Kelas SD Negeri Karanggintung 06 [DEMO]',
          updatedAt: '06 Nov 2026',
          status: 'Terverifikasi Kepala Sekolah',
          ringkasan:
            matRingkasan.trim() ||
            'Materi pembelajaran mandiri terstruktur untuk siswa.',
        },
        Boolean(editingMaterial)
      );
      setIsMaterialModalOpen(false);
    };

    if (selectedMaterialDetail) {
      return (
        <div className="space-y-6 pb-10">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedMaterialDetail(null)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Daftar Materi</span>
              </button>
              <div>
                <div className="text-xs font-bold text-purple-600">
                  Detail Materi Pembelajaran ClassHub [DEMO]
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 font-display">
                  {selectedMaterialDetail.judul}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4 text-xs leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F4F8FF]">
              <div>
                <span className="text-slate-500">Mata Pelajaran:</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedMaterialDetail.mataPelajaran}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Sasaran Kelas / Fase:</span>
                <div className="font-bold text-blue-700 mt-0.5">
                  {selectedMaterialDetail.kelas} ({selectedMaterialDetail.fase})
                </div>
              </div>
              <div>
                <span className="text-slate-500">Guru Pengampu:</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedMaterialDetail.penyusun}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Uraian Materi Belajar Mandiri
              </h3>
              <p className="text-slate-700 mt-1.5">
                {selectedMaterialDetail.ringkasan}
              </p>
            </div>
          </div>
        </div>
      );
    }

    const filteredMaterials =
      selectedClassFilter === 'Semua'
        ? curriculumDocs
        : curriculumDocs.filter((d) => d.kelas.includes(selectedClassFilter));

    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-purple-600">
              07. SIGAP CLASSHUB · Materi Belajar Mandiri Siswa [DEMO]
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
              Materi Pembelajaran Digital Kelas I s.d. Kelas VI
            </h2>
          </div>

          <button
            type="button"
            onClick={openAddMat}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Materi Baru</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-white p-3 rounded-2xl border border-slate-200">
          {[
            'Semua',
            'Kelas I',
            'Kelas II',
            'Kelas III',
            'Kelas IV',
            'Kelas V',
            'Kelas VI',
          ].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setSelectedClassFilter(k)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                selectedClassFilter === k
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-purple-700">
                  {doc.kelas} ({doc.fase}) · {doc.mataPelajaran}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1 font-display">
                  {doc.judul}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {doc.ringkasan}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedMaterialDetail(doc)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 font-bold inline-flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Baca Materi</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditMat(doc)}
                    className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteMaterial(doc)}
                    className="p-1.5 rounded-xl bg-rose-50 text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ModalDialog
          isOpen={isMaterialModalOpen}
          title={
            editingMaterial
              ? 'Edit Materi Pembelajaran'
              : 'Tambah Materi Pembelajaran ClassHub'
          }
          onClose={() => setIsMaterialModalOpen(false)}
        >
          <form onSubmit={handleSaveMaterial} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Judul Materi *
              </label>
              <input
                type="text"
                value={matJudul}
                onChange={(e) => setMatJudul(e.target.value)}
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
                  value={matMapel}
                  onChange={(e) => setMatMapel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kelas
                </label>
                <select
                  value={matKelas}
                  onChange={(e) => setMatKelas(e.target.value)}
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
                Ringkasan / Isi Materi
              </label>
              <textarea
                rows={4}
                value={matRingkasan}
                onChange={(e) => setMatRingkasan(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsMaterialModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
              >
                Simpan Materi
              </button>
            </div>
          </form>
        </ModalDialog>

        <ConfirmationDialog
          isOpen={Boolean(confirmDeleteMaterial)}
          title="Konfirmasi Hapus Materi"
          description={`Apakah Anda yakin ingin menghapus materi "${confirmDeleteMaterial?.judul}"?`}
          confirmLabel="Ya, Hapus Materi"
          onCancel={() => setConfirmDeleteMaterial(null)}
          onConfirm={() => {
            if (confirmDeleteMaterial) {
              onDeleteCurriculumDoc(confirmDeleteMaterial.id);
              setConfirmDeleteMaterial(null);
            }
          }}
        />
      </div>
    );
  }

  /* ------------------- 2. TUGAS SISWA ------------------- */
  if (subMenuId === 'tugas-siswa') {
    const startEditTask = (a: ClassHubAssignment) => {
      setEditingTask(a);
      setAsJudul(a.judul);
      setAsMapel(a.mataPelajaran);
      setAsKelas(a.kelas);
      setAsTenggat(a.tenggat);
      setAsInstruksi(a.instruksi || '');
    };

    const resetTaskForm = () => {
      setEditingTask(null);
      setAsJudul('');
      setAsInstruksi('');
    };

    const handleSaveTask = (e: React.FormEvent) => {
      e.preventDefault();
      if (!asJudul.trim()) return;
      onSaveAssignment(
        {
          id: editingTask
            ? editingTask.id
            : `TGS-${Date.now().toString().slice(-4)}`,
          judul: asJudul.trim().includes('[DEMO]')
            ? asJudul.trim()
            : `${asJudul.trim()} [DEMO]`,
          mataPelajaran: asMapel,
          kelas: asKelas,
          guru: 'Nadia Permatasari, S.Pd. [DEMO]',
          tenggat: asTenggat,
          instruksi:
            asInstruksi.trim() ||
            'Kerjakan tugas secara mandiri dan kumpulkan melalui menu Pengumpulan Tugas.',
          terkumpul: editingTask ? editingTask.terkumpul : 0,
          totalSiswa: editingTask ? editingTask.totalSiswa : 28,
          status: editingTask ? editingTask.status : 'Berlangsung',
        },
        Boolean(editingTask)
      );
      resetTaskForm();
    };

    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="text-xs font-bold text-purple-600">
            07. SIGAP CLASSHUB · Manajemen Penugasan Kelas [DEMO]
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
            Daftar Tugas Siswa SD Negeri Karanggintung 06
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Buat tugas baru, edit penugasan, hapus tugas, atau lihat detail instruksi tugas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            {assignments.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-purple-700">
                    {a.kelas} · {a.mataPelajaran}
                  </span>
                  <span>Tenggat: {a.tenggat}</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1 font-display">
                  {a.judul}
                </h3>
                {a.instruksi && (
                  <p className="text-xs text-slate-600 mt-1">{a.instruksi}</p>
                )}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Terkumpul:{' '}
                    <strong className="font-mono text-blue-700">
                      {a.terkumpul}/{a.totalSiswa}
                    </strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedTaskDetail(a)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 font-bold inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => startEditTask(a)}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteTask(a)}
                      className="p-1.5 rounded-xl bg-rose-50 text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSaveTask}
            className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs self-start"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                {editingTask ? 'Edit Tugas Siswa' : 'Buat Tugas Kelas Baru'}
              </h3>
              {editingTask && (
                <button
                  type="button"
                  onClick={resetTaskForm}
                  className="text-slate-500 font-bold"
                >
                  Batal
                </button>
              )}
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Judul Penugasan *
              </label>
              <input
                type="text"
                value={asJudul}
                onChange={(e) => setAsJudul(e.target.value)}
                placeholder="Contoh: Menggambar Peta Lingkungan Rumah"
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
                  value={asMapel}
                  onChange={(e) => setAsMapel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kelas
                </label>
                <select
                  value={asKelas}
                  onChange={(e) => setAsKelas(e.target.value)}
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
                Tanggal Tenggat Pengumpulan
              </label>
              <input
                type="date"
                value={asTenggat}
                onChange={(e) => setAsTenggat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Instruksi Pengerjaan
              </label>
              <textarea
                rows={3}
                value={asInstruksi}
                onChange={(e) => setAsInstruksi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {editingTask
                ? 'Simpan Perubahan Tugas'
                : 'Terbitkan Tugas Siswa'}
            </button>
          </form>
        </div>

        <DetailDrawer
          isOpen={Boolean(selectedTaskDetail)}
          title={selectedTaskDetail?.judul || ''}
          subtitle={`Detail Tugas · ${selectedTaskDetail?.kelas} (${selectedTaskDetail?.mataPelajaran})`}
          onClose={() => setSelectedTaskDetail(null)}
        >
          {selectedTaskDetail && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#F4F8FF]">
                <strong>Guru Pengampu:</strong> {selectedTaskDetail.guru}
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F4F8FF]">
                <strong>Batas Waktu:</strong> {selectedTaskDetail.tenggat} ·
                Progres: {selectedTaskDetail.terkumpul}/
                {selectedTaskDetail.totalSiswa} siswa
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F4F8FF]">
                <strong>Instruksi Pengerjaan:</strong>
                <p className="mt-1 text-slate-700">
                  {selectedTaskDetail.instruksi ||
                    'Kerjakan sesuai petunjuk guru di kelas.'}
                </p>
              </div>
            </div>
          )}
        </DetailDrawer>

        <ConfirmationDialog
          isOpen={Boolean(confirmDeleteTask)}
          title="Konfirmasi Hapus Tugas Siswa"
          description={`Apakah Anda yakin ingin menghapus tugas "${confirmDeleteTask?.judul}"?`}
          confirmLabel="Ya, Hapus Tugas"
          onCancel={() => setConfirmDeleteTask(null)}
          onConfirm={() => {
            if (confirmDeleteTask) {
              onDeleteAssignment(confirmDeleteTask.id);
              setConfirmDeleteTask(null);
            }
          }}
        />
      </div>
    );
  }

  /* ------------------- 3. PENGUMPULAN TUGAS ------------------- */
  if (subMenuId === 'pengumpulan-tugas') {
    const handleStudentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!subStudent.trim()) return;
      onSaveSubmission(
        {
          id: `SUB-${Date.now().toString().slice(-4)}`,
          assignmentId: 'TGS-01',
          assignmentTitle: subTaskTitle,
          studentName: subStudent.trim().includes('[DEMO]')
            ? subStudent.trim()
            : `${subStudent.trim()} [DEMO]`,
          rombel: subRombel,
          submittedAt: 'Baru saja',
          jawabanSiswa:
            subJawaban.trim() ||
            'Laporan tugas mandiri siswa telah diselesaikan sesuai instruksi guru [DEMO].',
          nilai: null,
          catatanGuru: 'Menunggu verifikasi penilaian guru.',
          status: 'Menunggu Penilaian',
        },
        false
      );
      setSubJawaban('');
    };

    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="text-xs font-bold text-purple-600">
            07. SIGAP CLASSHUB · Simulasi Pengumpulan &amp; Status Tugas [DEMO]
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
            Pengumpulan Tugas &amp; Tampilan Pekerjaan Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau status pengumpulan, lihat lembar jawaban siswa, berikan nilai, atau uji simulasi kirim tugas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold text-blue-700">
                    {sub.studentName} · {sub.rombel}
                  </span>
                  <span>{sub.submittedAt}</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  {sub.assignmentTitle}
                </div>
                <div className="p-3 rounded-2xl bg-[#F4F8FF] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-slate-600">{sub.catatanGuru}</div>
                    <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                      Status: {sub.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedStudentWork(sub)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-800 font-bold inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Lihat Pekerjaan</span>
                    </button>
                    {sub.nilai !== null ? (
                      <span className="text-sm font-extrabold font-mono text-blue-700 px-2">
                        Nilai: {sub.nilai}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onGradeSubmission(
                            sub.id,
                            95,
                            'Karya sangat kreatif dan sesuai instruksi!'
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold"
                      >
                        Beri Nilai 95
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteSub(sub)}
                      className="p-1.5 rounded-xl bg-rose-50 text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleStudentSubmit}
            className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs self-start"
          >
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Simulasi Pengumpulan Tugas Siswa [DEMO]
            </h3>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Siswa *
              </label>
              <input
                type="text"
                value={subStudent}
                onChange={(e) => setSubStudent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kelas / Rombel
              </label>
              <select
                value={subRombel}
                onChange={(e) => setSubRombel(e.target.value)}
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
                Pilih Tugas yang Dikumpulkan
              </label>
              <select
                value={subTaskTitle}
                onChange={(e) => setSubTaskTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                {assignments.map((a) => (
                  <option key={a.id} value={a.judul}>
                    {a.judul}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Ringkasan Jawaban / Laporan Siswa
              </label>
              <textarea
                rows={3}
                value={subJawaban}
                onChange={(e) => setSubJawaban(e.target.value)}
                placeholder="Tuliskan hasil pengamatan atau jawaban tugas..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Pengumpulan Tugas</span>
            </button>
          </form>
        </div>

        <DetailDrawer
          isOpen={Boolean(selectedStudentWork)}
          title={`${selectedStudentWork?.studentName} (${selectedStudentWork?.rombel})`}
          subtitle="Tampilan Lembar Pekerjaan Siswa [DEMO]"
          onClose={() => setSelectedStudentWork(null)}
        >
          {selectedStudentWork && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#F4F8FF] space-y-2">
                <div className="font-bold text-slate-900">
                  Judul Tugas: {selectedStudentWork.assignmentTitle}
                </div>
                <div className="text-slate-500">
                  Waktu Kirim: {selectedStudentWork.submittedAt} · Status:{' '}
                  <strong>{selectedStudentWork.status}</strong>
                </div>
                <div className="p-3 rounded-xl bg-white border border-blue-100 text-slate-700">
                  <strong>Isi Jawaban / Laporan Siswa [DEMO]:</strong>
                  <p className="mt-1">
                    {selectedStudentWork.jawabanSiswa ||
                      'Saya telah menyelesaikan pengamatan dan latihan sesuai petunjuk guru [DEMO].'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DetailDrawer>

        <ConfirmationDialog
          isOpen={Boolean(confirmDeleteSub)}
          title="Konfirmasi Hapus Data Pengumpulan"
          description={`Apakah Anda yakin ingin menghapus data pengumpulan tugas oleh "${confirmDeleteSub?.studentName}"?`}
          confirmLabel="Ya, Hapus"
          onCancel={() => setConfirmDeleteSub(null)}
          onConfirm={() => {
            if (confirmDeleteSub) {
              onDeleteSubmission(confirmDeleteSub.id);
              setConfirmDeleteSub(null);
            }
          }}
        />
      </div>
    );
  }

  /* ------------------- 4. DASHBOARD KELAS (Membuat, Edit & Hapus Kelas Virtual) ------------------- */
  const openAddRoom = () => {
    setEditingRoom(null);
    setRmNama('');
    setRmRombel('Kelas IV');
    setRmWali('Nadia Permatasari, S.Pd. [DEMO]');
    setRmMapel('IPAS, Bahasa Indonesia & Matematika');
    setRmSiswa(30);
    setIsRoomModalOpen(true);
  };

  const openEditRoom = (room: ClassHubRoom) => {
    setEditingRoom(room);
    setRmNama(room.namaKelas);
    setRmRombel(room.rombel);
    setRmWali(room.waliKelas);
    setRmMapel(room.mataPelajaranUtama);
    setRmSiswa(room.jumlahSiswa);
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rmNama.trim()) return;
    onSaveClassHubRoom(
      {
        id: editingRoom
          ? editingRoom.id
          : `CLS-${Date.now().toString().slice(-4)}`,
        namaKelas: rmNama.trim().includes('[DEMO]')
          ? rmNama.trim()
          : `${rmNama.trim()} [DEMO]`,
        rombel: rmRombel,
        fase:
          rmRombel === 'Kelas I' || rmRombel === 'Kelas II'
            ? 'Fase A'
            : rmRombel === 'Kelas III' || rmRombel === 'Kelas IV'
            ? 'Fase B'
            : 'Fase C',
        waliKelas: rmWali,
        mataPelajaranUtama: rmMapel,
        jumlahSiswa: Number(rmSiswa) || 28,
        kodeAksesDemo: `SIGAP-${Date.now().toString().slice(-3)}`,
      },
      Boolean(editingRoom)
    );
    setIsRoomModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-600">
              07. SIGAP CLASSHUB · Smart LMS Sekolah Dasar [DEMO]
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              Dashboard Kelas Virtual SD Negeri Karanggintung 06
            </h2>
            <p className="text-xs text-slate-500">
              Kelola ruang kelas virtual Kelas I–VI beserta mata pelajaran aktif.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddRoom}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Kelas Baru</span>
        </button>
      </div>

      {/* Daftar Ruang Kelas Virtual */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 font-display">
          Daftar Ruang Kelas Virtual ({classHubRooms.length} Kelas Aktif)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classHubRooms.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#F4F8FF]/70 border border-blue-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-blue-700 font-bold">
                  <span>
                    {item.rombel} ({item.fase})
                  </span>
                  <span>{item.jumlahSiswa} Siswa [DEMO]</span>
                </div>
                <div className="text-base font-extrabold text-slate-900 font-display mt-1">
                  {item.namaKelas}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Wali Kelas: <strong>{item.waliKelas}</strong>
                </div>
                <div className="text-xs text-purple-700 font-semibold mt-1">
                  Mapel: {item.mataPelajaranUtama}
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-blue-100 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500">
                  Kode: {item.kodeAksesDemo}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditRoom(item)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-blue-700 font-bold"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteRoom(item)}
                    className="p-1 rounded-lg bg-rose-50 text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalDialog
        isOpen={isRoomModalOpen}
        title={
          editingRoom ? 'Edit Ruang Kelas Virtual' : 'Buat Kelas Virtual Baru'
        }
        onClose={() => setIsRoomModalOpen(false)}
      >
        <form onSubmit={handleSaveRoom} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nama Ruang Kelas Virtual *
            </label>
            <input
              type="text"
              value={rmNama}
              onChange={(e) => setRmNama(e.target.value)}
              placeholder="Contoh: Ruang Sains & Literasi Kelas IV"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Rombel
              </label>
              <select
                value={rmRombel}
                onChange={(e) => setRmRombel(e.target.value)}
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
                Jumlah Siswa
              </label>
              <input
                type="number"
                value={rmSiswa}
                onChange={(e) => setRmSiswa(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Wali Kelas / Guru Pengampu
            </label>
            <input
              type="text"
              value={rmWali}
              onChange={(e) => setRmWali(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mata Pelajaran Utama
            </label>
            <input
              type="text"
              value={rmMapel}
              onChange={(e) => setRmMapel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsRoomModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
            >
              Simpan Kelas
            </button>
          </div>
        </form>
      </ModalDialog>

      <ConfirmationDialog
        isOpen={Boolean(confirmDeleteRoom)}
        title="Konfirmasi Hapus Kelas Virtual"
        description={`Apakah Anda yakin ingin menghapus "${confirmDeleteRoom?.namaKelas}"?`}
        confirmLabel="Ya, Hapus Kelas"
        onCancel={() => setConfirmDeleteRoom(null)}
        onConfirm={() => {
          if (confirmDeleteRoom) {
            onDeleteClassHubRoom(confirmDeleteRoom.id);
            setConfirmDeleteRoom(null);
          }
        }}
      />
    </div>
  );
};

/* ==========================================================================
   11. SIGAP CONTROL CENTER MODULES (Tahap 3: Edit Profil & Identitas Portal,
       Preview Logo Resmi & Banner, Manajemen URL Aplikasi, Pengaturan Tampilan,
       Ekspor/Impor JSON, Reset Data DEMO dengan Konfirmasi, Log Aktivitas)
   ========================================================================== */
export const ControlCenterModules: React.FC<{
  subMenuId: SubMenuId;
  schoolIdentity: SchoolIdentity;
  onUpdateSchoolIdentity: (updated: SchoolIdentity) => void;
  portalSettings: PortalDisplaySettings;
  onUpdatePortalSettings: (updated: PortalDisplaySettings) => void;
  digitalApps: DigitalHubApp[];
  onUpdateAppEndpoint: (id: SubMenuId, endpointUrl: string) => void;
  activityLogs: ActivityLogItem[];
  onClearActivityLogs: () => void;
  onResetDemoData: () => void;
  onImportJsonBackup?: (rawJson: string) => void;
}> = ({
  subMenuId,
  schoolIdentity,
  onUpdateSchoolIdentity,
  portalSettings,
  onUpdatePortalSettings,
  digitalApps,
  onUpdateAppEndpoint,
  activityLogs,
  onClearActivityLogs,
  onResetDemoData,
  onImportJsonBackup,
}) => {
  const [formState, setFormState] = useState<SchoolIdentity>(schoolIdentity);
  const [confirmSaveIdentity, setConfirmSaveIdentity] = useState(false);
  const [confirmResetDemo, setConfirmResetDemo] = useState(false);
  const [confirmClearLogs, setConfirmClearLogs] = useState(false);
  const [logSearch, setLogSearch] = useState('');
  const [appUrlDrafts, setAppUrlDrafts] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(digitalApps.map((a) => [a.id, a.endpointUrl || '']))
  );
  const [appUrlErrors, setAppUrlErrors] = useState<Record<string, string>>({});

  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const importJsonRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setFormState(schoolIdentity);
  }, [schoolIdentity]);

  React.useEffect(() => {
    setAppUrlDrafts(
      Object.fromEntries(digitalApps.map((a) => [a.id, a.endpointUrl || '']))
    );
  }, [digitalApps]);

  /* ------------------- 1. IDENTITAS & BANNER SEKOLAH ------------------- */
  if (subMenuId === 'identitas-banner') {
    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const updated = { ...formState, bannerImageUrl: reader.result };
          setFormState(updated);
          onUpdateSchoolIdentity(updated);
        }
      };
      reader.readAsDataURL(file);
    };

    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-600">
                08. SIGAP CONTROL CENTER · Identitas Sekolah &amp; Portal [DEMO]
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 font-display">
                Pengaturan Profil Sekolah, Identitas Portal, Preview Logo &amp; Banner
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Unggah Foto Banner Sekolah</span>
            </button>
          </div>
        </div>

        {/* Preview Logo Resmi & Preview Banner Sekolah */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col items-center text-center justify-between">
            <div>
              <div className="font-bold text-blue-600">
                Preview Logo Resmi Aplikasi
              </div>
              <p className="text-slate-500 mt-0.5">
                Aset identitas resmi SMART SIGAP (tidak diubah/dipotong):
              </p>
            </div>
            <div className="my-4 p-4 rounded-3xl bg-[#0F1E36] border border-blue-900 w-36 h-36 flex items-center justify-center">
              <img
                src={OFFICIAL_LOGO_PATH}
                alt="Logo Resmi SMART SIGAP"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-[11px] text-slate-500">
              {formState.namaPortal || 'SMART SIGAP'} —{' '}
              {formState.taglinePortal ||
                'Sistem Integrasi Guru & Anak Pintar'}
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-blue-600">
                  Preview Banner Sekolah Saat Ini
                </div>
                <p className="text-slate-500">
                  Ditampilkan pada halaman utama Dashboard SMART SIGAP:
                </p>
              </div>
              {formState.bannerImageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...formState, bannerImageUrl: '' };
                    setFormState(updated);
                    onUpdateSchoolIdentity(updated);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold"
                >
                  Reset ke Banner Default
                </button>
              )}
            </div>

            {formState.bannerImageUrl ? (
              <img
                src={formState.bannerImageUrl}
                alt="Preview Banner Sekolah"
                className="w-full h-44 object-cover rounded-2xl border border-blue-200"
              />
            ) : (
              <div className="w-full h-44 rounded-2xl bg-gradient-to-r from-[#0F1E36] via-[#1E3A8A] to-[#2563EB] text-white p-6 flex flex-col justify-center">
                <div className="text-xs text-sky-300 font-bold">
                  Placeholder Banner Visual Resmi
                </div>
                <div className="text-lg font-extrabold font-display mt-1">
                  {formState.namaSekolah}
                </div>
                <p className="text-xs text-sky-100/80 mt-1 max-w-lg">
                  {formState.bannerCaption}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form Edit Profil Sekolah & Identitas Portal */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setConfirmSaveIdentity(true);
          }}
          className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4 text-xs"
        >
          <h3 className="text-base font-extrabold text-slate-900 font-display">
            Pengaturan Nama Sekolah, Identitas Portal &amp; Kepala Sekolah
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Sekolah
              </label>
              <input
                type="text"
                value={formState.namaSekolah}
                onChange={(e) =>
                  setFormState({ ...formState, namaSekolah: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Portal Sekolah
              </label>
              <input
                type="text"
                value={formState.namaPortal || 'SMART SIGAP'}
                onChange={(e) =>
                  setFormState({ ...formState, namaPortal: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tagline Portal
              </label>
              <input
                type="text"
                value={
                  formState.taglinePortal ||
                  'Sistem Integrasi Guru & Anak Pintar'
                }
                onChange={(e) =>
                  setFormState({ ...formState, taglinePortal: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                NPSN
              </label>
              <input
                type="text"
                value={formState.npsn}
                onChange={(e) =>
                  setFormState({ ...formState, npsn: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Akreditasi
              </label>
              <input
                type="text"
                value={formState.akreditasi}
                onChange={(e) =>
                  setFormState({ ...formState, akreditasi: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tahun Ajaran Aktif
              </label>
              <input
                type="text"
                value={formState.tahunAjaranAktif}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    tahunAjaranAktif: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Kepala Sekolah
              </label>
              <input
                type="text"
                value={formState.kepalaSekolah}
                onChange={(e) =>
                  setFormState({ ...formState, kepalaSekolah: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={formState.nipKepalaSekolah}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    nipKepalaSekolah: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email Resmi Sekolah
              </label>
              <input
                type="text"
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">
                Alamat Lengkap Sekolah
              </label>
              <input
                type="text"
                value={formState.alamat}
                onChange={(e) =>
                  setFormState({ ...formState, alamat: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>

            <div className="sm:col-span-3 pt-2 border-t border-slate-100">
              <h4 className="text-sm font-extrabold text-slate-900 font-display mb-3">
                Arah dan Tujuan Sekolah (Ditampilkan pada Beranda Dashboard)
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Visi Sekolah
                  </label>
                  <textarea
                    rows={4}
                    value={formState.visiSekolah || ''}
                    onChange={(e) =>
                      setFormState({ ...formState, visiSekolah: e.target.value })
                    }
                    placeholder="Masukkan rumusan visi resmi sekolah..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Misi Sekolah (1 baris per poin)
                  </label>
                  <textarea
                    rows={4}
                    value={formState.misiSekolah || ''}
                    onChange={(e) =>
                      setFormState({ ...formState, misiSekolah: e.target.value })
                    }
                    placeholder="Masukkan daftar misi resmi sekolah..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tujuan Sekolah (1 baris per poin)
                  </label>
                  <textarea
                    rows={4}
                    value={formState.tujuanSekolah || ''}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        tujuanSekolah: e.target.value,
                      })
                    }
                    placeholder="Masukkan tujuan pendidikan sekolah..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Simpan Identitas Sekolah &amp; Portal
            </button>
          </div>
        </form>

        <ConfirmationDialog
          isOpen={confirmSaveIdentity}
          variant="primary"
          title="Konfirmasi Perubahan Identitas Sekolah"
          description="Apakah Anda yakin ingin menyimpan perubahan identitas sekolah dan portal ke penyimpanan lokal?"
          confirmLabel="Ya, Simpan Perubahan"
          onCancel={() => setConfirmSaveIdentity(false)}
          onConfirm={() => {
            onUpdateSchoolIdentity(formState);
            setConfirmSaveIdentity(false);
          }}
        />
      </div>
    );
  }

  /* ------------------- 2. MANAJEMEN URL APLIKASI ------------------- */
  if (subMenuId === 'manajemen-aplikasi') {
    const handleSaveSingleAppUrl = (appId: SubMenuId) => {
      const raw = appUrlDrafts[appId] || '';
      const check = validateExternalUrl(raw);
      if (!check.isValid) {
        setAppUrlErrors((prev) => ({
          ...prev,
          [appId]: check.error || 'URL tidak valid',
        }));
        return;
      }
      setAppUrlErrors((prev) => ({ ...prev, [appId]: '' }));
      onUpdateAppEndpoint(appId, check.normalizedUrl);
    };

    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="text-xs font-bold text-blue-600">
            08. SIGAP CONTROL CENTER · Manajemen URL Aplikasi Digital Hub [DEMO]
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
            Manajemen URL &amp; Status Konektor 4 Aplikasi Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Atur alamat URL untuk Absensi Digital QR-WA, SIKUMER, Analisis Hasil Asesmen, dan Smart Learning Interaktif.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {digitalApps.map((app) => {
            const isConfigured = Boolean(app.endpointUrl);
            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">
                    {app.name}
                  </span>
                  <span
                    className={`font-bold ${
                      isConfigured ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {isConfigured
                      ? 'URL Sudah Dikonfigurasi'
                      : 'URL Belum Dikonfigurasi'}
                  </span>
                </div>
                <p className="text-slate-600">{app.description}</p>
                {appUrlErrors[app.id] && (
                  <ErrorStateBox message={appUrlErrors[app.id]} />
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={appUrlDrafts[app.id] || ''}
                    onChange={(e) =>
                      setAppUrlDrafts((prev) => ({
                        ...prev,
                        [app.id]: e.target.value,
                      }))
                    }
                    placeholder="https://alamat-aplikasi.sch.id (Kosongkan jika belum ada)"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveSingleAppUrl(app.id)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0"
                  >
                    Simpan URL
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ------------------- 3. PENGGUNA, HAK AKSES & PENGATURAN TAMPILAN ------------------- */
  if (subMenuId === 'pengguna-hak-akses') {
    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-600">
              08. SIGAP CONTROL CENTER · Matriks Otorisasi &amp; Pengaturan Tampilan [DEMO]
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              Pengguna, Hak Akses &amp; Preferensi Tampilan Portal
            </h2>
          </div>
        </div>

        {/* Pengaturan Tampilan Lokal */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-base font-extrabold text-slate-900 font-display">
            Pengaturan Tampilan Portal (Tersimpan di localStorage)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="p-4 rounded-2xl bg-[#F4F8FF] border border-blue-100 flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-bold text-slate-900">
                  Mode Tabel Ringkas
                </div>
                <div className="text-[11px] text-slate-500">
                  Rapatkan jarak baris pada tabel data master
                </div>
              </div>
              <input
                type="checkbox"
                checked={portalSettings.compactTable}
                onChange={(e) =>
                  onUpdatePortalSettings({
                    ...portalSettings,
                    compactTable: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-blue-600"
              />
            </label>

            <label className="p-4 rounded-2xl bg-[#F4F8FF] border border-blue-100 flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-bold text-slate-900">
                  Tampilkan Penanda [DEMO]
                </div>
                <div className="text-[11px] text-slate-500">
                  Beri penanda jelas pada seluruh data simulasi
                </div>
              </div>
              <input
                type="checkbox"
                checked={portalSettings.showDemoBadges}
                onChange={(e) =>
                  onUpdatePortalSettings({
                    ...portalSettings,
                    showDemoBadges: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-blue-600"
              />
            </label>

            <div className="p-4 rounded-2xl bg-[#F4F8FF] border border-blue-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">
                  Baris Default Tabel
                </div>
                <div className="text-[11px] text-slate-500">
                  Jumlah data per halaman
                </div>
              </div>
              <select
                value={portalSettings.defaultItemsPerPage}
                onChange={(e) =>
                  onUpdatePortalSettings({
                    ...portalSettings,
                    defaultItemsPerPage: Number(e.target.value),
                  })
                }
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
              >
                <option value={5}>5 Baris</option>
                <option value={10}>10 Baris</option>
                <option value={20}>20 Baris</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabel Hak Akses */}
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F4F8FF] border-b border-slate-200 font-bold text-slate-600">
                <th className="py-3.5 px-4">Peran Pengguna</th>
                <th className="py-3.5 px-4">Pejabat / Perwakilan [DEMO]</th>
                <th className="py-3.5 px-4">Cakupan Modul Akses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  Administrator
                </td>
                <td className="py-3.5 px-4">
                  Rizky Ananda Putri, S.Kom. [DEMO]
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  Seluruh 8 Kelompok Menu, Manajemen URL, Backup &amp; Control Center
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  Kepala Sekolah
                </td>
                <td className="py-3.5 px-4">
                  Yeni Andriyani, S.Pd.SD. [DEMO]
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  Supervisi Kurikulum, Monitoring Guru/Siswa, Pengumuman &amp; Evaluasi
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">Guru</td>
                <td className="py-3.5 px-4">
                  Dewan Guru Kelas I–VI &amp; Mapel [DEMO]
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  SIGAP Pedagogy, AI RPP Assistant, Jurnal, Assess &amp; ClassHub
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">Siswa</td>
                <td className="py-3.5 px-4">
                  Peserta Didik Kelas I–VI [DEMO]
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  SIGAP ClassHub (Materi Pembelajaran, Tugas, Pengumpulan Tugas)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ------------------- 4. DATABASE & BACKUP ------------------- */
  if (subMenuId === 'database-backup') {
    const handleExportJson = () => {
      const payload = {
        exportedAt: new Date().toISOString(),
        application: 'SMART SIGAP - SD NEGERI KARANGGINTUNG 06',
        schoolIdentity,
        digitalApps,
        activityLogsCount: activityLogs.length,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'backup-smart-sigap-sdnkaranggintung06.json';
      a.click();
      URL.revokeObjectURL(url);
    };

    const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !onImportJsonBackup) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onImportJsonBackup(reader.result);
        }
      };
      reader.readAsText(file);
    };

    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="text-xs font-bold text-blue-600">
            08. SIGAP CONTROL CENTER · Penyimpanan Lokal (localStorage) [DEMO]
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
            Database Lokal, Cadangan JSON &amp; Reset Data DEMO
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Seluruh modul memiliki kunci penyimpanan terpisah di localStorage tanpa menyimpan password atau rahasia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Ekspor Cadangan Data (.JSON)
              </h3>
              <p className="text-slate-600 mt-1">
                Unduh salinan konfigurasi sekolah dan data aplikasi dalam berkas JSON.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportJson}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Backup JSON</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Impor Cadangan JSON
              </h3>
              <p className="text-slate-600 mt-1">
                Pulihkan konfigurasi identitas sekolah dari berkas JSON lokal yang pernah diekspor.
              </p>
            </div>
            <div>
              <input
                ref={importJsonRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => importJsonRef.current?.click()}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold inline-flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Unggah File JSON</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 text-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Reset Seluruh Data DEMO Awal
              </h3>
              <p className="text-slate-600 mt-1">
                Kembalikan seluruh data guru, siswa, rombel, jadwal, dan perangkat ajar ke kondisi awal [DEMO].
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmResetDemo(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Data DEMO</span>
            </button>
          </div>
        </div>

        <ConfirmationDialog
          isOpen={confirmResetDemo}
          title="Konfirmasi Reset Seluruh Data DEMO"
          description="Tindakan ini akan mengembalikan seluruh modul di localStorage ke data awal [DEMO] SD Negeri Karanggintung 06. Apakah Anda yakin ingin melanjutkan?"
          confirmLabel="Ya, Reset Data DEMO"
          onCancel={() => setConfirmResetDemo(false)}
          onConfirm={() => {
            onResetDemoData();
            setConfirmResetDemo(false);
          }}
        />
      </div>
    );
  }

  /* ------------------- 5. LOG AKTIVITAS LOKAL ------------------- */
  const filteredLogs = activityLogs.filter(
    (log) =>
      !logSearch.trim() ||
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.actor.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.module.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-600">
            08. SIGAP CONTROL CENTER · Jejak Audit Penyimpanan Lokal [DEMO]
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 font-display">
            Log Aktivitas Pengguna SMART SIGAP ({filteredLogs.length})
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-72">
            <SearchBarInput
              value={logSearch}
              onChange={setLogSearch}
              placeholder="Cari log aktivitas atau modul..."
            />
          </div>
          <button
            type="button"
            onClick={() => setConfirmClearLogs(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold shrink-0"
          >
            Bersihkan Log
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F4F8FF] border-b border-slate-200 font-bold text-slate-600">
              <th className="py-3.5 px-4">Waktu</th>
              <th className="py-3.5 px-4">Aktor &amp; Peran</th>
              <th className="py-3.5 px-4">Modul</th>
              <th className="py-3.5 px-4">Rincian Aktivitas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-blue-50/30">
                <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{log.actor}</div>
                  <div className="text-[11px] text-slate-500">{log.role}</div>
                </td>
                <td className="py-3.5 px-4 font-bold text-blue-700">
                  {log.module}
                </td>
                <td className="py-3.5 px-4 text-slate-700">{log.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog
        isOpen={confirmClearLogs}
        title="Konfirmasi Bersihkan Log Aktivitas"
        description="Apakah Anda yakin ingin menghapus riwayat catatan log aktivitas lokal?"
        confirmLabel="Ya, Bersihkan Log"
        onCancel={() => setConfirmClearLogs(false)}
        onConfirm={() => {
          onClearActivityLogs();
          setConfirmClearLogs(false);
        }}
      />
    </div>
  );
};
