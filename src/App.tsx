/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import {
  SubMenuId,
  UserRole,
  SchoolIdentity,
  PortalDisplaySettings,
  TeacherRecord,
  StudentRecord,
  RombelRecord,
  DigitalHubApp,
  AnnouncementItem,
  CalendarEvent,
  ScheduleItem,
  TeacherJournal,
  CurriculumDoc,
  GeneratedRppResult,
  QuestionBankItem,
  AssessProgramItem,
  KktpCriterionItem,
  ClassHubRoom,
  ClassHubAssignment,
  StudentSubmission,
  ActivityLogItem,
  ToastMessage,
  AuthUser,
} from './types/sigap';
import {
  STORAGE_KEYS,
  loadAllInitialState,
  saveModuleData,
  upsertModuleItem,
  deleteModuleItem,
  resetAllDemoStorage,
} from './services/storageService';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LoginModal } from './components/LoginModal';
import { DashboardView } from './components/DashboardView';
import { ToastContainer, ConfirmationDialog } from './components/GlobalUI';
import {
  UserProfileModule,
  DataGuruModule,
  DataSiswaModule,
  DataRombelModule,
} from './components/MasterModules';
import {
  GovernanceModules,
  PedagogyModules,
} from './components/GovernancePedagogyModules';
import {
  AssessModules,
  DigitalHubIntegrationModule,
  ClassHubModules,
  ControlCenterModules,
} from './components/AssessHubClassControlModules';

export default function App() {
  const initialState = React.useMemo(() => loadAllInitialState(), []);

  const [activeSubMenu, setActiveSubMenu] = useState<SubMenuId>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persistent state per module in localStorage
  const [authUser, setAuthUser] = useState<AuthUser>(initialState.authUser);
  const [currentRole, setCurrentRole] = useState<UserRole>(
    initialState.currentRole
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

  const [schoolIdentity, setSchoolIdentity] = useState<SchoolIdentity>(
    initialState.schoolIdentity
  );
  const [portalSettings, setPortalSettings] = useState<PortalDisplaySettings>(
    initialState.portalSettings
  );
  const [teachers, setTeachers] = useState<TeacherRecord[]>(
    initialState.teachers
  );
  const [students, setStudents] = useState<StudentRecord[]>(
    initialState.students
  );
  const [rombel, setRombel] = useState<RombelRecord[]>(initialState.rombel);
  const [digitalApps, setDigitalApps] = useState<DigitalHubApp[]>(
    initialState.digitalApps
  );
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(
    initialState.announcements
  );
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(
    initialState.calendarEvents
  );
  const [schedules, setSchedules] = useState<ScheduleItem[]>(
    initialState.schedules
  );
  const [journals, setJournals] = useState<TeacherJournal[]>(
    initialState.journals
  );
  const [curriculumDocs, setCurriculumDocs] = useState<CurriculumDoc[]>(
    initialState.curriculumDocs
  );
  const [rppHistory, setRppHistory] = useState<GeneratedRppResult[]>(
    initialState.rppHistory
  );
  const [questions, setQuestions] = useState<QuestionBankItem[]>(
    initialState.questions
  );
  const [assessPrograms, setAssessPrograms] = useState<AssessProgramItem[]>(
    initialState.assessPrograms
  );
  const [kktpCriteria, setKktpCriteria] = useState<KktpCriterionItem[]>(
    initialState.kktpCriteria
  );
  const [classHubRooms, setClassHubRooms] = useState<ClassHubRoom[]>(
    initialState.classHubRooms
  );
  const [assignments, setAssignments] = useState<ClassHubAssignment[]>(
    initialState.assignments
  );
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(
    initialState.submissions
  );
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(
    initialState.activityLogs
  );

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (
      title: string,
      message: string,
      type: 'success' | 'error' | 'info' = 'success'
    ) => {
      const id = `TOAST-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const appendLog = useCallback(
    (module: string, action: string) => {
      setActivityLogs((prev) => {
        const next: ActivityLogItem[] = [
          {
            id: `LOG-${Date.now().toString().slice(-5)}`,
            timestamp: new Date().toLocaleString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            actor: currentRole,
            role: currentRole,
            module,
            action,
          },
          ...prev,
        ];
        saveModuleData(STORAGE_KEYS.ACTIVITY_LOGS, next);
        return next;
      });
    },
    [currentRole]
  );

  // =========================================================================
  // HANDLERS: AUTHENTICATION & SESSION
  // =========================================================================
  const handleLoginSuccess = useCallback(
    (identifier: string, resolvedRole: UserRole, displayName: string) => {
      const updatedUser: AuthUser = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: displayName,
        identifier,
        role: resolvedRole,
        isAuthenticated: true,
        lastLogin: new Date().toISOString(),
      };
      setAuthUser(updatedUser);
      setCurrentRole(resolvedRole);
      saveModuleData(STORAGE_KEYS.AUTH_USER, updatedUser);
      saveModuleData(STORAGE_KEYS.CURRENT_ROLE, resolvedRole);
      setIsLoginModalOpen(false);
      setActiveSubMenu('dashboard');
      appendLog('SIGAP HOME', `Masuk sistem sebagai ${displayName} (${resolvedRole})`);
      addToast(
        'Login Berhasil',
        `Selamat datang di SMART SIGAP, ${displayName}!`,
        'success'
      );
    },
    [appendLog, addToast]
  );

  const handleDemoAccess = useCallback(() => {
    const demoUser: AuthUser = {
      id: 'USR-DEMO-PREVIEW',
      name: 'Pengunjung Demo',
      identifier: 'pengunjung.demo',
      role: 'Mode Pratinjau',
      isAuthenticated: true,
      lastLogin: new Date().toISOString(),
    };
    setAuthUser(demoUser);
    setCurrentRole('Mode Pratinjau');
    saveModuleData(STORAGE_KEYS.AUTH_USER, demoUser);
    saveModuleData(STORAGE_KEYS.CURRENT_ROLE, 'Mode Pratinjau');
    setIsLoginModalOpen(false);
    setActiveSubMenu('dashboard');
    appendLog('SIGAP HOME', 'Masuk ke sistem dalam Mode Pratinjau (Demo Access)');
    addToast(
      'Mode Pratinjau Aktif',
      'Selamat datang! Anda masuk dalam Mode Pratinjau untuk pemeriksaan modul portal.',
      'info'
    );
  }, [appendLog, addToast]);

  const handleRequestLogout = useCallback(() => {
    setIsConfirmLogoutOpen(true);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    const loggedOutUser: AuthUser = {
      id: '',
      name: '',
      identifier: '',
      role: 'Siswa',
      isAuthenticated: false,
    };
    setAuthUser(loggedOutUser);
    saveModuleData(STORAGE_KEYS.AUTH_USER, loggedOutUser);
    setIsConfirmLogoutOpen(false);
    setIsLoginModalOpen(true);
    appendLog('SIGAP HOME', 'Pengguna keluar dari sesi sistem');
    addToast('Sesi Berakhir', 'Anda telah berhasil keluar dari sistem SMART SIGAP.', 'info');
  }, [appendLog, addToast]);

  // =========================================================================
  // HANDLERS: SIGAP MASTER (Guru, Siswa, Rombel)
  // =========================================================================
  const handleSaveTeacher = (teacher: TeacherRecord, isEdit: boolean) => {
    setTeachers((prev) =>
      upsertModuleItem(STORAGE_KEYS.TEACHERS, prev, teacher)
    );
    appendLog(
      'SIGAP MASTER',
      `${isEdit ? 'Memperbarui' : 'Menambahkan'} data pendidik: ${teacher.name}`
    );
    addToast(
      isEdit ? 'Data Guru Diperbarui' : 'Guru Berhasil Ditambahkan',
      `${teacher.name} (${teacher.nip}) tersimpan di penyimpanan lokal.`
    );
  };

  const handleDeleteTeacher = (id: string) => {
    const target = teachers.find((t) => t.id === id);
    setTeachers((prev) => deleteModuleItem(STORAGE_KEYS.TEACHERS, prev, id));
    appendLog(
      'SIGAP MASTER',
      `Menghapus data pendidik: ${target?.name || id}`
    );
    addToast(
      'Data Guru Dihapus',
      `Data ${target?.name || id} telah dihapus dari sistem lokal.`,
      'info'
    );
  };

  const handleSaveStudent = (student: StudentRecord, isEdit: boolean) => {
    setStudents((prev) =>
      upsertModuleItem(STORAGE_KEYS.STUDENTS, prev, student)
    );
    appendLog(
      'SIGAP MASTER',
      `${isEdit ? 'Memperbarui' : 'Menambahkan'} data siswa: ${student.name}`
    );
    addToast(
      isEdit ? 'Data Siswa Diperbarui' : 'Siswa Berhasil Ditambahkan',
      `${student.name} (NISN: ${student.nisn}) tersimpan di penyimpanan lokal.`
    );
  };

  const handleDeleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    setStudents((prev) => deleteModuleItem(STORAGE_KEYS.STUDENTS, prev, id));
    appendLog('SIGAP MASTER', `Menghapus data siswa: ${target?.name || id}`);
    addToast(
      'Data Siswa Dihapus',
      `Data ${target?.name || id} telah dihapus dari sistem lokal.`,
      'info'
    );
  };

  const handleSaveRombel = (updated: RombelRecord, isEdit: boolean) => {
    setRombel((prev) => upsertModuleItem(STORAGE_KEYS.ROMBEL, prev, updated));
    appendLog(
      'SIGAP MASTER',
      `${isEdit ? 'Memperbarui' : 'Menambahkan'} rombel: ${updated.namaRombel}`
    );
    addToast(
      isEdit ? 'Rombel Diperbarui' : 'Rombel Baru Ditambahkan',
      `${updated.namaRombel} dengan Wali Kelas ${updated.waliKelas} berhasil disimpan.`
    );
  };

  const handleDeleteRombel = (id: string) => {
    const target = rombel.find((r) => r.id === id);
    setRombel((prev) => deleteModuleItem(STORAGE_KEYS.ROMBEL, prev, id));
    appendLog(
      'SIGAP MASTER',
      `Menghapus data rombel: ${target?.namaRombel || id}`
    );
    addToast(
      'Data Rombel Dihapus',
      `${target?.namaRombel || id} telah dihapus dari daftar rombongan belajar.`,
      'info'
    );
  };

  const handleMoveStudentRombel = (studentId: string, targetRombel: string) => {
    const targetRombelObj = rombel.find((r) => r.namaRombel === targetRombel);
    const targetFase = targetRombelObj ? targetRombelObj.fase : 'Fase B';

    setStudents((prev) => {
      const next = prev.map((s) =>
        s.id === studentId ? { ...s, rombel: targetRombel, fase: targetFase } : s
      );
      saveModuleData(STORAGE_KEYS.STUDENTS, next);
      return next;
    });
    const st = students.find((s) => s.id === studentId);
    appendLog(
      'SIGAP MASTER',
      `Memindahkan siswa ${st?.name || studentId} ke ${targetRombel}`
    );
    addToast(
      'Siswa Berhasil Dipindahkan',
      `${st?.name || 'Siswa'} kini terdaftar di ${targetRombel}.`
    );
  };

  const handleQuickAddStudentToRombel = (student: StudentRecord) => {
    setStudents((prev) =>
      upsertModuleItem(STORAGE_KEYS.STUDENTS, prev, student)
    );
    appendLog(
      'SIGAP MASTER',
      `Menambahkan siswa ${student.name} ke ${student.rombel}`
    );
    addToast(
      'Anggota Rombel Ditambahkan',
      `${student.name} berhasil ditambahkan ke ${student.rombel}.`
    );
  };

  // =========================================================================
  // HANDLERS: SIGAP GOVERNANCE
  // =========================================================================
  const handleSaveCalendarEvent = (ev: CalendarEvent, isEdit: boolean) => {
    setCalendarEvents((prev) =>
      upsertModuleItem(STORAGE_KEYS.CALENDAR_EVENTS, prev, ev)
    );
    appendLog(
      'SIGAP GOVERNANCE',
      `${isEdit ? 'Memperbarui' : 'Menambah'} agenda kalender: ${ev.title}`
    );
    addToast(
      isEdit ? 'Agenda Kalender Diperbarui' : 'Agenda Baru Tersimpan',
      `${ev.title} (${ev.date}) berhasil disimpan.`
    );
  };

  const handleDeleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) =>
      deleteModuleItem(STORAGE_KEYS.CALENDAR_EVENTS, prev, id)
    );
    appendLog('SIGAP GOVERNANCE', `Menghapus agenda kalender ID ${id}`);
    addToast('Agenda Dihapus', 'Kegiatan kalender akademik berhasil dihapus.', 'info');
  };

  const handleSaveSchedule = (sc: ScheduleItem, isEdit: boolean) => {
    setSchedules((prev) => upsertModuleItem(STORAGE_KEYS.SCHEDULES, prev, sc));
    appendLog(
      'SIGAP GOVERNANCE',
      `${isEdit ? 'Memperbarui' : 'Menambah'} jadwal ${sc.mataPelajaran} (${sc.rombel})`
    );
    addToast(
      isEdit ? 'Jadwal Diperbarui' : 'Jadwal Baru Tersimpan',
      `${sc.mataPelajaran} — ${sc.hari}, ${sc.waktu} (${sc.rombel})`
    );
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => deleteModuleItem(STORAGE_KEYS.SCHEDULES, prev, id));
    appendLog('SIGAP GOVERNANCE', `Menghapus jadwal pembelajaran ID ${id}`);
    addToast('Jadwal Dihapus', 'Jadwal pembelajaran telah dihapus.', 'info');
  };

  const handleSaveJournal = (jr: TeacherJournal, isEdit: boolean) => {
    setJournals((prev) => upsertModuleItem(STORAGE_KEYS.JOURNALS, prev, jr));
    appendLog(
      'SIGAP GOVERNANCE',
      `${isEdit ? 'Memperbarui' : 'Mengisi'} jurnal mengajar ${jr.rombel}`
    );
    addToast(
      isEdit ? 'Jurnal Diperbarui' : 'Jurnal Mengajar Tersimpan',
      `Jurnal ${jr.mataPelajaran} (${jr.rombel}) berhasil disimpan.`
    );
  };

  const handleDeleteJournal = (id: string) => {
    setJournals((prev) => deleteModuleItem(STORAGE_KEYS.JOURNALS, prev, id));
    appendLog('SIGAP GOVERNANCE', `Menghapus jurnal aktivitas guru ID ${id}`);
    addToast('Jurnal Dihapus', 'Data jurnal mengajar berhasil dihapus.', 'info');
  };

  const handleSaveAnnouncement = (ann: AnnouncementItem, isEdit: boolean) => {
    setAnnouncements((prev) =>
      upsertModuleItem(STORAGE_KEYS.ANNOUNCEMENTS, prev, ann)
    );
    appendLog(
      'SIGAP GOVERNANCE',
      `${isEdit ? 'Memperbarui' : 'Menerbitkan'} pengumuman: ${ann.title}`
    );
    addToast(
      isEdit ? 'Pengumuman Diperbarui' : 'Pengumuman Diterbitkan',
      `${ann.title} berhasil disimpan.`
    );
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      deleteModuleItem(STORAGE_KEYS.ANNOUNCEMENTS, prev, id)
    );
    appendLog('SIGAP GOVERNANCE', `Menghapus pengumuman ID ${id}`);
    addToast('Pengumuman Dihapus', 'Informasi pengumuman telah dihapus.', 'info');
  };

  // =========================================================================
  // HANDLERS: SIGAP PEDAGOGY & AI CURRICULUM ASSISTANT
  // =========================================================================
  const handleSaveCurriculumDoc = (doc: CurriculumDoc, isEdit: boolean) => {
    setCurriculumDocs((prev) =>
      upsertModuleItem(STORAGE_KEYS.CURRICULUM_DOCS, prev, doc)
    );
    appendLog(
      'SIGAP PEDAGOGY',
      `${isEdit ? 'Memperbarui' : 'Menambahkan'} perangkat ajar: ${doc.judul}`
    );
    addToast(
      isEdit ? 'Dokumen Kurikulum Diperbarui' : 'Dokumen Kurikulum Disimpan',
      `${doc.judul} (${doc.kelas} · ${doc.fase}) berhasil disimpan.`
    );
  };

  const handleDeleteCurriculumDoc = (id: string) => {
    setCurriculumDocs((prev) =>
      deleteModuleItem(STORAGE_KEYS.CURRICULUM_DOCS, prev, id)
    );
    appendLog('SIGAP PEDAGOGY', `Menghapus dokumen kurikulum ID ${id}`);
    addToast('Dokumen Dihapus', 'Dokumen perangkat ajar telah dihapus.', 'info');
  };

  const handleSaveRppHistory = (rpp: GeneratedRppResult) => {
    setRppHistory((prev) =>
      upsertModuleItem(STORAGE_KEYS.RPP_HISTORY, prev, rpp)
    );
    appendLog(
      'SIGAP PEDAGOGY',
      `Menyimpan riwayat AI Curriculum Assistant: ${rpp.identitas.topik}`
    );
    addToast(
      'Riwayat RPP/Modul Ajar Disimpan',
      `Dokumen "${rpp.identitas.topik}" tersimpan di Riwayat AI Curriculum Assistant.`
    );
  };

  const handleDeleteRppHistory = (id: string) => {
    setRppHistory((prev) =>
      deleteModuleItem(STORAGE_KEYS.RPP_HISTORY, prev, id)
    );
    appendLog('SIGAP PEDAGOGY', `Menghapus riwayat RPP ID ${id}`);
    addToast('Riwayat Dihapus', 'Item riwayat RPP telah dihapus.', 'info');
  };

  // =========================================================================
  // HANDLERS: SIGAP ASSESS
  // =========================================================================
  const handleSaveQuestion = (q: QuestionBankItem, isEdit: boolean) => {
    setQuestions((prev) => upsertModuleItem(STORAGE_KEYS.QUESTIONS, prev, q));
    appendLog(
      'SIGAP ASSESS',
      `${isEdit ? 'Memperbarui' : 'Menambah'} butir soal (${q.kodeSoal})`
    );
    addToast(
      isEdit ? 'Butir Soal Diperbarui' : 'Butir Soal Ditambahkan',
      `Soal ${q.kodeSoal} (${q.mataPelajaran}) berhasil disimpan.`
    );
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => deleteModuleItem(STORAGE_KEYS.QUESTIONS, prev, id));
    appendLog('SIGAP ASSESS', `Menghapus butir soal ID ${id}`);
    addToast('Soal Dihapus', 'Data bank soal telah dihapus.', 'info');
  };

  const handleSaveAssessProgram = (
    item: AssessProgramItem,
    isEdit: boolean
  ) => {
    setAssessPrograms((prev) =>
      upsertModuleItem(STORAGE_KEYS.ASSESS_PROGRAMS, prev, item)
    );
    appendLog(
      'SIGAP ASSESS',
      `${isEdit ? 'Memperbarui' : 'Menambahkan'} ${item.jenis}: ${item.judul}`
    );
    addToast(
      `${item.jenis} Disimpan`,
      `${item.judul} (${item.kelas}) berhasil disimpan di penyimpanan lokal.`
    );
  };

  const handleDeleteAssessProgram = (id: string) => {
    setAssessPrograms((prev) =>
      deleteModuleItem(STORAGE_KEYS.ASSESS_PROGRAMS, prev, id)
    );
    appendLog('SIGAP ASSESS', `Menghapus item asesmen ID ${id}`);
    addToast('Data Asesmen Dihapus', 'Item berhasil dihapus dari penyimpanan.', 'info');
  };

  const handleSaveKktpCriterion = (
    item: KktpCriterionItem,
    isEdit: boolean
  ) => {
    setKktpCriteria((prev) =>
      upsertModuleItem(STORAGE_KEYS.KKTP_CRITERIA, prev, item)
    );
    appendLog(
      'SIGAP ASSESS',
      `${isEdit ? 'Memperbarui' : 'Menambahkan'} kriteria KKTP ${item.kode}`
    );
    addToast(
      isEdit ? 'Kriteria KKTP Diperbarui' : 'Kriteria KKTP Ditambahkan',
      `${item.kode} (${item.mataPelajaran} - ${item.kelas}) tersimpan.`
    );
  };

  const handleDeleteKktpCriterion = (id: string) => {
    setKktpCriteria((prev) =>
      deleteModuleItem(STORAGE_KEYS.KKTP_CRITERIA, prev, id)
    );
    appendLog('SIGAP ASSESS', `Menghapus kriteria KKTP ID ${id}`);
    addToast('Kriteria KKTP Dihapus', 'Data kriteria KKTP telah dihapus.', 'info');
  };

  // =========================================================================
  // HANDLERS: SIGAP DIGITAL HUB
  // =========================================================================
  const handleUpdateAppEndpoint = (id: SubMenuId, endpointUrl: string) => {
    setDigitalApps((prev) => {
      const next = prev.map((a) =>
        a.id === id
          ? {
              ...a,
              endpointUrl,
              status: (endpointUrl.trim()
                ? 'URL Sudah Dikonfigurasi'
                : 'URL Belum Dikonfigurasi') as DigitalHubApp['status'],
            }
          : a
      );
      saveModuleData(STORAGE_KEYS.DIGITAL_APPS, next);
      return next;
    });
    appendLog(
      'SIGAP DIGITAL HUB',
      `Mengonfigurasi URL aplikasi ${id}: ${endpointUrl || '(dikosongkan)'}`
    );
    addToast(
      endpointUrl.trim()
        ? 'URL Aplikasi Dikonfigurasi'
        : 'URL Aplikasi Dikosongkan',
      endpointUrl.trim()
        ? `Status konektor kini: URL Sudah Dikonfigurasi (${endpointUrl})`
        : 'Status konektor kini: URL Belum Dikonfigurasi'
    );
  };

  // =========================================================================
  // HANDLERS: SIGAP CLASSHUB
  // =========================================================================
  const handleSaveClassHubRoom = (room: ClassHubRoom, isEdit: boolean) => {
    setClassHubRooms((prev) =>
      upsertModuleItem(STORAGE_KEYS.CLASSHUB_ROOMS, prev, room)
    );
    appendLog(
      'SIGAP CLASSHUB',
      `${isEdit ? 'Memperbarui' : 'Membuat'} kelas digital: ${room.rombel}`
    );
    addToast(
      isEdit ? 'Ruang Kelas Diperbarui' : 'Ruang Kelas Digital Dibuat',
      `${room.rombel} — ${room.namaKelas} berhasil disimpan.`
    );
  };

  const handleDeleteClassHubRoom = (id: string) => {
    setClassHubRooms((prev) =>
      deleteModuleItem(STORAGE_KEYS.CLASSHUB_ROOMS, prev, id)
    );
    appendLog('SIGAP CLASSHUB', `Menghapus ruang kelas digital ID ${id}`);
    addToast('Ruang Kelas Dihapus', 'Data kelas digital telah dihapus.', 'info');
  };

  const handleSaveAssignment = (a: ClassHubAssignment, isEdit: boolean) => {
    setAssignments((prev) =>
      upsertModuleItem(STORAGE_KEYS.ASSIGNMENTS, prev, a)
    );
    appendLog(
      'SIGAP CLASSHUB',
      `${isEdit ? 'Memperbarui' : 'Membuat'} tugas siswa: ${a.judul}`
    );
    addToast(
      isEdit ? 'Tugas Siswa Diperbarui' : 'Tugas Siswa Diterbitkan',
      `${a.judul} (${a.kelas}) berhasil disimpan.`
    );
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) =>
      deleteModuleItem(STORAGE_KEYS.ASSIGNMENTS, prev, id)
    );
    appendLog('SIGAP CLASSHUB', `Menghapus tugas siswa ID ${id}`);
    addToast('Tugas Siswa Dihapus', 'Data tugas kelas telah dihapus.', 'info');
  };

  const handleSaveSubmission = (s: StudentSubmission, isEdit: boolean) => {
    setSubmissions((prev) =>
      upsertModuleItem(STORAGE_KEYS.SUBMISSIONS, prev, s)
    );
    appendLog(
      'SIGAP CLASSHUB',
      `${isEdit ? 'Memperbarui' : 'Simulasi pengumpulan'} tugas oleh ${s.studentName}`
    );
    addToast(
      isEdit ? 'Pengumpulan Tugas Diperbarui' : 'Tugas Berhasil Dikumpulkan',
      `Pengumpulan tugas oleh ${s.studentName} (${s.rombel}) tercatat.`
    );
  };

  const handleDeleteSubmission = (id: string) => {
    setSubmissions((prev) =>
      deleteModuleItem(STORAGE_KEYS.SUBMISSIONS, prev, id)
    );
    appendLog('SIGAP CLASSHUB', `Menghapus data pengumpulan tugas ID ${id}`);
    addToast('Data Pengumpulan Dihapus', 'Catatan pengumpulan tugas dihapus.', 'info');
  };

  const handleGradeSubmission = (
    id: string,
    nilai: number,
    catatanGuru: string
  ) => {
    setSubmissions((prev) => {
      const next = prev.map((s) =>
        s.id === id
          ? {
              ...s,
              nilai,
              catatanGuru,
              status: 'Sudah Dinilai' as StudentSubmission['status'],
            }
          : s
      );
      saveModuleData(STORAGE_KEYS.SUBMISSIONS, next);
      return next;
    });
    appendLog('SIGAP CLASSHUB', `Memberikan nilai (${nilai}) pada tugas ID ${id}`);
    addToast(
      'Penilaian Tugas Disimpan',
      `Nilai ${nilai} berhasil disimpan untuk pengumpulan tugas.`
    );
  };

  // =========================================================================
  // HANDLERS: SIGAP CONTROL CENTER
  // =========================================================================
  const handleUpdateSchoolIdentity = (updated: SchoolIdentity) => {
    setSchoolIdentity(updated);
    saveModuleData(STORAGE_KEYS.SCHOOL_IDENTITY, updated);
    appendLog(
      'SIGAP CONTROL CENTER',
      'Memperbarui profil identitas & banner sekolah'
    );
    addToast(
      'Identitas Sekolah Disimpan',
      `Profil ${updated.namaSekolah} berhasil diperbarui di penyimpanan lokal.`
    );
  };

  const handleUpdatePortalSettings = (updated: PortalDisplaySettings) => {
    setPortalSettings(updated);
    saveModuleData(STORAGE_KEYS.PORTAL_SETTINGS, updated);
    appendLog(
      'SIGAP CONTROL CENTER',
      `Memperbarui pengaturan tampilan portal (${updated.highlightTheme})`
    );
    addToast(
      'Pengaturan Portal Disimpan',
      'Preferensi tampilan portal sekolah berhasil disimpan.'
    );
  };

  const handleClearActivityLogs = () => {
    setActivityLogs([]);
    saveModuleData(STORAGE_KEYS.ACTIVITY_LOGS, []);
    addToast(
      'Log Aktivitas Dibersihkan',
      'Seluruh catatan log aktivitas lokal telah dikosongkan.',
      'info'
    );
  };

  const handleResetDemoData = () => {
    const fresh = resetAllDemoStorage();
    setCurrentRole(fresh.currentRole);
    setSchoolIdentity(fresh.schoolIdentity);
    setPortalSettings(fresh.portalSettings);
    setTeachers(fresh.teachers);
    setStudents(fresh.students);
    setRombel(fresh.rombel);
    setDigitalApps(fresh.digitalApps);
    setAnnouncements(fresh.announcements);
    setCalendarEvents(fresh.calendarEvents);
    setSchedules(fresh.schedules);
    setJournals(fresh.journals);
    setCurriculumDocs(fresh.curriculumDocs);
    setRppHistory(fresh.rppHistory);
    setQuestions(fresh.questions);
    setAssessPrograms(fresh.assessPrograms);
    setKktpCriteria(fresh.kktpCriteria);
    setClassHubRooms(fresh.classHubRooms);
    setAssignments(fresh.assignments);
    setSubmissions(fresh.submissions);
    setActivityLogs(fresh.activityLogs);
    addToast(
      'Data DEMO Berhasil Direset',
      'Seluruh penyimpanan lokal telah dikembalikan ke data awal [DEMO] SD Negeri Karanggintung 06.'
    );
  };

  const renderMainContent = () => {
    switch (activeSubMenu) {
      // 1. SIGAP HOME
      case 'dashboard':
        return (
          <DashboardView
            currentRole={currentRole}
            schoolIdentity={schoolIdentity}
            onUpdateBanner={(dataUrl) => {
              const next = { ...schoolIdentity, bannerImageUrl: dataUrl };
              setSchoolIdentity(next);
              saveModuleData(STORAGE_KEYS.SCHOOL_IDENTITY, next);
              addToast(
                'Banner Sekolah Diperbarui',
                'Gambar banner beranda berhasil disimpan di penyimpanan lokal.'
              );
            }}
            teachers={teachers}
            students={students}
            rombel={rombel}
            digitalApps={digitalApps}
            announcements={announcements}
            calendarEvents={calendarEvents}
            activityLogs={activityLogs}
            curriculumDocs={curriculumDocs}
            onNavigate={setActiveSubMenu}
          />
        );
      case 'profil-pengguna':
        return (
          <UserProfileModule
            currentRole={currentRole}
            schoolIdentity={schoolIdentity}
            currentUser={authUser}
            onChangeRole={(r) => {
              setCurrentRole(r);
              saveModuleData(STORAGE_KEYS.CURRENT_ROLE, r);
              if (authUser.isAuthenticated) {
                const updated = { ...authUser, role: r };
                setAuthUser(updated);
                saveModuleData(STORAGE_KEYS.AUTH_USER, updated);
              }
              appendLog('SIGAP HOME', `Beralih peran aktif menjadi ${r}`);
              addToast('Peran Pengguna Diubah', `Sesi aktif beralih ke peran ${r}.`);
            }}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        );

      // 2. SIGAP MASTER
      case 'data-guru':
        return (
          <DataGuruModule
            teachers={teachers}
            onSaveTeacher={handleSaveTeacher}
            onDeleteTeacher={handleDeleteTeacher}
          />
        );
      case 'data-siswa':
        return (
          <DataSiswaModule
            students={students}
            rombelList={rombel}
            onSaveStudent={handleSaveStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      case 'data-rombel':
        return (
          <DataRombelModule
            rombel={rombel}
            students={students}
            teachers={teachers}
            onSaveRombel={handleSaveRombel}
            onDeleteRombel={handleDeleteRombel}
            onMoveStudentRombel={handleMoveStudentRombel}
            onQuickAddStudentToRombel={handleQuickAddStudentToRombel}
          />
        );

      // 3. SIGAP GOVERNANCE
      case 'kalender-akademik':
      case 'jadwal-pembelajaran':
      case 'jurnal-guru':
      case 'informasi-pengumuman':
        return (
          <GovernanceModules
            subMenuId={activeSubMenu}
            calendarEvents={calendarEvents}
            onSaveCalendarEvent={handleSaveCalendarEvent}
            onDeleteCalendarEvent={handleDeleteCalendarEvent}
            schedules={schedules}
            onSaveSchedule={handleSaveSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            journals={journals}
            onSaveJournal={handleSaveJournal}
            onDeleteJournal={handleDeleteJournal}
            announcements={announcements}
            onSaveAnnouncement={handleSaveAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        );

      // 4. SIGAP PEDAGOGY
      case 'pemetaan-kurikulum':
      case 'tujuan-pembelajaran':
      case 'alur-tujuan-pembelajaran':
      case 'prota-promes':
      case 'modul-ajar-rpp':
      case 'bahan-ajar-digital':
      case 'media-pembelajaran':
      case 'ai-curriculum-assistant':
        return (
          <PedagogyModules
            subMenuId={activeSubMenu}
            curriculumDocs={curriculumDocs}
            onSaveCurriculumDoc={handleSaveCurriculumDoc}
            onDeleteCurriculumDoc={handleDeleteCurriculumDoc}
            rppHistory={rppHistory}
            onSaveRppHistory={handleSaveRppHistory}
            onDeleteRppHistory={handleDeleteRppHistory}
            onNavigate={setActiveSubMenu}
            onNotify={(title, msg, type) =>
              addToast(title, msg, type || 'success')
            }
          />
        );

      // 5. SIGAP ASSESS
      case 'instrumen-asesmen':
      case 'kktp':
      case 'bank-soal-lkpd':
      case 'remedial-pengayaan':
        return (
          <AssessModules
            subMenuId={activeSubMenu}
            questions={questions}
            onSaveQuestion={handleSaveQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            assessPrograms={assessPrograms}
            onSaveAssessProgram={handleSaveAssessProgram}
            onDeleteAssessProgram={handleDeleteAssessProgram}
            kktpCriteria={kktpCriteria}
            onSaveKktpCriterion={handleSaveKktpCriterion}
            onDeleteKktpCriterion={handleDeleteKktpCriterion}
          />
        );

      // 6. SIGAP DIGITAL HUB
      case 'absensi-qr-wa':
      case 'sikumer':
      case 'analisis-asesmen':
      case 'smart-learning':
        return (
          <DigitalHubIntegrationModule
            subMenuId={activeSubMenu}
            digitalApps={digitalApps}
            onUpdateAppEndpoint={handleUpdateAppEndpoint}
            onNavigate={setActiveSubMenu}
          />
        );

      // 7. SIGAP CLASSHUB
      case 'dashboard-kelas':
      case 'materi-pembelajaran':
      case 'tugas-siswa':
      case 'pengumpulan-tugas':
        return (
          <ClassHubModules
            subMenuId={activeSubMenu}
            classHubRooms={classHubRooms}
            onSaveClassHubRoom={handleSaveClassHubRoom}
            onDeleteClassHubRoom={handleDeleteClassHubRoom}
            assignments={assignments}
            onSaveAssignment={handleSaveAssignment}
            onDeleteAssignment={handleDeleteAssignment}
            submissions={submissions}
            onSaveSubmission={handleSaveSubmission}
            onDeleteSubmission={handleDeleteSubmission}
            onGradeSubmission={handleGradeSubmission}
            curriculumDocs={curriculumDocs}
            onSaveCurriculumDoc={handleSaveCurriculumDoc}
            onDeleteCurriculumDoc={handleDeleteCurriculumDoc}
          />
        );

      // 8. SIGAP CONTROL CENTER
      case 'identitas-banner':
      case 'manajemen-aplikasi':
      case 'pengguna-hak-akses':
      case 'database-backup':
      case 'log-aktivitas':
        return (
          <ControlCenterModules
            subMenuId={activeSubMenu}
            schoolIdentity={schoolIdentity}
            onUpdateSchoolIdentity={handleUpdateSchoolIdentity}
            portalSettings={portalSettings}
            onUpdatePortalSettings={handleUpdatePortalSettings}
            digitalApps={digitalApps}
            onUpdateAppEndpoint={handleUpdateAppEndpoint}
            activityLogs={activityLogs}
            onClearActivityLogs={handleClearActivityLogs}
            onResetDemoData={handleResetDemoData}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F4F8FF] text-slate-800">
      {/* Global Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Left Navy Sidebar with Official Uploaded SMART SIGAP Logo */}
      <Sidebar
        activeSubMenu={activeSubMenu}
        onSelectSubMenu={setActiveSubMenu}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        currentUser={authUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleRequestLogout}
      />

      {/* Right Main Area: White Topbar + Soft Blue Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          activeSubMenu={activeSubMenu}
          onSelectSubMenu={setActiveSubMenu}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          currentRole={currentRole}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          announcements={announcements}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 max-w-[1440px] w-full mx-auto">
          {renderMainContent()}
        </main>

        {/* Quiet Official School Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 py-4 border-t border-blue-100/90 bg-white/70 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
          <div>
            <strong>{schoolIdentity.namaPortal || 'SMART SIGAP'}</strong> (
            {schoolIdentity.taglinePortal ||
              'Sistem Integrasi Guru & Anak Pintar'}
            ) — <strong>{schoolIdentity.namaSekolah}</strong>
          </div>
          <div>
            Tahun Ajaran {schoolIdentity.tahunAjaranAktif} ·{' '}
            {portalSettings.showDemoBadges
              ? 'Seluruh data contoh ditandai [DEMO] & tersimpan di localStorage'
              : 'Penyimpanan Lokal Aktif'}
          </div>
        </footer>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmLogoutOpen}
        title="Konfirmasi Keluar Sistem"
        description={
          authUser.role === 'Mode Pratinjau'
            ? 'Apakah Anda ingin mengakhiri sesi Mode Pratinjau SMART SIGAP dan kembali ke halaman login?'
            : `Apakah Anda yakin ingin keluar dari SMART SIGAP? Sesi untuk ${authUser.name || 'pengguna aktif'} akan diakhiri.`
        }
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsConfirmLogoutOpen(false)}
      />

      {/* Simplified Clean Login Modal with Official Uploaded SMART SIGAP Logo & Demo Access */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onLogin={handleLoginSuccess}
        onDemoAccess={handleDemoAccess}
        onClose={() => setIsLoginModalOpen(false)}
        canClose={authUser.isAuthenticated}
      />
    </div>
  );
}
