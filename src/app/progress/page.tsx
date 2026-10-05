"use client";

import { useEffect, useMemo, useState } from "react";
import CompactSidebar from "../../components/CompactSidebar";

type Subject = {
  id: string;
  name: string;
  code?: string;
  selected?: boolean;
  progress?: number;
  difficulty?: string;
  category?: string;
};

type Task = {
  id: number | string;
  title: string;
  subject: string;
  done: boolean;
};

type ActivityRecord = {
  date: string;
  seconds?: number;
  // Old data compatibility
  minutes?: number;
};

type WeeklyActivity = {
  day: string;
  date: string;
  seconds: number;
};

type Profile = {
  name?: string;
  branch?: string;
  year?: string;
  semester?: string;
};

const subjectColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
];

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getStartOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);

  return result;
}

function getActivitySeconds(record: ActivityRecord) {
  // New accurate format
  if (typeof record.seconds === "number") {
    return Math.max(0, record.seconds);
  }

  // Compatibility with old data
  if (typeof record.minutes === "number") {
    return Math.max(0, record.minutes * 60);
  }

  return 0;
}

function formatDuration(seconds: number) {
  const safeSeconds = Math.max(
    0,
    Math.floor(seconds)
  );

  const hours = Math.floor(
    safeSeconds / 3600
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60
  );

  const secs = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }

  return `${secs}s`;
}

function formatHours(seconds: number) {
  return Number(
    (seconds / 3600).toFixed(2)
  );
}

function getWeeklyActivity(
  activity: ActivityRecord[]
): WeeklyActivity[] {
  const monday = getStartOfWeek(
    new Date()
  );

  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  return days.map((day, index) => {
    const date = new Date(monday);

    date.setDate(
      monday.getDate() + index
    );

    const dateKey = getDateKey(date);

    const record = activity.find(
      (item) => item.date === dateKey
    );

    return {
      day,
      date: dateKey,
      seconds: record
        ? getActivitySeconds(record)
        : 0,
    };
  });
}

export default function ProgressPage() {
  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [activity, setActivity] =
    useState<ActivityRecord[]>([]);

  const [profile, setProfile] =
    useState<Profile>({});

  const [loaded, setLoaded] =
    useState(false);

  const loadProgressData = () => {
    try {
      const storedSubjects =
        localStorage.getItem(
          "studyplanner-subjects"
        );

      const storedTasks =
        localStorage.getItem(
          "studyplanner-tasks"
        );

      const storedActivity =
        localStorage.getItem(
          "studyplanner-activity"
        );

      const storedProfile =
        localStorage.getItem(
          "studyplanner-profile"
        );

      if (storedSubjects) {
        const parsedSubjects =
          JSON.parse(storedSubjects);

        if (Array.isArray(parsedSubjects)) {
          setSubjects(
            parsedSubjects.filter(
              (subject: Subject) =>
                subject.selected !== false
            )
          );
        }
      }

      if (storedTasks) {
        const parsedTasks =
          JSON.parse(storedTasks);

        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      }

      if (storedActivity) {
        const parsedActivity =
          JSON.parse(storedActivity);

        if (Array.isArray(parsedActivity)) {
          setActivity(parsedActivity);
        }
      }

      if (storedProfile) {
        const parsedProfile =
          JSON.parse(storedProfile);

        if (
          parsedProfile &&
          typeof parsedProfile === "object"
        ) {
          setProfile(parsedProfile);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load progress data:",
        error
      );
    }

    setLoaded(true);
  };

  useEffect(() => {
    loadProgressData();

    const refreshProgress = () => {
      loadProgressData();
    };

    window.addEventListener(
      "storage",
      refreshProgress
    );

    window.addEventListener(
      "studyplanner-activity-updated",
      refreshProgress
    );

    window.addEventListener(
      "studyplanner-data-updated",
      refreshProgress
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshProgress
      );

      window.removeEventListener(
        "studyplanner-activity-updated",
        refreshProgress
      );

      window.removeEventListener(
        "studyplanner-data-updated",
        refreshProgress
      );
    };
  }, []);

  const weeklyActivity = useMemo(() => {
    return getWeeklyActivity(activity);
  }, [activity]);

  const overallProgress = useMemo(() => {
    if (subjects.length === 0) {
      return 0;
    }

    const total = subjects.reduce(
      (sum, subject) =>
        sum + (subject.progress ?? 0),
      0
    );

    return Math.round(
      total / subjects.length
    );
  }, [subjects]);

  const completedTasks = useMemo(() => {
    return tasks.filter(
      (task) => task.done
    ).length;
  }, [tasks]);

  const totalTasks = tasks.length;

  const taskProgress = useMemo(() => {
    if (totalTasks === 0) {
      return 0;
    }

    return Math.round(
      (completedTasks / totalTasks) * 100
    );
  }, [completedTasks, totalTasks]);

  const totalWeeklySeconds =
    useMemo(() => {
      return weeklyActivity.reduce(
        (total, day) =>
          total + day.seconds,
        0
      );
    }, [weeklyActivity]);

  const totalWeeklyHours =
    useMemo(() => {
      return formatHours(
        totalWeeklySeconds
      );
    }, [totalWeeklySeconds]);

  const todaySeconds = useMemo(() => {
    const today = getDateKey();

    const record = activity.find(
      (item) => item.date === today
    );

    return record
      ? getActivitySeconds(record)
      : 0;
  }, [activity]);

  const currentStreak = useMemo(() => {
    let streak = 0;

    const today = new Date();

    for (let index = 0; index < 365; index++) {
      const date = new Date(today);

      date.setDate(
        today.getDate() - index
      );

      const dateKey = getDateKey(date);

      const record = activity.find(
        (item) =>
          item.date === dateKey &&
          getActivitySeconds(item) > 0
      );

      if (record) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [activity]);

  const maxSeconds = useMemo(() => {
    return Math.max(
      ...weeklyActivity.map(
        (day) => day.seconds
      ),
      0
    );
  }, [weeklyActivity]);

  const displayName =
    profile.name || "Student";

  if (!loaded) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <CompactSidebar />

        <section className="lg:ml-20">
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-sm text-slate-500">
              Loading your progress...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <CompactSidebar />

      <section className="lg:ml-20">
        {/* Header */}
        <header className="border-b bg-white px-6 py-5 lg:px-10">
          <div>
            <p className="text-sm text-slate-500">
              StudyPlanner AI
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Your Progress
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track your learning progress and
              study consistency.
            </p>

            {(profile.branch ||
              profile.year ||
              profile.semester) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.branch && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {profile.branch}
                  </span>
                )}

                {profile.year && (
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                    {profile.year}
                  </span>
                )}

                {profile.semester && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    Semester {profile.semester}
                  </span>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="p-6 lg:p-10">
          {/* Main Stats */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {/* Overall Progress */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-3xl">
                  📊
                </span>

                <span className="text-sm font-semibold text-blue-600">
                  {subjects.length} subjects
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold">
                {overallProgress}%
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Overall Progress
              </p>
            </div>

            {/* Tasks */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-3xl">
                  ✅
                </span>

                <span className="text-sm font-semibold text-green-600">
                  {taskProgress}%
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold">
                {completedTasks}/{totalTasks}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Tasks Completed
              </p>
            </div>

            {/* Weekly Study Time */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="text-3xl">
                ⏱️
              </div>

              <p className="mt-5 text-3xl font-bold">
                {totalWeeklyHours}h
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Weekly Study Time
              </p>
            </div>

            {/* Streak */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="text-3xl">
                🔥
              </div>

              <p className="mt-5 text-3xl font-bold">
                {currentStreak} Days
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Current Streak
              </p>
            </div>
          </div>

          {/* Today */}
          <div className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Today&apos;s Study Time
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Exact time recorded from your
                  completed study sessions.
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 px-5 py-3 text-center">
                <p className="text-2xl font-bold text-blue-700">
                  {formatDuration(
                    todaySeconds
                  )}
                </p>

                <p className="text-xs text-blue-600">
                  Studied Today
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-7 xl:grid-cols-2">
            {/* Subject Progress */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">
                Subject Progress
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your current progress in each
                subject.
              </p>

              {subjects.length === 0 ? (
                <div className="mt-7 rounded-xl bg-slate-50 p-6 text-center">
                  <p className="font-medium">
                    No subjects added yet.
                  </p>

                  <a
                    href="/setup"
                    className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
                  >
                    Set up your subjects →
                  </a>
                </div>
              ) : (
                <div className="mt-7 space-y-6">
                  {subjects.map(
                    (subject, index) => {
                      const progress =
                        subject.progress ?? 0;

                      return (
                        <div
                          key={
                            subject.id ||
                            subject.name
                          }
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div>
                              <span className="font-medium">
                                {subject.name}
                              </span>

                              {subject.code && (
                                <span className="ml-2 text-xs text-slate-400">
                                  {subject.code}
                                </span>
                              )}
                            </div>

                            <span className="text-sm font-semibold text-slate-600">
                              {progress}%
                            </span>
                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${
                                subjectColors[
                                  index %
                                    subjectColors.length
                                ]
                              }`}
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* Weekly Activity */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    Weekly Study Activity
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Actual study time recorded this
                    week.
                  </p>
                </div>

                <span className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700">
                  {totalWeeklyHours}h
                </span>
              </div>

              <div className="mt-8 flex h-64 items-end justify-between gap-3">
                {weeklyActivity.map(
                  (day) => {
                    const height =
                      maxSeconds > 0
                        ? (day.seconds /
                            maxSeconds) *
                          100
                        : 0;

                    return (
                      <div
                        key={day.date}
                        className="flex h-full flex-1 flex-col items-center justify-end"
                      >
                        <span className="mb-2 text-xs font-semibold text-slate-600">
                          {formatHours(
                            day.seconds
                          )}
                          h
                        </span>

                        <div className="flex h-44 w-full items-end rounded-lg bg-slate-100">
                          <div
                            className="w-full rounded-lg bg-blue-600 transition-all"
                            style={{
                              height: `${height}%`,
                            }}
                          />
                        </div>

                        <span className="mt-2 text-xs font-medium text-slate-500">
                          {day.day}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>

              <div className="mt-5 rounded-xl bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-900">
                  ⏱️ Exact study tracking
                </p>

                <p className="mt-1 text-xs text-blue-700">
                  Study time is recorded in seconds
                  when you press Stop & Save on the
                  Schedule page. No minute-level
                  rounding is applied.
                </p>
              </div>
            </div>
          </div>

          {/* Achievement */}
          <div className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                🏆
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-bold">
                  {overallProgress >= 75
                    ? `Great work, ${displayName}!`
                    : `Keep going, ${displayName}!`}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {overallProgress >= 75
                    ? "Your learning progress is looking strong. Keep your consistency going and push towards your next milestone."
                    : "You are building your learning progress. Stay consistent, complete your tasks, and keep improving every day."}
                </p>
              </div>

              <div className="rounded-xl bg-green-100 px-4 py-3 text-center">
                <p className="text-xl font-bold text-green-700">
                  {overallProgress}%
                </p>

                <p className="text-xs text-green-700">
                  Overall Progress
                </p>
              </div>
            </div>
          </div>

          {/* Task Progress */}
          <div className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Task Completion
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your progress based on completed
                  planner tasks.
                </p>
              </div>

              <span className="text-lg font-bold text-blue-600">
                {taskProgress}%
              </span>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${taskProgress}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>
                {completedTasks} completed
              </span>

              <span>
                {totalTasks} total tasks
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}