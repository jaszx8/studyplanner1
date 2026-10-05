"use client";

import { useEffect, useMemo, useState } from "react";
import CompactSidebar from "../../components/CompactSidebar";

type Subject = {
  id: string;
  name: string;
  code?: string;
  selected?: boolean;
};

type Session = {
  id: number;
  subject: string;
  topic: string;
  time: string;
  duration: number;
};

type ActiveTimer = {
  sessionId: number;
  subject: string;
  topic: string;
  startedAt: number;
};

type ActivityRecord = {
  date: string;
  seconds: number;
};

const SESSION_KEY = "studyplanner-sessions";
const SUBJECT_KEY = "studyplanner-subjects";
const ACTIVITY_KEY = "studyplanner-activity";
const ACTIVE_TIMER_KEY = "studyplanner-active-timer";

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTimer(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  return [
    hours > 0 ? String(hours).padStart(2, "0") : null,
    String(minutes).padStart(2, "0"),
    String(secs).padStart(2, "0"),
  ]
    .filter(Boolean)
    .join(":");
}

function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return `${safeSeconds}s`;
}

function formatToday() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function SchedulePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTimer, setActiveTimer] =
    useState<ActiveTimer | null>(null);

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const [newSubject, setNewSubject] =
    useState("");

  const [newTopic, setNewTopic] =
    useState("");

  const [newTime, setNewTime] =
    useState("09:00");

  const [newDuration, setNewDuration] =
    useState(60);

  const [loaded, setLoaded] =
    useState(false);

  // Load all saved data
  useEffect(() => {
    try {
      const storedSubjects =
        localStorage.getItem(SUBJECT_KEY);

      const storedSessions =
        localStorage.getItem(SESSION_KEY);

      const storedTimer =
        localStorage.getItem(ACTIVE_TIMER_KEY);

      if (storedSubjects) {
        const parsed = JSON.parse(
          storedSubjects
        );

        if (Array.isArray(parsed)) {
          setSubjects(
            parsed.filter(
              (subject: Subject) =>
                subject.selected !== false
            )
          );
        }
      }

      if (storedSessions) {
        const parsed = JSON.parse(
          storedSessions
        );

        if (Array.isArray(parsed)) {
          setSessions(parsed);
        }
      }

      if (storedTimer) {
        const parsed = JSON.parse(
          storedTimer
        );

        if (
          parsed &&
          typeof parsed === "object" &&
          parsed.startedAt
        ) {
          setActiveTimer(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load schedule:",
        error
      );
    }

    setLoaded(true);
  }, []);

  // Save sessions
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(sessions)
    );
  }, [sessions, loaded]);

  // Timer
  useEffect(() => {
    if (!activeTimer) {
      setElapsedSeconds(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();

      const seconds = Math.floor(
        (now - activeTimer.startedAt) /
          1000
      );

      setElapsedSeconds(
        Math.max(0, seconds)
      );
    };

    updateTimer();

    const interval = setInterval(
      updateTimer,
      250
    );

    return () => {
      clearInterval(interval);
    };
  }, [activeTimer]);

  const todayActivitySeconds =
    useMemo(() => {
      try {
        const stored =
          localStorage.getItem(
            ACTIVITY_KEY
          );

        if (!stored) return 0;

        const parsed = JSON.parse(
          stored
        );

        if (!Array.isArray(parsed)) {
          return 0;
        }

        const today = getDateKey();

        const record = parsed.find(
          (item: ActivityRecord) =>
            item.date === today
        );

        return record
          ? Number(record.seconds || 0)
          : 0;
      } catch {
        return 0;
      }
    }, [elapsedSeconds]);

  const saveActivity = (
    secondsToAdd: number
  ) => {
    if (secondsToAdd <= 0) {
      return;
    }

    try {
      const stored =
        localStorage.getItem(
          ACTIVITY_KEY
        );

      let activity: ActivityRecord[] =
        [];

      if (stored) {
        const parsed = JSON.parse(
          stored
        );

        if (Array.isArray(parsed)) {
          activity = parsed;
        }
      }

      const today = getDateKey();

      const existingIndex =
        activity.findIndex(
          (item) =>
            item.date === today
        );

      if (existingIndex >= 0) {
        activity[existingIndex] = {
          ...activity[existingIndex],
          seconds:
            Number(
              activity[existingIndex]
                .seconds || 0
            ) + secondsToAdd,
        };
      } else {
        activity.push({
          date: today,
          seconds: secondsToAdd,
        });
      }

      localStorage.setItem(
        ACTIVITY_KEY,
        JSON.stringify(activity)
      );

      // Notify pages/components in same tab
      window.dispatchEvent(
        new Event(
          "studyplanner-activity-updated"
        )
      );
    } catch (error) {
      console.error(
        "Failed to save activity:",
        error
      );
    }
  };

  const startTimer = (
    session: Session
  ) => {
    if (activeTimer) {
      return;
    }

    const timer: ActiveTimer = {
      sessionId: session.id,
      subject: session.subject,
      topic: session.topic,
      startedAt: Date.now(),
    };

    setActiveTimer(timer);

    localStorage.setItem(
      ACTIVE_TIMER_KEY,
      JSON.stringify(timer)
    );
  };

  const stopTimer = () => {
    if (!activeTimer) {
      return;
    }

    const now = Date.now();

    const exactSeconds = Math.floor(
      (now - activeTimer.startedAt) /
        1000
    );

    if (exactSeconds > 0) {
      saveActivity(exactSeconds);
    }

    setActiveTimer(null);
    setElapsedSeconds(0);

    localStorage.removeItem(
      ACTIVE_TIMER_KEY
    );
  };

  const addSession = () => {
    if (!newSubject.trim()) {
      return;
    }

    const newSession: Session = {
      id: Date.now(),
      subject: newSubject,
      topic:
        newTopic.trim() ||
        "Study Session",
      time: newTime,
      duration: Number(newDuration),
    };

    setSessions((current) => [
      ...current,
      newSession,
    ]);

    setNewTopic("");
    setNewDuration(60);
  };

  const deleteSession = (
    sessionId: number
  ) => {
    if (
      activeTimer?.sessionId ===
      sessionId
    ) {
      return;
    }

    setSessions((current) =>
      current.filter(
        (session) =>
          session.id !== sessionId
      )
    );
  };

  const formattedTodayActivity =
    formatDuration(
      todayActivitySeconds
    );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <CompactSidebar />

        <section className="lg:ml-20">
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-sm text-slate-500">
              Loading schedule...
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
          <p className="text-sm text-slate-500">
            StudyPlanner AI
          </p>

          <h1 className="mt-1 text-2xl font-bold">
            Study Schedule
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Plan your study sessions and track
            your actual study time.
          </p>
        </header>

        <div className="p-6 lg:p-10">
          {/* Today's summary */}
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Today
              </p>

              <p className="mt-2 text-lg font-bold">
                {formatToday()}
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Studied Today
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                {formattedTodayActivity}
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Active Session
              </p>

              <p className="mt-2 text-2xl font-bold">
                {activeTimer
                  ? formatTimer(
                      elapsedSeconds
                    )
                  : "None"}
              </p>
            </div>
          </div>

          {/* Active Timer */}
          {activeTimer && (
            <div className="mt-7 rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Study session running
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-blue-950">
                    {activeTimer.subject}
                  </h2>

                  <p className="mt-1 text-sm text-blue-700">
                    {activeTimer.topic}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-white px-5 py-3 text-center shadow-sm">
                    <p className="font-mono text-2xl font-bold text-blue-700">
                      {formatTimer(
                        elapsedSeconds
                      )}
                    </p>
                  </div>

                  <button
                    onClick={stopTimer}
                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Stop & Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sessions */}
          <div className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Today&apos;s Sessions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Start a session when you actually
                  begin studying.
                </p>
              </div>

              <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">
                {sessions.length} sessions
              </span>
            </div>

            {sessions.length === 0 ? (
              <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center">
                <p className="font-medium">
                  No study sessions yet.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Create your first study session
                  below.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {sessions.map(
                  (session) => {
                    const isRunning =
                      activeTimer?.sessionId ===
                      session.id;

                    return (
                      <div
                        key={session.id}
                        className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold">
                              {session.subject}
                            </span>

                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
                              {session.time}
                            </span>

                            <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600">
                              {session.duration} min
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {session.topic}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {isRunning ? (
                            <button
                              onClick={
                                stopTimer
                              }
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                              Stop & Save
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                startTimer(
                                  session
                                )
                              }
                              disabled={
                                !!activeTimer
                              }
                              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Start Study
                            </button>
                          )}

                          <button
                            onClick={() =>
                              deleteSession(
                                session.id
                              )
                            }
                            disabled={
                              isRunning
                            }
                            className="rounded-lg border px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* Add Session */}
          <div className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              Add Study Session
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a planned session for your
              selected subject.
            </p>

            {subjects.length === 0 ? (
              <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center">
                <p className="font-medium">
                  No subjects found.
                </p>

                <a
                  href="/setup"
                  className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:underline"
                >
                  Set up your subjects →
                </a>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="text-sm font-medium">
                    Subject
                  </label>

                  <select
                    value={newSubject}
                    onChange={(event) =>
                      setNewSubject(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">
                      Select subject
                    </option>

                    {subjects.map(
                      (subject) => (
                        <option
                          key={subject.id}
                          value={
                            subject.name
                          }
                        >
                          {subject.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Topic
                  </label>

                  <input
                    value={newTopic}
                    onChange={(event) =>
                      setNewTopic(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Chapter 1"
                    className="mt-2 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Time
                  </label>

                  <input
                    type="time"
                    value={newTime}
                    onChange={(event) =>
                      setNewTime(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Planned Duration
                  </label>

                  <select
                    value={newDuration}
                    onChange={(event) =>
                      setNewDuration(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="mt-2 w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value={25}>
                      25 minutes
                    </option>

                    <option value={45}>
                      45 minutes
                    </option>

                    <option value={60}>
                      60 minutes
                    </option>

                    <option value={90}>
                      90 minutes
                    </option>

                    <option value={120}>
                      120 minutes
                    </option>
                  </select>
                </div>
              </div>
            )}

            {subjects.length > 0 && (
              <button
                onClick={addSession}
                className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                + Add Session
              </button>
            )}
          </div>

          {/* How tracking works */}
          <div className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              How Study Tracking Works
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-5">
                <div className="text-2xl">
                  1️⃣
                </div>

                <h3 className="mt-3 font-semibold">
                  Plan
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add the subject, topic and planned
                  study duration.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <div className="text-2xl">
                  2️⃣
                </div>

                <h3 className="mt-3 font-semibold">
                  Study
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Press Start Study when you actually
                  begin studying.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <div className="text-2xl">
                  3️⃣
                </div>

                <h3 className="mt-3 font-semibold">
                  Track
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Press Stop & Save. Exact seconds are
                  recorded for your Progress page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}