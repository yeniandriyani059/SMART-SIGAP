export type UserRole = 'Administrator' | 'Kepala Sekolah' | 'Guru' | 'Siswa' | 'Mode Pratinjau';

export interface AuthUser {
  id?: string;
  name: string;
  identifier: string;
  role: UserRole;
  isAuthenticated: boolean;
  lastLogin?: string;
}

export type SubMenuId =
  // 1. SIGAP HOME
  | 'dashboard'
  | 'profil-pengguna'
  // 2. SIGAP MASTER
  | 'data-guru'
  | 'data-siswa'
  | 'data-rombel'
  // 3. SIGAP GOVERNANCE
  | 'kalender-akademik'
  | 'jadwal-pembelajaran'
  | 'jurnal-guru'
  | 'informasi-pengumuman'
  // 4. SIGAP PEDAGOGY
  | 'pemetaan-kurikulum'
  | 'tujuan-pembelajaran'
  | 'alur-tujuan-pembelajaran'
  | 'prota-promes'
  | 'modul-ajar-rpp'
  | 'bahan-ajar-digital'
  | 'media-pembelajaran'
  | 'ai-curriculum-assistant'
  // 5. SIGAP ASSESS
  | 'instrumen-asesmen'
  | 'kktp'
  | 'bank-soal-lkpd'
  | 'remedial-pengayaan'
  // 6. SIGAP DIGITAL HUB
  | 'absensi-qr-wa'
  | 'sikumer'
  | 'analisis-asesmen'
  | 'smart-learning'
  // 7. SIGAP CLASSHUB
  | 'dashboard-kelas'
  | 'materi-pembelajaran'
  | 'tugas-siswa'
  | 'pengumpulan-tugas'
  // 8. SIGAP CONTROL CENTER
  | 'identitas-banner'
  | 'manajemen-aplikasi'
  | 'pengguna-hak-akses'
  | 'database-backup'
  | 'log-aktivitas';

export interface SubMenuItem {
  id: SubMenuId;
  label: string;
  badge?: string;
  description: string;
}

export interface MenuGroup {
  id: string;
  code: string;
  title: string;
  iconName: string;
  accentColor: string;
  items: SubMenuItem[];
}

export interface TeacherRecord {
  id: string;
  nip: string;
  nuptk: string;
  name: string;
  gender?: 'L' | 'P';
  role: string;
  classAssigned: string;
  statusKepegawaian: 'PNS' | 'PPPK' | 'Guru Honorer';
  pendidikan: string;
  phone: string;
  email: string;
  address?: string;
  photoUrl?: string;
  sertifikasi: 'Tersertifikasi' | 'Proses' | 'Belum';
  isDemo: boolean;
}

export interface StudentRecord {
  id: string;
  nisn: string;
  nis: string;
  name: string;
  gender: 'L' | 'P';
  birthPlaceDate?: string;
  address?: string;
  rombel: string;
  fase: 'Fase A' | 'Fase B' | 'Fase C';
  parentName: string;
  parentWa: string;
  photoUrl?: string;
  attendanceRate: number;
  status: 'Aktif' | 'Pindahan' | 'Lulus';
  isDemo: boolean;
}

export interface RombelRecord {
  id: string;
  namaRombel: string;
  tingkat: number;
  fase: 'Fase A' | 'Fase B' | 'Fase C';
  waliKelas: string;
  jumlahSiswaL: number;
  jumlahSiswaP: number;
  ruangKelas: string;
  kurikulum: string;
  isDemo: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time?: string;
  category: 'Akademik' | 'Asesmen' | 'Libur Nasional' | 'Kegiatan Sekolah';
  description: string;
  isDemo: boolean;
}

export interface ScheduleItem {
  id: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamKe: string;
  waktu: string;
  rombel: string;
  mataPelajaran: string;
  guru: string;
  ruangan: string;
}

export interface TeacherJournal {
  id: string;
  tanggal: string;
  jamPembelajaran?: string;
  rombel: string;
  mataPelajaran: string;
  guru: string;
  topikMateri: string;
  metode: string;
  hadir: number;
  izinSakit: number;
  catatanRefleksi: string;
  isDemo: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: 'Pengumuman Resmi' | 'Edaran Wali Murid' | 'Agenda Guru' | 'Prestasi';
  author: string;
  summary: string;
  priority: 'Utama' | 'Reguler';
  isDemo: boolean;
}

export interface CurriculumDoc {
  id: string;
  kode: string;
  judul: string;
  mataPelajaran: string;
  kelas: string;
  fase: 'Fase A' | 'Fase B' | 'Fase C';
  semester: 'Ganjil' | 'Genap';
  tipe:
    | 'CP/TP'
    | 'ATP'
    | 'Prota/Promes'
    | 'Modul Ajar'
    | 'Bahan Ajar'
    | 'Media Interaktif';
  subMenuTarget?: SubMenuId;
  penyusun: string;
  updatedAt: string;
  status: 'Terverifikasi Kepala Sekolah' | 'Draf Guru';
  ringkasan: string;
}

export interface GeneratedRppResult {
  id: string;
  createdAt?: string;
  formatDokumen: 'RPP' | 'Modul Ajar';
  identitas: {
    satuanPendidikan: string;
    mataPelajaran: string;
    kelas: string;
    fase: string;
    semester?: 'Ganjil' | 'Genap';
    kelasFase: string;
    alokasiWaktu: string;
    topik: string;
    modelPembelajaran: string;
    pendekatanPembelajaran: string;
    metodePembelajaran?: string;
    penyusun: string;
  };
  profilPelajarPancasila: string[];
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  langkahPembelajaran: {
    pendahuluan: string[];
    kegiatanInti: string[];
    penutup: string[];
  };
  asesmen: {
    diagnostik: string;
    formatif: string;
    sumatif: string;
  };
  diferensiasi: {
    konten: string;
    proses: string;
    produk: string;
  };
}

export interface QuestionBankItem {
  id: string;
  kodeSoal: string;
  mataPelajaran: string;
  kelas: string;
  kategoriBank?: 'Bank Soal' | 'Bank LKPD';
  levelKognitif: 'L1 - Pemahaman' | 'L2 - Penerapan' | 'L3 - Penalaran (HOTS)';
  tipeSoal: 'Pilihan Ganda' | 'Pilihan Ganda Kompleks' | 'Uraian' | 'LKPD Praktik';
  pertanyaan: string;
  kunciJawaban: string;
  indikatorTP: string;
}

export interface AssessProgramItem {
  id: string;
  kode: string;
  judul: string;
  kategoriModul: 'instrumen-asesmen' | 'remedial-pengayaan';
  jenis: 'Diagnostik' | 'Formatif' | 'Sumatif' | 'Remedial' | 'Pengayaan';
  kelas: string;
  mapel: string;
  pesertaSasaran?: string;
  deskripsi: string;
}

export interface KktpCriterionItem {
  id: string;
  kode: string;
  mataPelajaran: string;
  kelas: string;
  fase: 'Fase A' | 'Fase B' | 'Fase C';
  tujuanPembelajaran: string;
  batasTuntasMinimal: number;
  deskripsiMahir: string;
}

export interface DigitalHubApp {
  id: SubMenuId;
  name: string;
  shortTag: string;
  tagline: string;
  description: string;
  status:
    | 'URL Belum Dikonfigurasi'
    | 'URL Sudah Dikonfigurasi'
    | 'Terintegrasi Aktif'
    | 'Siap Sinkronisasi';
  version: string;
  endpointUrl: string;
  features: string[];
  metricsLabel: string;
  metricsValue: string;
  accentBg: string;
  accentText: string;
}

export interface ClassHubRoom {
  id: string;
  namaKelas: string;
  rombel: string;
  fase: 'Fase A' | 'Fase B' | 'Fase C';
  waliKelas: string;
  mataPelajaranUtama: string;
  jumlahSiswa: number;
  kodeAksesDemo: string;
}

export interface ClassHubAssignment {
  id: string;
  judul: string;
  mataPelajaran: string;
  kelas: string;
  guru: string;
  tenggat: string;
  instruksi?: string;
  terkumpul: number;
  totalSiswa: number;
  status: 'Berlangsung' | 'Selesai Dinilai';
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentName: string;
  rombel: string;
  submittedAt: string;
  jawabanSiswa?: string;
  nilai: number | null;
  catatanGuru: string;
  status: 'Sudah Dinilai' | 'Menunggu Penilaian';
}

export interface SchoolIdentity {
  namaSekolah: string;
  namaPortal?: string;
  taglinePortal?: string;
  npsn: string;
  nss: string;
  jenjang: string;
  statusSekolah: string;
  akreditasi: string;
  kurikulum: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  alamat: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  email: string;
  telepon: string;
  website: string;
  tahunAjaranAktif: string;
  semesterAktif: string;
  bannerImageUrl: string;
  bannerCaption: string;
  visiSekolah?: string;
  misiSekolah?: string;
  tujuanSekolah?: string;
}

export interface PortalDisplaySettings {
  compactTable: boolean;
  showDemoBadges: boolean;
  defaultItemsPerPage: number;
  highlightTheme: 'Navy Blue' | 'Electric Blue' | 'Soft Lavender';
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  module: string;
  action: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
