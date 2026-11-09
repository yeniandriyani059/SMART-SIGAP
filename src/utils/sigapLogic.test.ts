import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MENU_GROUPS,
  findMenuContext,
  filterTeachers,
  filterStudents,
  paginateItems,
  validateExternalUrl,
  evaluateKktpStatus,
  generateModulAjar,
} from './sigapLogic';
import { TeacherRecord, StudentRecord } from '../types/sigap';

test('MENU_GROUPS contains all 8 required accordion groups and 34 submenus', () => {
  assert.equal(MENU_GROUPS.length, 8);
  const totalItems = MENU_GROUPS.reduce((acc, g) => acc + g.items.length, 0);
  assert.equal(totalItems, 34);
});

test('findMenuContext resolves submenu and parent group accurately', () => {
  const ctx = findMenuContext('ai-curriculum-assistant');
  assert.equal(ctx.group.title, 'SIGAP PEDAGOGY');
  assert.equal(ctx.item.label, 'AI Curriculum Assistant');
});

test('filterTeachers filters by search query, employment status, and role', () => {
  const sampleTeachers: TeacherRecord[] = [
    {
      id: '1',
      nip: '198204122009032004',
      nuptk: '123456',
      name: 'Siti Rahmawati, S.Pd.SD [DEMO]',
      gender: 'P',
      role: 'Guru Kelas VI',
      classAssigned: 'Kelas VI',
      statusKepegawaian: 'PNS',
      pendidikan: 'S1 PGSD',
      phone: '0812',
      email: 'siti@demo.id',
      address: 'Jl. Raya Karanggintung [DEMO]',
      sertifikasi: 'Tersertifikasi',
      isDemo: true,
    },
    {
      id: '2',
      nip: '199108152023211009',
      nuptk: '654321',
      name: 'Budi Santoso, S.Pd. [DEMO]',
      gender: 'L',
      role: 'Guru PJOK',
      classAssigned: 'Kelas I - VI',
      statusKepegawaian: 'PPPK',
      pendidikan: 'S1 PJOK',
      phone: '0813',
      email: 'budi@demo.id',
      address: 'Jl. Pendidikan [DEMO]',
      sertifikasi: 'Tersertifikasi',
      isDemo: true,
    },
  ];

  assert.equal(filterTeachers(sampleTeachers, 'Budi', 'Semua').length, 1);
  assert.equal(filterTeachers(sampleTeachers, '', 'PNS').length, 1);
  assert.equal(filterTeachers(sampleTeachers, 'Budi', 'PNS').length, 0);
  assert.equal(
    filterTeachers(sampleTeachers, '', 'Semua', 'Guru PJOK').length,
    1
  );
});

test('filterStudents filters by NISN or name, rombel, and gender', () => {
  const sampleStudents: StudentRecord[] = [
    {
      id: 'S1',
      nisn: '0134829101',
      nis: '2101',
      name: 'Alya Putri Ramadhani [DEMO]',
      gender: 'P',
      birthPlaceDate: 'Banyumas, 14 Mei 2018',
      address: 'Desa Karanggintung [DEMO]',
      rombel: 'Kelas I',
      fase: 'Fase A',
      parentName: 'Hendra',
      parentWa: '0812',
      attendanceRate: 98,
      status: 'Aktif',
      isDemo: true,
    },
  ];
  assert.equal(
    filterStudents(sampleStudents, '0134829101', 'Kelas I').length,
    1
  );
  assert.equal(filterStudents(sampleStudents, 'Alya', 'Kelas II').length, 0);
  assert.equal(
    filterStudents(sampleStudents, '', 'Semua', 'P').length,
    1
  );
  assert.equal(
    filterStudents(sampleStudents, '', 'Semua', 'L').length,
    0
  );
});

test('paginateItems slices array accurately and clamps page bounds', () => {
  const items = [1, 2, 3, 4, 5, 6, 7];
  const page1 = paginateItems(items, 1, 3);
  assert.deepEqual(page1.pagedItems, [1, 2, 3]);
  assert.equal(page1.totalPages, 3);

  const page3 = paginateItems(items, 3, 3);
  assert.deepEqual(page3.pagedItems, [7]);
  assert.equal(page3.currentPage, 3);
});

test('validateExternalUrl validates http and https URLs properly', () => {
  assert.equal(validateExternalUrl('').isValid, true);
  assert.equal(
    validateExternalUrl('https://absensi.sdnkaranggintung06.sch.id').isValid,
    true
  );
  assert.equal(validateExternalUrl('ftp://invalid-url').isValid, false);
  assert.equal(validateExternalUrl('not a url').isValid, false);
});

test('evaluateKktpStatus classifies score intervals accurately', () => {
  assert.equal(evaluateKktpStatus(90).tuntas, true);
  assert.equal(evaluateKktpStatus(75).tuntas, true);
  assert.equal(evaluateKktpStatus(60).tuntas, false);
  assert.equal(evaluateKktpStatus(45).tuntas, false);
});

test('generateModulAjar produces complete Kurikulum Merdeka RPP structure with all 12 inputs', () => {
  const rpp = generateModulAjar({
    mataPelajaran: 'IPAS (Ilmu Pengetahuan Alam dan Sosial)',
    kelas: 'Kelas IV',
    fase: 'Fase B',
    semester: 'Ganjil',
    kelasFase: 'Kelas IV / Fase B',
    topik: 'Wujud Zat dan Perubahannya',
    modelPembelajaran: 'Problem Based Learning (PBL)',
    pendekatanPembelajaran: 'Teaching at the Right Level (TaRL)',
    metodePembelajaran: 'Diskusi Kelompok, Eksperimen & Presentasi',
    profilLulusanInput: 'Bernalar Kritis, Gotong Royong',
    tujuanPembelajaranInput:
      '1. Peserta didik mampu mengidentifikasi perubahan wujud zat.\n2. Peserta didik mampu melakukan percobaan mencair dan membeku.',
    formatDokumen: 'RPP',
    alokasiWaktu: '2 x 35 Menit (1 Pertemuan)',
    penyusun: 'Tim Guru SD Negeri Karanggintung 06',
  });
  assert.equal(rpp.identitas.satuanPendidikan, 'SD Negeri Karanggintung 06');
  assert.equal(rpp.formatDokumen, 'RPP');
  assert.equal(rpp.identitas.semester, 'Ganjil');
  assert.equal(
    rpp.identitas.metodePembelajaran,
    'Diskusi Kelompok, Eksperimen & Presentasi'
  );
  assert.equal(
    rpp.identitas.pendekatanPembelajaran,
    'Teaching at the Right Level (TaRL)'
  );
  assert.equal(rpp.tujuanPembelajaran.length, 2);
  assert.ok(rpp.langkahPembelajaran.kegiatanInti.length >= 3);
});

test('MENU_GROUPS titles have no numerical sequence prefixes and match canonical names', () => {
  const expectedTitles = [
    'SIGAP HOME',
    'SIGAP MASTER',
    'SIGAP GOVERNANCE',
    'SIGAP PEDAGOGY',
    'SIGAP ASSESS',
    'SIGAP DIGITAL HUB',
    'SIGAP CLASSHUB',
    'SIGAP CONTROL CENTER',
  ];
  const actualTitles = MENU_GROUPS.map((g) => g.title);
  assert.deepEqual(actualTitles, expectedTitles);

  for (const group of MENU_GROUPS) {
    assert.equal(/^\d+\./.test(group.title), false, `Group title ${group.title} must not have numeric prefix`);
  }
});

