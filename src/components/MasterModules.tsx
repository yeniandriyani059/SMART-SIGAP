import React, { useState, useRef } from 'react';
import {
  Plus,
  Eye,
  Edit3,
  Trash2,
  Users,
  GraduationCap,
  Layers,
  CheckCircle2,
  ArrowLeft,
  Camera,
  ArrowRightLeft,
  UserPlus,
} from 'lucide-react';
import {
  TeacherRecord,
  StudentRecord,
  RombelRecord,
  UserRole,
  SchoolIdentity,
  AuthUser,
} from '../types/sigap';
import {
  filterTeachers,
  filterStudents,
  paginateItems,
} from '../utils/sigapLogic';
import { OFFICIAL_LOGO_PATH } from '../data/demoData';
import { ChibiMascotBadge } from './ChibiIllustrations';
import {
  ConfirmationDialog,
  DetailDrawer,
  ModalDialog,
  PaginationBar,
  SearchBarInput,
  EmptyStateBox,
  ErrorStateBox,
} from './GlobalUI';

/* ==========================================================================
   1. PROFIL PENGGUNA VIEW (SIGAP HOME -> Profil Pengguna)
   ========================================================================== */
export const UserProfileModule: React.FC<{
  currentRole: UserRole;
  schoolIdentity: SchoolIdentity;
  currentUser?: AuthUser | null;
  onChangeRole: (role: UserRole) => void;
  onOpenLoginModal: () => void;
}> = ({ currentRole, schoolIdentity, currentUser, onChangeRole, onOpenLoginModal }) => {
  const roles: UserRole[] = ['Administrator', 'Kepala Sekolah', 'Guru', 'Siswa'];
  const activeName = currentUser?.isAuthenticated
    ? currentUser.name || 'Pengguna Aktif'
    : 'Belum Masuk';

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-[#F4F8FF] border border-blue-200 p-2 shrink-0">
            <img
              src={OFFICIAL_LOGO_PATH}
              alt="Logo SMART SIGAP"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-600">
              SIGAP HOME · Profil Sesi Pengguna
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 font-display mt-0.5">
              {activeName}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Peran Akses: <strong>{currentRole}</strong> · Satuan Pendidikan:{' '}
              <strong>{schoolIdentity.namaSekolah}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenLoginModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0"
        >
          Buka Halaman Login Lengkap
        </button>
      </div>

      {/* Ringkasan Identitas Akun */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
          <div className="text-slate-500 font-medium">Identitas Nomor Induk</div>
          <div className="text-sm font-extrabold text-slate-900 mt-1 font-mono tabular-nums">
            {currentRole === 'Kepala Sekolah'
              ? 'NIP: 19790514 200501 2 008'
              : currentRole === 'Guru'
              ? 'NIP: 19910219 202221 2 011'
              : currentRole === 'Siswa'
              ? 'NISN: 0134829401'
              : 'ID: ADM-SIGAP-01'}
          </div>
          <div className="text-[11px] text-blue-600 mt-1">
            Status Sesi: Aktif Tersimpan Lokal [DEMO]
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
          <div className="text-slate-500 font-medium">Unit Kerja / Rombel</div>
          <div className="text-sm font-extrabold text-slate-900 mt-1">
            {currentRole === 'Kepala Sekolah'
              ? 'Pimpinan Satuan Pendidikan'
              : currentRole === 'Guru'
              ? 'Wali Kelas IV (Fase B)'
              : currentRole === 'Siswa'
              ? 'Kelas IV (Fase B)'
              : 'Operator & Pusat Kendali Sistem'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {schoolIdentity.namaSekolah}
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
          <div className="text-slate-500 font-medium">
            Tahun Pelajaran &amp; Kurikulum
          </div>
          <div className="text-sm font-extrabold text-slate-900 mt-1">
            {schoolIdentity.tahunAjaranAktif} · {schoolIdentity.semesterAktif}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {schoolIdentity.kurikulum}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <h3 className="text-base font-extrabold text-slate-900 font-display">
          Simulasi Peralihan Cepat Peran Pengguna
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Klik salah satu peran di bawah ini untuk menguji tampilan hak akses pengguna pada SMART SIGAP:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
          {roles.map((r) => {
            const active = r === currentRole;
            return (
              <button
                key={r}
                type="button"
                onClick={() => onChangeRole(r)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  active
                    ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20'
                    : 'bg-[#F4F8FF]/60 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900">{r}</span>
                  {active && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-xs text-slate-600 mt-1.5">
                  {r === 'Administrator'
                    ? 'Akses penuh pengaturan sistem & data master'
                    : r === 'Kepala Sekolah'
                    ? 'Supervisi akademik, kurikulum & laporan eksekutif'
                    : r === 'Guru'
                    ? 'Perangkat ajar, jurnal kelas, asesmen & ClassHub'
                    : 'Portal belajar siswa, materi & pengumpulan tugas'}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   2. DATA PENDIDIK / GURU MODULE (Tahap 3 Lengkap: NIP, Nama Lengkap, L/P,
      Jabatan, Status Kepegawaian, Pendidikan, Telepon, Alamat, Foto Profil,
      Search, Filter Jabatan & Status, Pagination, Detail Drawer, Konfirmasi)
   ========================================================================== */
export const DataGuruModule: React.FC<{
  teachers: TeacherRecord[];
  onSaveTeacher: (teacher: TeacherRecord, isEdit: boolean) => void;
  onDeleteTeacher: (id: string) => void;
}> = ({ teachers, onSaveTeacher, onDeleteTeacher }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRecord | null>(
    null
  );
  const [editingTeacher, setEditingTeacher] = useState<TeacherRecord | null>(
    null
  );
  const [confirmDeleteTeacher, setConfirmDeleteTeacher] =
    useState<TeacherRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [nuptk, setNuptk] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('P');
  const [role, setRole] = useState('Guru Kelas');
  const [classAssigned, setClassAssigned] = useState('Kelas I (Fase A)');
  const [statusKepegawaian, setStatusKepegawaian] =
    useState<TeacherRecord['statusKepegawaian']>('PNS');
  const [pendidikan, setPendidikan] = useState('S1 PGSD');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [sertifikasi, setSertifikasi] =
    useState<TeacherRecord['sertifikasi']>('Tersertifikasi');
  const [formError, setFormError] = useState('');

  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const filtered = filterTeachers(
    teachers,
    searchQuery,
    statusFilter,
    roleFilter
  );
  const { pagedItems, totalPages, startIndex, endIndex } = paginateItems(
    filtered,
    currentPage,
    perPage
  );

  const openAddModal = () => {
    setEditingTeacher(null);
    setName('');
    setNip('');
    setNuptk('');
    setGender('P');
    setRole('Guru Kelas');
    setClassAssigned('Kelas I (Fase A)');
    setStatusKepegawaian('PNS');
    setPendidikan('S1 PGSD');
    setPhone('0812-3456-7800');
    setEmail('guru@demo.sch.id');
    setAddress('Desa Karanggintung [DEMO]');
    setPhotoUrl('');
    setSertifikasi('Tersertifikasi');
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditModal = (t: TeacherRecord) => {
    setEditingTeacher(t);
    setName(t.name);
    setNip(t.nip);
    setNuptk(t.nuptk);
    setGender(t.gender || 'P');
    setRole(t.role);
    setClassAssigned(t.classAssigned);
    setStatusKepegawaian(t.statusKepegawaian);
    setPendidikan(t.pendidikan);
    setPhone(t.phone);
    setEmail(t.email);
    setAddress(t.address || 'Desa Karanggintung [DEMO]');
    setPhotoUrl(t.photoUrl || '');
    setSertifikasi(t.sertifikasi);
    setFormError('');
    setIsFormOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Nama lengkap pendidik wajib diisi.');
      return;
    }
    if (!role.trim()) {
      setFormError('Jabatan pendidik wajib diisi.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Nomor telepon pendidik wajib diisi.');
      return;
    }

    const payload: TeacherRecord = {
      id: editingTeacher
        ? editingTeacher.id
        : `GR-${Date.now().toString().slice(-4)}`,
      name: name.trim().includes('[DEMO]')
        ? name.trim()
        : `${name.trim()} [DEMO]`,
      nip: nip.trim() || '-',
      nuptk: nuptk.trim() || '-',
      gender,
      role: role.trim(),
      classAssigned: classAssigned.trim() || 'Kelas I - VI',
      statusKepegawaian,
      pendidikan: pendidikan.trim() || 'S1 PGSD',
      phone: phone.trim(),
      email: email.trim() || 'guru@demo.sch.id',
      address: address.trim() || 'Desa Karanggintung [DEMO]',
      photoUrl: photoUrl || undefined,
      sertifikasi,
      isDemo: true,
    };
    onSaveTeacher(payload, Boolean(editingTeacher));
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-blue-600">
              02. SIGAP MASTER · Direktori Pendidik &amp; Tenaga Kependidikan
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              Data Pendidik / Guru SD Negeri Karanggintung 06
            </h2>
            <p className="text-xs text-slate-500">
              Kelola foto profil, NIP, nama lengkap, L/P, jabatan, status kepegawaian, pendidikan, telepon, dan alamat [DEMO].
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Data Guru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <SearchBarInput
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          placeholder="Cari nama guru, NIP, jabatan, atau alamat..."
        />

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter Jabatan Guru"
            className="px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF] text-xs font-bold text-slate-700"
          >
            <option value="Semua">Semua Jabatan</option>
            <option value="Kepala Sekolah">Kepala Sekolah</option>
            <option value="Guru Kelas">Guru Kelas</option>
            <option value="Guru PAI">Guru PAI</option>
            <option value="Guru PJOK">Guru PJOK</option>
            <option value="Operator">Operator Sekolah</option>
          </select>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['Semua', 'PNS', 'PPPK', 'Guru Honorer'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F4F8FF] text-[11px] font-bold text-slate-600">
                <th className="py-3.5 px-4">Foto</th>
                <th className="py-3.5 px-4">NIP</th>
                <th className="py-3.5 px-4">Nama Lengkap &amp; L/P</th>
                <th className="py-3.5 px-4">Jabatan</th>
                <th className="py-3.5 px-4">Status &amp; Pendidikan</th>
                <th className="py-3.5 px-4">Telepon &amp; Alamat</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {pagedItems.map((t) => (
                <tr key={t.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-4">
                    {t.photoUrl ? (
                      <img
                        src={t.photoUrl}
                        alt={t.name}
                        className="w-10 h-10 rounded-2xl object-cover border border-blue-200"
                      />
                    ) : (
                      <ChibiMascotBadge
                        variant="teacher"
                        className="w-10 h-10 shrink-0"
                      />
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-[11px]">
                    <div className="text-slate-900 font-bold">{t.nip}</div>
                    <div className="text-slate-500">NUPTK: {t.nuptk}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {t.gender === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'} ·{' '}
                      {t.email}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{t.role}</div>
                    <div className="text-[11px] text-blue-700 font-medium">
                      {t.classAssigned}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">
                      {t.statusKepegawaian} · {t.pendidikan}
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      Sertifikasi: {t.sertifikasi}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-800 font-semibold">
                      {t.phone}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                      {t.address || 'Desa Karanggintung [DEMO]'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedTeacher(t)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(t)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteTeacher(t)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <EmptyStateBox
            title="Belum ada data pendidik yang sesuai filter"
            description="Silakan ubah kata kunci pencarian, reset filter jabatan/status, atau tambahkan data guru baru."
            actionLabel="Reset Filter Pencarian"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('Semua');
              setRoleFilter('Semua');
              setCurrentPage(1);
            }}
          />
        ) : (
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            startIndex={startIndex}
            endIndex={endIndex}
            perPage={perPage}
            onPageChange={setCurrentPage}
            onPerPageChange={(n) => {
              setPerPage(n);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Confirmation Delete Teacher Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(confirmDeleteTeacher)}
        title="Konfirmasi Hapus Data Guru"
        description={`Apakah Anda yakin ingin menghapus data pendidik "${confirmDeleteTeacher?.name}" (NIP: ${confirmDeleteTeacher?.nip}) dari penyimpanan lokal?`}
        confirmLabel="Ya, Hapus Data Guru"
        onCancel={() => setConfirmDeleteTeacher(null)}
        onConfirm={() => {
          if (confirmDeleteTeacher) {
            onDeleteTeacher(confirmDeleteTeacher.id);
            setConfirmDeleteTeacher(null);
          }
        }}
      />

      {/* Detail Teacher Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedTeacher)}
        title={selectedTeacher?.name || ''}
        subtitle="02. SIGAP MASTER · Detail Profil Pendidik [DEMO]"
        onClose={() => setSelectedTeacher(null)}
        footer={
          selectedTeacher && (
            <>
              <button
                type="button"
                onClick={() => {
                  const t = selectedTeacher;
                  setSelectedTeacher(null);
                  openEditModal(t);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Edit Data Guru
              </button>
              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Tutup
              </button>
            </>
          )
        }
      >
        {selectedTeacher && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F4F8FF] border border-blue-100">
              {selectedTeacher.photoUrl ? (
                <img
                  src={selectedTeacher.photoUrl}
                  alt={selectedTeacher.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-blue-200"
                />
              ) : (
                <ChibiMascotBadge variant="teacher" className="w-16 h-16" />
              )}
              <div>
                <div className="font-extrabold text-sm text-slate-900">
                  {selectedTeacher.name}
                </div>
                <div className="text-blue-700 font-bold mt-0.5">
                  {selectedTeacher.role} · {selectedTeacher.classAssigned}
                </div>
                <div className="text-slate-500 mt-0.5">
                  {selectedTeacher.statusKepegawaian} · Sertifikasi:{' '}
                  {selectedTeacher.sertifikasi}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500">NIP</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {selectedTeacher.nip}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500">NUPTK</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {selectedTeacher.nuptk}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500">Jenis Kelamin</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedTeacher.gender === 'L'
                    ? 'Laki-laki (L)'
                    : 'Perempuan (P)'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500">Pendidikan Terakhir</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedTeacher.pendidikan}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500">Nomor Telepon</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {selectedTeacher.phone}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500">Email Resmi</div>
                <div className="font-bold text-slate-900 mt-0.5 truncate">
                  {selectedTeacher.email}
                </div>
              </div>
              <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500">Alamat Tempat Tinggal</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedTeacher.address || 'Desa Karanggintung [DEMO]'}
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Add / Edit Teacher Form Modal */}
      <ModalDialog
        isOpen={isFormOpen}
        title={
          editingTeacher
            ? 'Edit Data Pendidik / Guru'
            : 'Tambah Data Pendidik Baru'
        }
        subtitle="Formulir Data Pendidik SD Negeri Karanggintung 06 [DEMO]"
        onClose={() => setIsFormOpen(false)}
        maxWidthClass="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <ErrorStateBox message={formError} />

          {/* Preview & Unggah Foto Profil Lokal */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#F4F8FF] border border-blue-100">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Preview Foto Guru"
                className="w-14 h-14 rounded-2xl object-cover border border-blue-300 shrink-0"
              />
            ) : (
              <ChibiMascotBadge variant="teacher" className="w-14 h-14 shrink-0" />
            )}
            <div className="flex-1">
              <div className="font-bold text-slate-900">
                Foto Profil Pendidik (Preview Lokal)
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Unggah foto formal pendidik (JPG/PNG) untuk ditampilkan pada direktori lokal.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold inline-flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Pilih Foto Profil</span>
                </button>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold"
                  >
                    Reset Foto
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Nama Lengkap &amp; Gelar *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso, S.Pd.SD. [DEMO]"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP</label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="19850101 201001 1 001"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                <option value="P">Perempuan (P)</option>
                <option value="L">Laki-laki (L)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jabatan *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Guru Kelas / Guru Mapel"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Penugasan Kelas / Mapel
              </label>
              <input
                type="text"
                value={classAssigned}
                onChange={(e) => setClassAssigned(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Status Kepegawaian
              </label>
              <select
                value={statusKepegawaian}
                onChange={(e) =>
                  setStatusKepegawaian(
                    e.target.value as TeacherRecord['statusKepegawaian']
                  )
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
                <option value="Guru Honorer">Guru Honorer</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Pendidikan Terakhir
              </label>
              <input
                type="text"
                value={pendidikan}
                onChange={(e) => setPendidikan(e.target.value)}
                placeholder="S1 PGSD"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nomor Telepon / WA *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-3456-7890"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Status Sertifikasi
              </label>
              <select
                value={sertifikasi}
                onChange={(e) =>
                  setSertifikasi(
                    e.target.value as TeacherRecord['sertifikasi']
                  )
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                <option value="Tersertifikasi">Tersertifikasi</option>
                <option value="Proses">Proses</option>
                <option value="Belum">Belum</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Alamat Lengkap
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Pendidikan Raya Desa Karanggintung [DEMO]"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Simpan Data Guru
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
};

/* ==========================================================================
   3. DATA PESERTA DIDIK / SISWA MODULE (Tahap 3 Lengkap: NIS, NISN, Nama,
      Jenis Kelamin, Tempat & Tanggal Lahir, Alamat, Kelas, Nama Wali,
      Kontak Wali, Status Siswa, Filter Kelas & L/P, Pagination, Preview Foto)
   ========================================================================== */
export const DataSiswaModule: React.FC<{
  students: StudentRecord[];
  rombelList?: RombelRecord[];
  onSaveStudent: (student: StudentRecord, isEdit: boolean) => void;
  onDeleteStudent: (id: string) => void;
}> = ({ students, rombelList = [], onSaveStudent, onDeleteStudent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rombelFilter, setRombelFilter] = useState('Semua');
  const [genderFilter, setGenderFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(
    null
  );
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(
    null
  );
  const [confirmDeleteStudent, setConfirmDeleteStudent] =
    useState<StudentRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [nisn, setNisn] = useState('');
  const [nis, setNis] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [birthPlaceDate, setBirthPlaceDate] = useState('');
  const [address, setAddress] = useState('');
  const [rombel, setRombel] = useState('Kelas I');
  const [status, setStatus] = useState<StudentRecord['status']>('Aktif');
  const [parentName, setParentName] = useState('');
  const [parentWa, setParentWa] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [formError, setFormError] = useState('');

  const studentPhotoRef = useRef<HTMLInputElement | null>(null);

  const availableClasses =
    rombelList.length > 0
      ? rombelList.map((r) => r.namaRombel)
      : ['Kelas I', 'Kelas II', 'Kelas III', 'Kelas IV', 'Kelas V', 'Kelas VI'];

  const filtered = filterStudents(
    students,
    searchQuery,
    rombelFilter,
    genderFilter
  );
  const { pagedItems, totalPages, startIndex, endIndex } = paginateItems(
    filtered,
    currentPage,
    perPage
  );

  const openAddModal = () => {
    setEditingStudent(null);
    setName('');
    setNisn('');
    setNis('');
    setGender('L');
    setBirthPlaceDate('Banyumas, 10 Mei 2018 [DEMO]');
    setAddress('Desa Karanggintung RT 01 RW 01 [DEMO]');
    setRombel(availableClasses[0] || 'Kelas I');
    setStatus('Aktif');
    setParentName('Orang Tua / Wali [DEMO]');
    setParentWa('0813-2200-1199');
    setPhotoUrl('');
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditModal = (s: StudentRecord) => {
    setEditingStudent(s);
    setName(s.name);
    setNisn(s.nisn);
    setNis(s.nis);
    setGender(s.gender);
    setBirthPlaceDate(s.birthPlaceDate || 'Banyumas, 10 Mei 2018 [DEMO]');
    setAddress(s.address || 'Desa Karanggintung RT 01 RW 01 [DEMO]');
    setRombel(s.rombel);
    setStatus(s.status);
    setParentName(s.parentName);
    setParentWa(s.parentWa);
    setPhotoUrl(s.photoUrl || '');
    setFormError('');
    setIsFormOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const resolveFase = (rb: string): StudentRecord['fase'] => {
    if (rb.includes('Kelas I') && !rb.includes('Kelas IV')) return 'Fase A';
    if (rb.includes('Kelas II')) return 'Fase A';
    if (rb.includes('Kelas III') || rb.includes('Kelas IV')) return 'Fase B';
    return 'Fase C';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nisn.trim() || !nis.trim()) {
      setFormError('NIS, NISN, dan Nama Lengkap Siswa wajib diisi.');
      return;
    }
    const payload: StudentRecord = {
      id: editingStudent
        ? editingStudent.id
        : `SW-${Date.now().toString().slice(-4)}`,
      name: name.trim().includes('[DEMO]')
        ? name.trim()
        : `${name.trim()} [DEMO]`,
      nisn: nisn.trim(),
      nis: nis.trim(),
      gender,
      birthPlaceDate: birthPlaceDate.trim() || 'Banyumas, 2018 [DEMO]',
      address: address.trim() || 'Desa Karanggintung [DEMO]',
      rombel,
      fase: resolveFase(rombel),
      parentName: parentName.trim() || 'Wali Murid [DEMO]',
      parentWa: parentWa.trim() || '0813-0000-0000',
      photoUrl: photoUrl || undefined,
      attendanceRate: editingStudent ? editingStudent.attendanceRate : 100,
      status,
      isDemo: true,
    };
    onSaveStudent(payload, Boolean(editingStudent));
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-pink-600">
              02. SIGAP MASTER · Direktori Peserta Didik Anak Pintar
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              Data Peserta Didik / Siswa SD Negeri Karanggintung 06
            </h2>
            <p className="text-xs text-slate-500">
              Menampilkan foto, NIS, NISN, nama siswa, L/P, TTL, alamat, kelas, nama &amp; kontak wali, serta status siswa [DEMO].
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Data Siswa</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <SearchBarInput
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          placeholder="Cari nama siswa, NIS, NISN, alamat, atau nama wali..."
        />

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter Jenis Kelamin Siswa"
            className="px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF] text-xs font-bold text-slate-700"
          >
            <option value="Semua">Semua L/P</option>
            <option value="L">Laki-laki (L)</option>
            <option value="P">Perempuan (P)</option>
          </select>

          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['Semua', ...availableClasses].map((rb) => (
              <button
                key={rb}
                type="button"
                onClick={() => {
                  setRombelFilter(rb);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  rombelFilter === rb
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {rb}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F4F8FF] text-[11px] font-bold text-slate-600">
                <th className="py-3.5 px-4">Foto</th>
                <th className="py-3.5 px-4">NIS / NISN</th>
                <th className="py-3.5 px-4">Nama Siswa &amp; TTL</th>
                <th className="py-3.5 px-4">L/P</th>
                <th className="py-3.5 px-4">Kelas</th>
                <th className="py-3.5 px-4">Orang Tua / Wali &amp; Alamat</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {pagedItems.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-4">
                    {s.photoUrl ? (
                      <img
                        src={s.photoUrl}
                        alt={s.name}
                        className="w-10 h-10 rounded-2xl object-cover border border-pink-200"
                      />
                    ) : (
                      <ChibiMascotBadge
                        variant="student"
                        className="w-10 h-10 shrink-0"
                      />
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums">
                    <div className="font-bold text-slate-900">NIS: {s.nis}</div>
                    <div className="text-[11px] text-slate-500">
                      NISN: {s.nisn}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {s.birthPlaceDate || 'Banyumas [DEMO]'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-blue-700">{s.rombel}</div>
                    <div className="text-[11px] text-slate-500">{s.fase}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">
                      {s.parentName} ({s.parentWa})
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[190px]">
                      {s.address || 'Desa Karanggintung [DEMO]'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-700">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(s)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 font-semibold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(s)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteStudent(s)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <EmptyStateBox
            title="Belum ada data peserta didik pada filter ini"
            description="Ubah kata kunci pencarian, filter kelas/jenis kelamin, atau tambahkan siswa baru."
            actionLabel="Tampilkan Semua Siswa"
            onAction={() => {
              setSearchQuery('');
              setRombelFilter('Semua');
              setGenderFilter('Semua');
              setCurrentPage(1);
            }}
          />
        ) : (
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            startIndex={startIndex}
            endIndex={endIndex}
            perPage={perPage}
            onPageChange={setCurrentPage}
            onPerPageChange={(n) => {
              setPerPage(n);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Confirmation Delete Student Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(confirmDeleteStudent)}
        title="Konfirmasi Hapus Data Siswa"
        description={`Apakah Anda yakin ingin menghapus data peserta didik "${confirmDeleteStudent?.name}" (NISN: ${confirmDeleteStudent?.nisn} · ${confirmDeleteStudent?.rombel})?`}
        confirmLabel="Ya, Hapus Siswa"
        onCancel={() => setConfirmDeleteStudent(null)}
        onConfirm={() => {
          if (confirmDeleteStudent) {
            onDeleteStudent(confirmDeleteStudent.id);
            setConfirmDeleteStudent(null);
          }
        }}
      />

      {/* Student Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedStudent)}
        title={selectedStudent?.name || ''}
        subtitle="02. SIGAP MASTER · Detail Biodata Peserta Didik [DEMO]"
        onClose={() => setSelectedStudent(null)}
        footer={
          selectedStudent && (
            <>
              <button
                type="button"
                onClick={() => {
                  const s = selectedStudent;
                  setSelectedStudent(null);
                  openEditModal(s);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Edit Biodata Siswa
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Tutup
              </button>
            </>
          )
        }
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F4F8FF] border border-blue-100">
              {selectedStudent.photoUrl ? (
                <img
                  src={selectedStudent.photoUrl}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-pink-200"
                />
              ) : (
                <ChibiMascotBadge variant="student" className="w-16 h-16" />
              )}
              <div>
                <div className="font-extrabold text-sm text-slate-900">
                  {selectedStudent.name}
                </div>
                <div className="text-blue-700 font-bold mt-0.5">
                  {selectedStudent.rombel} ({selectedStudent.fase}) · Status:{' '}
                  {selectedStudent.status}
                </div>
                <div className="text-slate-500 mt-0.5 font-mono">
                  NIS: {selectedStudent.nis} · NISN: {selectedStudent.nisn}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500">Jenis Kelamin</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedStudent.gender === 'L'
                    ? 'Laki-laki (L)'
                    : 'Perempuan (P)'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500">Tempat, Tanggal Lahir</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedStudent.birthPlaceDate ||
                    'Banyumas, 10 Mei 2018 [DEMO]'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500">Nama Orang Tua / Wali</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedStudent.parentName}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500">Nomor Kontak Wali (WA)</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {selectedStudent.parentWa}
                </div>
              </div>
              <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-slate-500">Alamat Lengkap Siswa</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedStudent.address || 'Desa Karanggintung [DEMO]'}
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Add/Edit Student Modal */}
      <ModalDialog
        isOpen={isFormOpen}
        title={
          editingStudent
            ? 'Edit Data Peserta Didik'
            : 'Tambah Peserta Didik Baru'
        }
        subtitle="Formulir Biodata Siswa SD Negeri Karanggintung 06 [DEMO]"
        onClose={() => setIsFormOpen(false)}
        maxWidthClass="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <ErrorStateBox message={formError} />

          {/* Preview Foto Siswa */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#F4F8FF] border border-blue-100">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Preview Foto Siswa"
                className="w-14 h-14 rounded-2xl object-cover border border-pink-300 shrink-0"
              />
            ) : (
              <ChibiMascotBadge variant="student" className="w-14 h-14 shrink-0" />
            )}
            <div className="flex-1">
              <div className="font-bold text-slate-900">
                Foto Peserta Didik (Preview Lokal)
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Unggah foto siswa untuk kartu pelajar atau direktori kelas (tersimpan di sesi lokal).
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  ref={studentPhotoRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => studentPhotoRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold inline-flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Unggah Foto Siswa</span>
                </button>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold"
                  >
                    Hapus Foto
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Nama Lengkap Siswa *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Raka Pratama Putra [DEMO]"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIS *</label>
              <input
                type="text"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                placeholder="2605"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                NISN *
              </label>
              <input
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                placeholder="0145829100"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tempat &amp; Tanggal Lahir
              </label>
              <input
                type="text"
                value={birthPlaceDate}
                onChange={(e) => setBirthPlaceDate(e.target.value)}
                placeholder="Banyumas, 12 Mei 2018 [DEMO]"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kelas / Rombel
              </label>
              <select
                value={rombel}
                onChange={(e) => setRombel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                {availableClasses.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Status Siswa
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as StudentRecord['status'])
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                <option value="Aktif">Aktif</option>
                <option value="Pindahan">Pindahan</option>
                <option value="Lulus">Lulus</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Orang Tua / Wali
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nomor Kontak Wali (WhatsApp)
              </label>
              <input
                type="text"
                value={parentWa}
                onChange={(e) => setParentWa(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Alamat Lengkap Siswa
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Desa Karanggintung RT 02 RW 01 [DEMO]"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Simpan Data Siswa
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
};

/* ==========================================================================
   4. DATA ROMBONGAN BELAJAR MODULE (Tahap 3 Lengkap: Tambah Rombel, Edit Rombel,
      Hapus Rombel, Menentukan Wali Kelas, Menambahkan Siswa ke Rombel,
      Memindahkan Siswa Antar Rombel, Melihat Jumlah & Daftar Anggota Kelas 1-6)
   ========================================================================== */
export const DataRombelModule: React.FC<{
  rombel: RombelRecord[];
  students?: StudentRecord[];
  teachers?: TeacherRecord[];
  onSaveRombel: (item: RombelRecord, isEdit: boolean) => void;
  onDeleteRombel: (id: string) => void;
  onMoveStudentRombel: (studentId: string, targetRombel: string) => void;
  onQuickAddStudentToRombel: (student: StudentRecord) => void;
}> = ({
  rombel,
  students = [],
  teachers = [],
  onSaveRombel,
  onDeleteRombel,
  onMoveStudentRombel,
  onQuickAddStudentToRombel,
}) => {
  const [selectedRombelDetail, setSelectedRombelDetail] =
    useState<RombelRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RombelRecord | null>(null);
  const [confirmDeleteRombel, setConfirmDeleteRombel] =
    useState<RombelRecord | null>(null);

  // Rombel form fields
  const [namaRombel, setNamaRombel] = useState('Kelas I');
  const [tingkat, setTingkat] = useState(1);
  const [fase, setFase] = useState<RombelRecord['fase']>('Fase A');
  const [waliKelas, setWaliKelas] = useState('');
  const [jumlahL, setJumlahL] = useState(14);
  const [jumlahP, setJumlahP] = useState(14);
  const [ruangKelas, setRuangKelas] = useState('');
  const [formError, setFormError] = useState('');

  // Quick add student inside Rombel detail
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberNisn, setNewMemberNisn] = useState('');
  const [newMemberGender, setNewMemberGender] = useState<'L' | 'P'>('L');

  const openAddRombel = () => {
    setEditingItem(null);
    setNamaRombel('Kelas Paralel B');
    setTingkat(1);
    setFase('Fase A');
    setWaliKelas(teachers[0]?.name || 'Retno Wulandari, S.Pd.SD. [DEMO]');
    setJumlahL(14);
    setJumlahP(14);
    setRuangKelas('Ruang Kelas 1B');
    setFormError('');
    setIsFormOpen(true);
  };

  const openEdit = (item: RombelRecord) => {
    setEditingItem(item);
    setNamaRombel(item.namaRombel);
    setTingkat(item.tingkat);
    setFase(item.fase);
    setWaliKelas(item.waliKelas);
    setJumlahL(item.jumlahSiswaL);
    setJumlahP(item.jumlahSiswaP);
    setRuangKelas(item.ruangKelas);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaRombel.trim()) {
      setFormError('Nama rombongan belajar wajib diisi.');
      return;
    }
    const payload: RombelRecord = {
      id: editingItem
        ? editingItem.id
        : `RB-${Date.now().toString().slice(-4)}`,
      namaRombel: namaRombel.trim(),
      tingkat: Number(tingkat) || 1,
      fase,
      waliKelas: waliKelas.trim() || 'Guru Wali Kelas [DEMO]',
      jumlahSiswaL: Number(jumlahL) || 0,
      jumlahSiswaP: Number(jumlahP) || 0,
      ruangKelas: ruangKelas.trim() || `Ruang ${namaRombel.trim()}`,
      kurikulum: 'Kurikulum Merdeka',
      isDemo: true,
    };
    onSaveRombel(payload, Boolean(editingItem));
    if (selectedRombelDetail?.id === payload.id) {
      setSelectedRombelDetail(payload);
    }
    setIsFormOpen(false);
  };

  const totalSeluruhSiswa = rombel.reduce(
    (acc, r) => acc + r.jumlahSiswaL + r.jumlahSiswaP,
    0
  );

  // Detail Rombel + Daftar Anggota + Pindah Rombel + Tambah Siswa ke Rombel
  if (selectedRombelDetail) {
    const activeRombelObj =
      rombel.find((r) => r.id === selectedRombelDetail.id) ||
      selectedRombelDetail;
    const classMembers = students.filter(
      (s) => s.rombel === activeRombelObj.namaRombel
    );

    const handleQuickAddMember = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMemberName.trim()) return;
      onQuickAddStudentToRombel({
        id: `SW-${Date.now().toString().slice(-4)}`,
        name: newMemberName.trim().includes('[DEMO]')
          ? newMemberName.trim()
          : `${newMemberName.trim()} [DEMO]`,
        nisn: newMemberNisn.trim() || `015${Date.now().toString().slice(-7)}`,
        nis: `26${Date.now().toString().slice(-2)}`,
        gender: newMemberGender,
        birthPlaceDate: 'Banyumas, 2018 [DEMO]',
        address: 'Desa Karanggintung [DEMO]',
        rombel: activeRombelObj.namaRombel,
        fase: activeRombelObj.fase,
        parentName: 'Wali Murid [DEMO]',
        parentWa: '0813-2200-1199',
        attendanceRate: 100,
        status: 'Aktif',
        isDemo: true,
      });
      setNewMemberName('');
      setNewMemberNisn('');
    };

    return (
      <div className="space-y-5 pb-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedRombelDetail(null)}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Kelas</span>
            </button>
            <div>
              <div className="text-xs font-semibold text-purple-600">
                Detail Rombongan Belajar &amp; Pengelolaan Anggota Kelas [DEMO]
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 font-display">
                {activeRombelObj.namaRombel} ({activeRombelObj.fase}) —{' '}
                {activeRombelObj.ruangKelas}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openEdit(activeRombelObj)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-center"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Wali Kelas &amp; Rombel</span>
          </button>
        </div>

        {/* Rombel Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="text-slate-500">Wali Kelas</div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              {activeRombelObj.waliKelas}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="text-slate-500">Siswa Laki-laki (L)</div>
            <div className="text-lg font-extrabold text-slate-900 font-mono mt-1">
              {activeRombelObj.jumlahSiswaL} Siswa
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="text-slate-500">Siswa Perempuan (P)</div>
            <div className="text-lg font-extrabold text-slate-900 font-mono mt-1">
              {activeRombelObj.jumlahSiswaP} Siswa
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="text-slate-500">
              Total Kapasitas / Direktori Aktif
            </div>
            <div className="text-lg font-extrabold text-blue-700 font-mono mt-1">
              {activeRombelObj.jumlahSiswaL + activeRombelObj.jumlahSiswaP} Siswa
              ({classMembers.length} sampel)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Daftar Anggota Kelas + Fitur Pindah Rombel */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Daftar Anggota {activeRombelObj.namaRombel} &amp; Pemindahan Rombel
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F4F8FF] border-b border-slate-200 font-bold text-slate-600">
                    <th className="py-3 px-3">NIS / NISN</th>
                    <th className="py-3 px-3">Nama Siswa</th>
                    <th className="py-3 px-3">L/P</th>
                    <th className="py-3 px-3">Pindahkan ke Rombel Lain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-blue-50/30">
                      <td className="py-3 px-3 font-mono">
                        {m.nis} / {m.nisn}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {m.name}
                      </td>
                      <td className="py-3 px-3">{m.gender}</td>
                      <td className="py-3 px-3">
                        <div className="inline-flex items-center gap-1.5">
                          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                          <select
                            value={m.rombel}
                            onChange={(e) =>
                              onMoveStudentRombel(m.id, e.target.value)
                            }
                            aria-label={`Pindahkan ${m.name} ke rombel lain`}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-[#F4F8FF] font-semibold text-slate-800"
                          >
                            {rombel.map((rb) => (
                              <option key={rb.id} value={rb.namaRombel}>
                                {rb.namaRombel}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {classMembers.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-slate-500"
                      >
                        Belum ada anggota sampel pada rombel ini. Tambahkan melalui formulir di samping.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Tambah Siswa ke Rombel Ini */}
          <form
            onSubmit={handleQuickAddMember}
            className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3 text-xs self-start"
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Tambah Siswa ke {activeRombelObj.namaRombel}
              </h3>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Lengkap Siswa *
              </label>
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Contoh: Gilang Ramadhan [DEMO]"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                NISN
              </label>
              <input
                type="text"
                value={newMemberNisn}
                onChange={(e) => setNewMemberNisn(e.target.value)}
                placeholder="0145829199"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={newMemberGender}
                onChange={(e) =>
                  setNewMemberGender(e.target.value as 'L' | 'P')
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Tambahkan ke {activeRombelObj.namaRombel}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-purple-600">
              02. SIGAP MASTER · Struktur Rombongan Belajar Kelas I s.d. Kelas VI
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              Data Rombongan Belajar SD Negeri Karanggintung 06
            </h2>
            <p className="text-xs text-slate-500">
              Total {rombel.length} Rombel Aktif dengan jumlah agregat{' '}
              <span className="font-mono font-bold text-slate-800">
                {totalSeluruhSiswa}
              </span>{' '}
              peserta didik [DEMO]. Kelola wali kelas, tambah/hapus rombel, dan mutasi anggota kelas.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddRombel}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rombel Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rombel.map((r) => {
          const total = r.jumlahSiswaL + r.jumlahSiswaP;
          const sampleMembers = students.filter(
            (s) => s.rombel === r.namaRombel
          );
          return (
            <div
              key={r.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-purple-700">
                    Tingkat {r.tingkat} · {r.fase}
                  </span>
                  <span>{r.ruangKelas}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 font-display mt-1">
                  {r.namaRombel}
                </h3>
                <div className="text-xs text-slate-600 mt-1">
                  Wali Kelas:{' '}
                  <strong className="text-slate-900">{r.waliKelas}</strong>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-2xl bg-[#F4F8FF] text-center">
                  <div>
                    <div className="text-[11px] text-slate-500">Siswa L</div>
                    <div className="text-sm font-extrabold text-slate-900 font-mono tabular-nums">
                      {r.jumlahSiswaL}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Siswa P</div>
                    <div className="text-sm font-extrabold text-slate-900 font-mono tabular-nums">
                      {r.jumlahSiswaP}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-blue-600 font-semibold">
                      Total
                    </div>
                    <div className="text-sm font-extrabold text-blue-700 font-mono tabular-nums">
                      {total}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="text-[11px] font-bold text-slate-500 mb-1">
                    Daftar Anggota Terdaftar ({sampleMembers.length} siswa sampel):
                  </div>
                  {sampleMembers.slice(0, 2).map((m) => (
                    <div
                      key={m.id}
                      className="text-[11px] text-slate-700 truncate"
                    >
                      • {m.name} ({m.nisn})
                    </div>
                  ))}
                  {sampleMembers.length === 0 && (
                    <div className="text-[11px] text-slate-400 italic">
                      Belum ada siswa sampel terdaftar
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedRombelDetail(r)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Anggota ({sampleMembers.length})</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(r)}
                    className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteRombel(r)}
                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700"
                    title={`Hapus ${r.namaRombel}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Delete Rombel */}
      <ConfirmationDialog
        isOpen={Boolean(confirmDeleteRombel)}
        title="Konfirmasi Hapus Rombongan Belajar"
        description={`Apakah Anda yakin ingin menghapus "${confirmDeleteRombel?.namaRombel}" (Wali Kelas: ${confirmDeleteRombel?.waliKelas})?`}
        confirmLabel="Ya, Hapus Rombel"
        onCancel={() => setConfirmDeleteRombel(null)}
        onConfirm={() => {
          if (confirmDeleteRombel) {
            onDeleteRombel(confirmDeleteRombel.id);
            setConfirmDeleteRombel(null);
          }
        }}
      />

      {/* Add / Edit Rombel Modal */}
      <ModalDialog
        isOpen={isFormOpen}
        title={
          editingItem
            ? `Edit ${editingItem.namaRombel}`
            : 'Tambah Rombongan Belajar Baru'
        }
        subtitle="Pengaturan Kelas, Tingkat, Fase, dan Penetapan Wali Kelas [DEMO]"
        onClose={() => setIsFormOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <ErrorStateBox message={formError} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Rombel *
              </label>
              <input
                type="text"
                value={namaRombel}
                onChange={(e) => setNamaRombel(e.target.value)}
                placeholder="Contoh: Kelas I / Kelas IV-B"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tingkat Kelas (1 - 6)
              </label>
              <select
                value={tingkat}
                onChange={(e) => {
                  const t = Number(e.target.value);
                  setTingkat(t);
                  if (t <= 2) setFase('Fase A');
                  else if (t <= 4) setFase('Fase B');
                  else setFase('Fase C');
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    Tingkat Kelas {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Pilih / Tentukan Wali Kelas
            </label>
            <select
              value={waliKelas}
              onChange={(e) => setWaliKelas(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.role})
                </option>
              ))}
              {!teachers.some((t) => t.name === waliKelas) && waliKelas && (
                <option value={waliKelas}>{waliKelas}</option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jumlah Siswa Laki-laki
              </label>
              <input
                type="number"
                value={jumlahL}
                onChange={(e) => setJumlahL(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jumlah Siswa Perempuan
              </label>
              <input
                type="number"
                value={jumlahP}
                onChange={(e) => setJumlahP(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nama Ruang Kelas
            </label>
            <input
              type="text"
              value={ruangKelas}
              onChange={(e) => setRuangKelas(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#F4F8FF]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
            >
              Simpan Rombel
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
};
