import { COLORS } from "./theme";

export const BLOCKS = ["Morning", "Afternoon", "Evening", "Night"];
export const PRIORITIES = ["Low", "Medium", "High"];
export const PRIORITY_COLOR = { Low: COLORS.accent, Medium: COLORS.warn, High: COLORS.error };

export const CLASSWORK_STATUSES = ["Not started", "In progress", "Submitted"];
export const CLASSWORK_STATUS_COLOR = {
  "Not started": COLORS.error,
  "In progress": COLORS.warn,
  Submitted: COLORS.focus,
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export function nextDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

export const defaultState = () => ({
  tasks: [
    { id: uid(), text: "Revise Physics — Newton's Laws", block: "Morning", priority: "High", done: false },
    { id: uid(), text: "Finish Math worksheet", block: "Afternoon", priority: "Medium", done: false },
    { id: uid(), text: "Read English chapter 4", block: "Evening", priority: "Low", done: true },
  ],
  homework: [
    { id: uid(), subject: "Physics", dueDate: nextDate(2), priority: "High", teacher: "Mr. Sharma", completed: false },
    { id: uid(), subject: "Math", dueDate: nextDate(4), priority: "Medium", teacher: "Mrs. Kaur", completed: false },
  ],
  notes: [
    { id: uid(), title: "Newton's Laws — summary", subject: "Physics", content: "1st law: inertia. 2nd law: F=ma. 3rd law: action-reaction." },
  ],
  events: [
    { id: uid(), title: "Physics Test", date: nextDate(2), type: "Test" },
  ],
  // classwork entries: per-subject work items with optional file attachments
  // (attachments are uploaded to Supabase Storage — only metadata lives here)
  classwork: [
    {
      id: uid(),
      subject: "Physics",
      title: "Chapter 2 worksheet",
      notes: "Answer Q1–10, show your working for numericals.",
      status: "In progress",
      dueDate: nextDate(3),
      files: [],
    },
  ],
  pomodoro: { sessionsToday: 0, focusMinutesToday: 0 },
  eco: { paperSaved: 0, digitalWorksheets: 0, studySessions: 0 },
  profile: {
    name: "Student",
    className: "10-A",
    rollNumber: "",
    school: "",
    studyGoal: 2,
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    joinedDate: nextDate(0),
  },
  settings: {
    theme: "dark",
    accent: "Blue",
    sound: true,
    autoSave: true,
    cloudSync: true,
  },
  achievementsEarned: [],
  seenAchievementIds: [],
});

// backfills any fields missing from a previously-saved row so older
// saves don't break when new features are added
export function mergeWithDefaults(loaded) {
  const d = defaultState();
  return {
    ...d,
    ...loaded,
    pomodoro: { ...d.pomodoro, ...(loaded.pomodoro || {}) },
    eco: { ...d.eco, ...(loaded.eco || {}) },
    profile: { ...d.profile, ...(loaded.profile || {}) },
    settings: { ...d.settings, ...(loaded.settings || {}) },
    events: loaded.events || d.events,
    classwork: loaded.classwork || d.classwork,
    achievementsEarned: loaded.achievementsEarned || [],
    seenAchievementIds: loaded.seenAchievementIds || [],
  };
}

export const ACHIEVEMENTS = [
  { id: "first_focus", emoji: "🏆", label: "First Focus Session", check: (s) => s.pomodoro.sessionsToday > 0 || s.eco.studySessions > 0 },
  { id: "streak_7", emoji: "🔥", label: "7 Day Streak", check: (s) => s.profile.streak >= 7 },
  { id: "tasks_100", emoji: "📚", label: "100 Tasks Completed", check: (s) => s.tasks.filter((t) => t.done).length >= 100 },
  { id: "focus_10h", emoji: "⏰", label: "10 Hours Focused", check: (s) => s.pomodoro.focusMinutesToday >= 600 },
  { id: "paper_100", emoji: "🌱", label: "Saved 100 Pages", check: (s) => s.eco.paperSaved >= 100 },
  { id: "tasks_500", emoji: "🎯", label: "500 Tasks Completed", check: (s) => s.tasks.filter((t) => t.done).length >= 500 },
];

// bumps streak/xp once per calendar day
export function applyDailyVisit(s) {
  const today = nextDate(0);
  const p = s.profile;
  if (p.lastActiveDate === today) return s;
  const yesterday = nextDate(-1);
  const newStreak = p.lastActiveDate === yesterday ? p.streak + 1 : 1;
  return { ...s, profile: { ...p, streak: newStreak, lastActiveDate: today, xp: p.xp + 5 } };
}

export function getNewlyEarned(s) {
  return ACHIEVEMENTS.filter((a) => a.check(s) && !s.achievementsEarned.includes(a.id)).map((a) => a.id);
}

export function loadState() {
  return defaultState();
}
