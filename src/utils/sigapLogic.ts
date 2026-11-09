import {
  MenuGroup,
  SubMenuId,
  TeacherRecord,
  StudentRecord,
  RombelRecord,
  GeneratedRppResult,
  DigitalHubApp,
} from '../types/sigap';

export const MENU_GROUPS: MenuGroup[] = [
  {
    id: 'sigap-home',
    code: '01',
    title: 'SIGAP HOME',
    iconName: 'LayoutDashboard',
    accentColor: '#38BDF8',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        description: 'Pusat kendali eksekutif & ringkasan operasional SD Negeri Karanggintung 06',
      },
      {
        id: 'profil-pengguna',
        label: 'Profil Pengguna',
        description: 'Identitas akun pengguna aktif, peran akses, dan preferensi sesi',
      },
    ],
  },
  {
    id: 'sigap-master',
    code: '02',
    title: 'SIGAP MASTER',
    iconName: 'Database',
    accentColor: '#60A5FA',
    items: [
      {
        id: 'data-guru',
        label: 'Data Pendidik/Guru',
        description: 'Manajemen data pendidik, NIP/NUPTK, penugasan wali kelas, dan sertifikasi',
      },
      {
        id: 'data-siswa',
        label: 'Data Peserta Didik/Siswa',
        description: 'Direktori siswa aktif per rombel, NISN, fase kurikulum, dan kontak wali',
      },
      {
        id: 'data-rombel',
        label: 'Data Rombongan Belajar',
        description: 'Pengaturan rombongan belajar Kelas I s.d. Kelas VI beserta wali kelas',
      },
    ],
  },
  {
    id: 'sigap-governance',
    code: '03',
    title: 'SIGAP GOVERNANCE',
    iconName: 'CalendarCheck',
    accentColor: '#A78BFA',
    items: [
      {
        id: 'kalender-akademik',
        label: 'Kalender Akademik',
        description: 'Agenda kegiatan tahun ajaran, pekan efektif, asesmen, dan hari libur',
      },
      {
        id: 'jadwal-pembelajaran',
        label: 'Jadwal Pembelajaran',
        description: 'Matriks jadwal pelajaran mingguan seluruh rombongan belajar',
      },
      {
        id: 'jurnal-guru',
        label: 'Jurnal Aktivitas Guru',
        description: 'Catatan harian pelaksanaan mengajar, ketuntasan materi, dan presensi kelas',
      },
      {
        id: 'informasi-pengumuman',
        label: 'Informasi & Pengumuman',
        description: 'Papan edaran resmi sekolah, pengumuman wali murid, dan agenda guru',
      },
    ],
  },
  {
    id: 'sigap-pedagogy',
    code: '04',
    title: 'SIGAP PEDAGOGY',
    iconName: 'BookOpenCheck',
    accentColor: '#F472B6',
    items: [
      {
        id: 'pemetaan-kurikulum',
        label: 'Pemetaan Kurikulum',
        description: 'Struktur Capaian Pembelajaran (CP) Fase A, Fase B, dan Fase C SD',
      },
      {
        id: 'tujuan-pembelajaran',
        label: 'Tujuan Pembelajaran',
        description: 'Rumusan kompetensi dan lingkup materi per mata pelajaran',
      },
      {
        id: 'alur-tujuan-pembelajaran',
        label: 'Alur Tujuan Pembelajaran',
        description: 'Rangkaian sistematis TP dari awal hingga akhir fase pembelajaran',
      },
      {
        id: 'prota-promes',
        label: 'Program Tahunan & Semester',
        description: 'Distribusi alokasi waktu jam pelajaran tahunan dan semesteran',
      },
      {
        id: 'modul-ajar-rpp',
        label: 'Modul Ajar & RPP',
        description: 'Repositori perangkat ajar Kurikulum Merdeka siap pakai dan terverifikasi',
      },
      {
        id: 'bahan-ajar-digital',
        label: 'Bahan Ajar Digital',
        description: 'E-modul, buku bacaan berjenjang, dan materi pengayaan literasi-numerasi',
      },
      {
        id: 'media-pembelajaran',
        label: 'Media Pembelajaran',
        description: 'Alat peraga visual, presentasi interaktif, dan video pembelajaran SD',
      },
      {
        id: 'ai-curriculum-assistant',
        label: 'AI Curriculum Assistant',
        badge: 'Smart RPP',
        description: 'Asisten penyusun otomatis Modul Ajar & RPP Kurikulum Merdeka berbasis parameter',
      },
    ],
  },
  {
    id: 'sigap-assess',
    code: '05',
    title: 'SIGAP ASSESS',
    iconName: 'ClipboardList',
    accentColor: '#34D399',
    items: [
      {
        id: 'instrumen-asesmen',
        label: 'Instrumen Asesmen',
        description: 'Rubrik asesmen diagnostik, formatif, sumatif, dan observasi profil pelajar',
      },
      {
        id: 'kktp',
        label: 'KKTP',
        description: 'Kriteria Ketercapaian Tujuan Pembelajaran berbasis interval nilai & deskripsi',
      },
      {
        id: 'bank-soal-lkpd',
        label: 'Bank Soal & LKPD',
        description: 'Koleksi butir soal literasi-numerasi dan Lembar Kerja Peserta Didik',
      },
      {
        id: 'remedial-pengayaan',
        label: 'Remedial & Pengayaan',
        description: 'Program tindak lanjut bagi peserta didik berdasarkan capaian KKTP',
      },
    ],
  },
  {
    id: 'sigap-digital-hub',
    code: '06',
    title: 'SIGAP DIGITAL HUB',
    iconName: 'Cpu',
    accentColor: '#38BDF8',
    items: [
      {
        id: 'absensi-qr-wa',
        label: 'Absensi Digital QR-WA',
        description: 'Gerbang integrasi sistem pemindaian QR kartu pelajar & notifikasi WhatsApp orang tua',
      },
      {
        id: 'sikumer',
        label: 'SIKUMER',
        description: 'Gerbang integrasi Sistem Informasi Kurikulum Merdeka & Rapor Projek P5',
      },
      {
        id: 'analisis-asesmen',
        label: 'Analisis Hasil Asesmen',
        description: 'Gerbang integrasi pengolahan skor butir soal, daya serap, dan ketuntasan kelas',
      },
      {
        id: 'smart-learning',
        label: 'Smart Learning Interaktif',
        description: 'Gerbang integrasi portal media gim edukasi & kuis interaktif siswa SD',
      },
    ],
  },
  {
    id: 'sigap-classhub',
    code: '07',
    title: 'SIGAP CLASSHUB',
    iconName: 'GraduationCap',
    accentColor: '#C084FC',
    items: [
      {
        id: 'dashboard-kelas',
        label: 'Dashboard Kelas',
        description: 'Ruang kelas virtual interaktif, papan diskusi, dan progres belajar harian',
      },
      {
        id: 'materi-pembelajaran',
        label: 'Materi Pembelajaran',
        description: 'Distribusi materi bacaan, tautan video, dan panduan belajar mandiri per kelas',
      },
      {
        id: 'tugas-siswa',
        label: 'Tugas Siswa',
        description: 'Daftar penugasan terstruktur beserta instruksi dan batas waktu pengumpulan',
      },
      {
        id: 'pengumpulan-tugas',
        label: 'Pengumpulan Tugas',
        description: 'Monitoring pengumpulan tugas siswa, pemberian umpan balik, dan rekap nilai',
      },
    ],
  },
  {
    id: 'sigap-control-center',
    code: '08',
    title: 'SIGAP CONTROL CENTER',
    iconName: 'Settings',
    accentColor: '#94A3B8',
    items: [
      {
        id: 'identitas-banner',
        label: 'Identitas & Banner Sekolah',
        description: 'Konfigurasi profil resmi SD Negeri Karanggintung 06 dan foto banner utama',
      },
      {
        id: 'manajemen-aplikasi',
        label: 'Manajemen Aplikasi',
        description: 'Pengaturan modul aktif, tautan jembatan aplikasi eksternal, dan mode pemeliharaan',
      },
      {
        id: 'pengguna-hak-akses',
        label: 'Pengguna & Hak Akses',
        description: 'Matriks otorisasi peran Administrator, Kepala Sekolah, Guru, dan Siswa',
      },
      {
        id: 'database-backup',
        label: 'Database & Backup',
        description: 'Ekspor/impor cadangan data JSON lokal dan pemulihan data master sekolah',
      },
      {
        id: 'log-aktivitas',
        label: 'Log Aktivitas',
        description: 'Riwayat jejak audit aktivitas pengguna di seluruh modul SMART SIGAP',
      },
    ],
  },
];

export function findMenuContext(subMenuId: SubMenuId): {
  group: MenuGroup;
  item: MenuGroup['items'][0];
} {
  for (const group of MENU_GROUPS) {
    const found = group.items.find((it) => it.id === subMenuId);
    if (found) {
      return { group, item: found };
    }
  }
  return {
    group: MENU_GROUPS[0],
    item: MENU_GROUPS[0].items[0],
  };
}

export function filterTeachers(
  teachers: TeacherRecord[],
  query: string,
  statusFilter: string,
  roleFilter = 'Semua'
): TeacherRecord[] {
  const q = query.trim().toLowerCase();
  return teachers.filter((t) => {
    const matchesQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.nip.toLowerCase().includes(q) ||
      t.role.toLowerCase().includes(q) ||
      t.classAssigned.toLowerCase().includes(q) ||
      (t.address && t.address.toLowerCase().includes(q));
    const matchesStatus =
      statusFilter === 'Semua' || t.statusKepegawaian === statusFilter;
    const matchesRole =
      roleFilter === 'Semua' ||
      t.role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesQuery && matchesStatus && matchesRole;
  });
}

export function filterStudents(
  students: StudentRecord[],
  query: string,
  rombelFilter: string,
  genderFilter = 'Semua'
): StudentRecord[] {
  const q = query.trim().toLowerCase();
  return students.filter((s) => {
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.nisn.toLowerCase().includes(q) ||
      s.nis.toLowerCase().includes(q) ||
      s.parentName.toLowerCase().includes(q) ||
      (s.address && s.address.toLowerCase().includes(q));
    const matchesRombel =
      rombelFilter === 'Semua' || s.rombel === rombelFilter;
    const matchesGender =
      genderFilter === 'Semua' || s.gender === genderFilter;
    return matchesQuery && matchesRombel && matchesGender;
  });
}

export function paginateItems<T>(
  items: T[],
  page: number,
  perPage: number
): {
  pagedItems: T[];
  totalPages: number;
  currentPage: number;
  startIndex: number;
  endIndex: number;
} {
  const safePerPage = Math.max(1, perPage);
  const totalPages = Math.max(1, Math.ceil(items.length / safePerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * safePerPage;
  const endIndex = Math.min(startIndex + safePerPage, items.length);
  return {
    pagedItems: items.slice(startIndex, endIndex),
    totalPages,
    currentPage,
    startIndex,
    endIndex,
  };
}

export function validateExternalUrl(rawUrl: string): {
  isValid: boolean;
  error?: string;
  normalizedUrl: string;
} {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { isValid: true, normalizedUrl: '' };
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        isValid: false,
        error: 'URL wajib diawali dengan protokol http:// atau https://',
        normalizedUrl: trimmed,
      };
    }
    return { isValid: true, normalizedUrl: parsed.toString() };
  } catch {
    return {
      isValid: false,
      error: 'Format URL tidak valid. Gunakan contoh: https://nama-aplikasi.sch.id',
      normalizedUrl: trimmed,
    };
  }
}

export function calculateDashboardStats(
  teachers: TeacherRecord[],
  students: StudentRecord[],
  rombel: RombelRecord[],
  digitalApps: DigitalHubApp[]
) {
  const totalGuru = teachers.length;
  const totalSiswa = students.length;
  const totalRombel = rombel.length;
  const activeApps = digitalApps.length;
  const avgAttendance =
    students.length > 0
      ? Number(
          (
            students.reduce((acc, s) => acc + s.attendanceRate, 0) /
            students.length
          ).toFixed(1)
        )
      : 0;

  return {
    totalGuru,
    totalSiswa,
    totalRombel,
    activeApps,
    avgAttendance,
  };
}

export function evaluateKktpStatus(score: number): {
  predikat: string;
  interval: string;
  rekomendasi: string;
  tuntas: boolean;
} {
  if (score >= 86) {
    return {
      predikat: 'Sudah Mencapai Ketuntasan (Mahir)',
      interval: '86 - 100%',
      rekomendasi: 'Sudah mencapai ketuntasan, perlu pengayaan atau tantangan lebih lanjut.',
      tuntas: true,
    };
  }
  if (score >= 70) {
    return {
      predikat: 'Sudah Mencapai Ketuntasan (Cakap)',
      interval: '70 - 85%',
      rekomendasi: 'Sudah mencapai ketuntasan, tidak perlu remedial.',
      tuntas: true,
    };
  }
  if (score >= 51) {
    return {
      predikat: 'Belum Mencapai Ketuntasan (Layak)',
      interval: '51 - 69%',
      rekomendasi: 'Belum mencapai ketuntasan, remedial di bagian yang diperlukan.',
      tuntas: false,
    };
  }
  return {
    predikat: 'Perlu Bimbingan Intensif (Baru Berkembang)',
    interval: '0 - 50%',
    rekomendasi: 'Belum mencapai ketuntasan, remedial di seluruh bagian materi.',
    tuntas: false,
  };
}

export function generateModulAjar(params: {
  mataPelajaran: string;
  kelas?: string;
  fase?: string;
  semester?: 'Ganjil' | 'Genap';
  kelasFase?: string;
  topik: string;
  tujuanPembelajaranInput?: string;
  modelPembelajaran: string;
  pendekatanPembelajaran?: string;
  metodePembelajaran?: string;
  profilLulusanInput?: string;
  formatDokumen?: 'RPP' | 'Modul Ajar';
  alokasiWaktu: string;
  penyusun: string;
}): GeneratedRppResult {
  const cleanTopic = params.topik.trim() || 'Eksplorasi Konsep Dasar Kontekstual';
  const kelasStr =
    params.kelas ||
    (params.kelasFase ? params.kelasFase.split('/')[0].trim() : 'Kelas IV');
  const faseStr =
    params.fase ||
    (params.kelasFase && params.kelasFase.includes('Fase')
      ? params.kelasFase.split('/')[1]?.trim() || 'Fase B'
      : 'Fase B');
  const semester = params.semester || 'Ganjil';
  const combinedKelasFase = `${kelasStr} / ${faseStr}`;
  const pendekatan =
    params.pendekatanPembelajaran || 'Saintifik & Kontekstual (Berdiferensiasi)';
  const metode =
    params.metodePembelajaran || 'Diskusi Kelompok, Eksperimen, dan Tanya Jawab';
  const formatDokumen = params.formatDokumen || 'Modul Ajar';

  const customTpList = params.tujuanPembelajaranInput
    ? params.tujuanPembelajaranInput
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    : [];

  const defaultTpList = [
    `Melalui pendekatan ${pendekatan}, peserta didik mampu menjelaskan konsep utama ${cleanTopic} dengan tepat.`,
    `Melalui kegiatan ${metode} (${params.modelPembelajaran}), peserta didik mampu memecahkan persoalan sehari-hari terkait ${cleanTopic}.`,
    `Peserta didik mampu mempresentasikan hasil karya/LKPD tentang ${cleanTopic} di depan kelas dengan percaya diri.`,
  ];

  const customProfilList = params.profilLulusanInput
    ? params.profilLulusanInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [
        'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
        'Bernalar Kritis dalam menganalisis permasalahan kontekstual',
        'Gotong Royong melalui kolaborasi kelompok diskusi',
        'Mandiri dalam menyelesaikan lembar aktivitas',
      ];

  const nowStr = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    id: `RPP-${Date.now()}`,
    createdAt: `06 Nov 2026, ${nowStr} WIB`,
    formatDokumen,
    identitas: {
      satuanPendidikan: 'SD Negeri Karanggintung 06',
      mataPelajaran: params.mataPelajaran,
      kelas: kelasStr,
      fase: faseStr,
      semester,
      kelasFase: combinedKelasFase,
      alokasiWaktu: params.alokasiWaktu,
      topik: cleanTopic,
      modelPembelajaran: params.modelPembelajaran,
      pendekatanPembelajaran: pendekatan,
      metodePembelajaran: metode,
      penyusun: params.penyusun,
    },
    profilPelajarPancasila: customProfilList,
    capaianPembelajaran: `Peserta didik pada ${combinedKelasFase} (Semester ${semester}) mampu memahami, mengidentifikasi, dan menerapkan konsep ${cleanTopic} pada mata pelajaran ${params.mataPelajaran} melalui pendekatan ${pendekatan} dan metode ${metode} secara kontekstual dalam kehidupan sehari-hari di lingkungan sekolah maupun rumah [SIMULASI DEMO].`,
    tujuanPembelajaran: customTpList.length > 0 ? customTpList : defaultTpList,
    pemahamanBermakna: `Memahami ${cleanTopic} membantu peserta didik memecahkan masalah nyata di sekitar SD Negeri Karanggintung 06 secara sistematis dan kreatif.`,
    pertanyaanPemantik: [
      `Pernahkah kalian memperhatikan bagaimana ${cleanTopic} diterapkan dalam kegiatan kita sehari-hari di rumah atau sekolah?`,
      `Mengapa kita perlu mempelajari ${cleanTopic} pada pelajaran ${params.mataPelajaran} hari ini?`,
    ],
    langkahPembelajaran: {
      pendahuluan: [
        'Guru membuka kelas dengan salam, doa bersama, dan memeriksa kehadiran siswa.',
        'Siswa menyanyikan lagu wajib nasional dan melakukan ice breaking singkat "Tepuk Semangat SIGAP".',
        `Guru menyampaikan apersepsi, pertanyaan pemantik, dan tujuan pembelajaran mengenai ${cleanTopic}.`,
      ],
      kegiatanInti: [
        `Orientasi Masalah (${params.modelPembelajaran} - ${pendekatan}): Guru menampilkan media visual interaktif terkait ${cleanTopic}.`,
        `Organisasi & Metode (${metode}): Siswa dibagi menjadi kelompok heterogen beranggotakan 4–5 anak dan menerima LKPD.`,
        `Penyelidikan Mandiri & Kelompok: Siswa melakukan eksplorasi dan berdiskusi menjawab tantangan ${cleanTopic} dengan bimbingan guru.`,
        'Pengembangan & Penyajian Hasil: Setiap kelompok menampilkan hasil diskusi di depan kelas dan kelompok lain memberikan tanggapan apresiatif.',
      ],
      penutup: [
        `Siswa bersama guru menyimpulkan poin penting materi ${cleanTopic} hari ini.`,
        'Siswa mengerjakan kuis formatif singkat (3 soal) dan mengisi lembar refleksi perasaan belajar.',
        'Guru menyampaikan agenda pertemuan berikutnya dan menutup kelas dengan doa.',
      ],
    },
    asesmen: {
      diagnostik: 'Pertanyaan lisan singkat di awal pembelajaran untuk memetakan kesiapan belajar siswa.',
      formatif: 'Observasi keaktifan diskusi kelompok, penilaian proses pengerjaan LKPD, dan presentasi.',
      sumatif: `Tes tertulis / kuis akhir subbab tentang ${cleanTopic} mengacu pada KKTP minimal 70%.`,
    },
    diferensiasi: {
      konten: 'Menyediakan bahan bacaan bergambar, benda konkret di kelas, serta tayangan video pembelajaran.',
      proses: 'Pendampingan intensif (scaffolding) bagi siswa yang membutuhkan bimbingan tambahan.',
      produk: 'Siswa dapat memilih menyajikan laporan dalam bentuk peta pikiran, ringkasan tertulis, atau cerita bergambar.',
    },
  };
}
