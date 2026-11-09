import {
  SchoolIdentity,
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
  PortalDisplaySettings,
  UserRole,
  AuthUser,
} from '../types/sigap';
import {
  INITIAL_SCHOOL_IDENTITY,
  INITIAL_PORTAL_SETTINGS,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_ROMBEL,
  INITIAL_DIGITAL_HUB_APPS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_SCHEDULES,
  INITIAL_JOURNALS,
  INITIAL_CURRICULUM_DOCS,
  INITIAL_RPP_HISTORY,
  INITIAL_QUESTIONS,
  INITIAL_ASSESS_PROGRAMS,
  INITIAL_KKTP_CRITERIA,
  INITIAL_CLASSHUB_ROOMS,
  INITIAL_CLASSHUB_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/demoData';

/**
 * Kunci penyimpanan terpisah per modul di localStorage.
 * CATATAN KEAMANAN: Tidak pernah menyimpan password, PIN, token, atau rahasia pengguna.
 */
export const STORAGE_KEYS = {
  AUTH_USER: 'sigap_v3_auth_user',
  CURRENT_ROLE: 'sigap_v3_current_role',
  SCHOOL_IDENTITY: 'sigap_v3_school_identity',
  PORTAL_SETTINGS: 'sigap_v3_portal_settings',
  TEACHERS: 'sigap_v3_master_teachers',
  STUDENTS: 'sigap_v3_master_students',
  ROMBEL: 'sigap_v3_master_rombel',
  DIGITAL_APPS: 'sigap_v3_digital_hub_apps',
  ANNOUNCEMENTS: 'sigap_v3_gov_announcements',
  CALENDAR_EVENTS: 'sigap_v3_gov_calendar_events',
  SCHEDULES: 'sigap_v3_gov_schedules',
  JOURNALS: 'sigap_v3_gov_journals',
  CURRICULUM_DOCS: 'sigap_v3_pedagogy_docs',
  RPP_HISTORY: 'sigap_v3_pedagogy_rpp_history',
  QUESTIONS: 'sigap_v3_assess_questions',
  ASSESS_PROGRAMS: 'sigap_v3_assess_programs',
  KKTP_CRITERIA: 'sigap_v3_assess_kktp',
  CLASSHUB_ROOMS: 'sigap_v3_classhub_rooms',
  ASSIGNMENTS: 'sigap_v3_classhub_assignments',
  SUBMISSIONS: 'sigap_v3_classhub_submissions',
  ACTIVITY_LOGS: 'sigap_v3_control_activity_logs',
} as const;

export const INITIAL_AUTH_USER: AuthUser = {
  id: 'USR-DEMO-PREVIEW',
  name: 'Pengunjung Demo',
  identifier: 'pengunjung.demo',
  role: 'Mode Pratinjau',
  isAuthenticated: true,
};

const FORBIDDEN_SECRET_FIELDS = ['password', 'pin', 'secret', 'apiKey', 'token'];

function stripSensitiveKeys<T>(data: T): T {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) {
    return data.map((item) => stripSensitiveKeys(item)) as unknown as T;
  }
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
    if (FORBIDDEN_SECRET_FIELDS.includes(k.toLowerCase())) continue;
    cleaned[k] = stripSensitiveKeys(v);
  }
  return cleaned as T;
}

export function loadModuleData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(stripSensitiveKeys(fallback)));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveModuleData<T>(key: string, data: T): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    const safeData = stripSensitiveKeys(data);
    window.localStorage.setItem(key, JSON.stringify(safeData));
    return true;
  } catch {
    return false;
  }
}

export function upsertModuleItem<T extends { id: string }>(
  key: string,
  currentList: T[],
  item: T
): T[] {
  const exists = currentList.some((x) => x.id === item.id);
  const nextList = exists
    ? currentList.map((x) => (x.id === item.id ? item : x))
    : [item, ...currentList];
  saveModuleData(key, nextList);
  return nextList;
}

export function deleteModuleItem<T extends { id: string }>(
  key: string,
  currentList: T[],
  id: string
): T[] {
  const nextList = currentList.filter((x) => x.id !== id);
  saveModuleData(key, nextList);
  return nextList;
}

export interface AllSigapStorageState {
  authUser: AuthUser;
  currentRole: UserRole;
  schoolIdentity: SchoolIdentity;
  portalSettings: PortalDisplaySettings;
  teachers: TeacherRecord[];
  students: StudentRecord[];
  rombel: RombelRecord[];
  digitalApps: DigitalHubApp[];
  announcements: AnnouncementItem[];
  calendarEvents: CalendarEvent[];
  schedules: ScheduleItem[];
  journals: TeacherJournal[];
  curriculumDocs: CurriculumDoc[];
  rppHistory: GeneratedRppResult[];
  questions: QuestionBankItem[];
  assessPrograms: AssessProgramItem[];
  kktpCriteria: KktpCriterionItem[];
  classHubRooms: ClassHubRoom[];
  assignments: ClassHubAssignment[];
  submissions: StudentSubmission[];
  activityLogs: ActivityLogItem[];
}

export function loadAllInitialState(): AllSigapStorageState {
  return {
    authUser: loadModuleData<AuthUser>(
      STORAGE_KEYS.AUTH_USER,
      INITIAL_AUTH_USER
    ),
    currentRole: loadModuleData<UserRole>(
      STORAGE_KEYS.CURRENT_ROLE,
      'Mode Pratinjau'
    ),
    schoolIdentity: loadModuleData<SchoolIdentity>(
      STORAGE_KEYS.SCHOOL_IDENTITY,
      INITIAL_SCHOOL_IDENTITY
    ),
    portalSettings: loadModuleData<PortalDisplaySettings>(
      STORAGE_KEYS.PORTAL_SETTINGS,
      INITIAL_PORTAL_SETTINGS
    ),
    teachers: loadModuleData<TeacherRecord[]>(
      STORAGE_KEYS.TEACHERS,
      INITIAL_TEACHERS
    ),
    students: loadModuleData<StudentRecord[]>(
      STORAGE_KEYS.STUDENTS,
      INITIAL_STUDENTS
    ),
    rombel: loadModuleData<RombelRecord[]>(STORAGE_KEYS.ROMBEL, INITIAL_ROMBEL),
    digitalApps: loadModuleData<DigitalHubApp[]>(
      STORAGE_KEYS.DIGITAL_APPS,
      INITIAL_DIGITAL_HUB_APPS
    ),
    announcements: loadModuleData<AnnouncementItem[]>(
      STORAGE_KEYS.ANNOUNCEMENTS,
      INITIAL_ANNOUNCEMENTS
    ),
    calendarEvents: loadModuleData<CalendarEvent[]>(
      STORAGE_KEYS.CALENDAR_EVENTS,
      INITIAL_CALENDAR_EVENTS
    ),
    schedules: loadModuleData<ScheduleItem[]>(
      STORAGE_KEYS.SCHEDULES,
      INITIAL_SCHEDULES
    ),
    journals: loadModuleData<TeacherJournal[]>(
      STORAGE_KEYS.JOURNALS,
      INITIAL_JOURNALS
    ),
    curriculumDocs: loadModuleData<CurriculumDoc[]>(
      STORAGE_KEYS.CURRICULUM_DOCS,
      INITIAL_CURRICULUM_DOCS
    ),
    rppHistory: loadModuleData<GeneratedRppResult[]>(
      STORAGE_KEYS.RPP_HISTORY,
      INITIAL_RPP_HISTORY
    ),
    questions: loadModuleData<QuestionBankItem[]>(
      STORAGE_KEYS.QUESTIONS,
      INITIAL_QUESTIONS
    ),
    assessPrograms: loadModuleData<AssessProgramItem[]>(
      STORAGE_KEYS.ASSESS_PROGRAMS,
      INITIAL_ASSESS_PROGRAMS
    ),
    kktpCriteria: loadModuleData<KktpCriterionItem[]>(
      STORAGE_KEYS.KKTP_CRITERIA,
      INITIAL_KKTP_CRITERIA
    ),
    classHubRooms: loadModuleData<ClassHubRoom[]>(
      STORAGE_KEYS.CLASSHUB_ROOMS,
      INITIAL_CLASSHUB_ROOMS
    ),
    assignments: loadModuleData<ClassHubAssignment[]>(
      STORAGE_KEYS.ASSIGNMENTS,
      INITIAL_CLASSHUB_ASSIGNMENTS
    ),
    submissions: loadModuleData<StudentSubmission[]>(
      STORAGE_KEYS.SUBMISSIONS,
      INITIAL_SUBMISSIONS
    ),
    activityLogs: loadModuleData<ActivityLogItem[]>(
      STORAGE_KEYS.ACTIVITY_LOGS,
      INITIAL_ACTIVITY_LOGS
    ),
  };
}

export function resetAllDemoStorage(): AllSigapStorageState {
  saveModuleData(STORAGE_KEYS.AUTH_USER, INITIAL_AUTH_USER);
  saveModuleData(STORAGE_KEYS.CURRENT_ROLE, 'Kepala Sekolah');
  saveModuleData(STORAGE_KEYS.SCHOOL_IDENTITY, INITIAL_SCHOOL_IDENTITY);
  saveModuleData(STORAGE_KEYS.PORTAL_SETTINGS, INITIAL_PORTAL_SETTINGS);
  saveModuleData(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
  saveModuleData(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  saveModuleData(STORAGE_KEYS.ROMBEL, INITIAL_ROMBEL);
  saveModuleData(STORAGE_KEYS.DIGITAL_APPS, INITIAL_DIGITAL_HUB_APPS);
  saveModuleData(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  saveModuleData(STORAGE_KEYS.CALENDAR_EVENTS, INITIAL_CALENDAR_EVENTS);
  saveModuleData(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  saveModuleData(STORAGE_KEYS.JOURNALS, INITIAL_JOURNALS);
  saveModuleData(STORAGE_KEYS.CURRICULUM_DOCS, INITIAL_CURRICULUM_DOCS);
  saveModuleData(STORAGE_KEYS.RPP_HISTORY, INITIAL_RPP_HISTORY);
  saveModuleData(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  saveModuleData(STORAGE_KEYS.ASSESS_PROGRAMS, INITIAL_ASSESS_PROGRAMS);
  saveModuleData(STORAGE_KEYS.KKTP_CRITERIA, INITIAL_KKTP_CRITERIA);
  saveModuleData(STORAGE_KEYS.CLASSHUB_ROOMS, INITIAL_CLASSHUB_ROOMS);
  saveModuleData(STORAGE_KEYS.ASSIGNMENTS, INITIAL_CLASSHUB_ASSIGNMENTS);
  saveModuleData(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
  saveModuleData(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);

  return loadAllInitialState();
}
