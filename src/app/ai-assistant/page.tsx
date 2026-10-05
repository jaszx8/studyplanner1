"use client";

import { useEffect, useState } from "react";
import CompactSidebar from "../../components/CompactSidebar";

type Subject = {
  id: string;
  name: string;
  code: string;
  selected?: boolean;
  progress?: number;
};

type Task = {
  id: string;
  title: string;
  subject?: string;
  completed?: boolean;
};

type ActivityRecord = {
  date: string;
  seconds?: number;
  minutes?: number;
};

type Profile = {
  branch?: string;
  year?: string;
  semester?: string;
  name?: string;
  studyHours?: string;
  studyTime?: string;
  goals?: string[];
};

export default function AIAssistant() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activity, setActivity] = useState<ActivityRecord[]>([]);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = () => {
    try {
      const savedProfile = localStorage.getItem("studyplanner-profile");
      const savedSubjects = localStorage.getItem("studyplanner-subjects");
      const savedTasks = localStorage.getItem("studyplanner-tasks");
      const savedActivity = localStorage.getItem("studyplanner-activity");

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      if (savedSubjects) {
        const parsedSubjects = JSON.parse(savedSubjects);

        setSubjects(
          parsedSubjects.filter(
            (subject: Subject) => subject.selected !== false
          )
        );
      }

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }

      if (savedActivity) {
        setActivity(JSON.parse(savedActivity));
      }
    } catch {
      console.log("Unable to load student data.");
    }
  };

  const getTotalStudySeconds = () => {
    return activity.reduce((total, record) => {
      if (typeof record.seconds === "number") {
        return total + record.seconds;
      }

      if (typeof record.minutes === "number") {
        return total + record.minutes * 60;
      }

      return total;
    }, 0);
  };

  const getTodayStudySeconds = () => {
    const today = new Date();

    const todayKey = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    return activity.reduce((total, record) => {
      if (record.date !== todayKey) {
        return total;
      }

      if (typeof record.seconds === "number") {
        return total + record.seconds;
      }

      if (typeof record.minutes === "number") {
        return total + record.minutes * 60;
      }

      return total;
    }, 0);
  };

  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };

  const buildStudentContext = () => {
    const completedTasks = tasks.filter(
      (task) => task.completed
    ).length;

    const pendingTasks = tasks.filter(
      (task) => !task.completed
    );

    const averageProgress =
      subjects.length > 0
        ? Math.round(
            subjects.reduce(
              (total, subject) => total + (subject.progress || 0),
              0
            ) / subjects.length
          )
        : 0;

    return {
      student: {
        name: profile?.name || "Student",
        branch: profile?.branch || "Not specified",
        year: profile?.year || "Not specified",
        semester: profile?.semester || "Not specified",
        dailyStudyHours: profile?.studyHours || "Not specified",
        preferredStudyTime: profile?.studyTime || "Not specified",
        goals: profile?.goals || [],
      },

      subjects: subjects.map((subject) => ({
        name: subject.name,
        code: subject.code,
        progress: subject.progress || 0,
      })),

      tasks: {
        total: tasks.length,
        completed: completedTasks,
        pending: pendingTasks.map((task) => ({
          title: task.title,
          subject: task.subject || "General",
        })),
      },

      progress: {
        averageSubjectProgress: averageProgress,
        todayStudyTime: formatStudyTime(getTodayStudySeconds()),
        totalStudyTime: formatStudyTime(getTotalStudySeconds()),
      },
    };
  };

  const askAI = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const studentContext = buildStudentContext();

      const mentorPrompt = `
You are StudyPlanner AI, a personal AI study mentor for a college student.

Your job is to give practical, personalized and encouraging academic guidance.

IMPORTANT:
- Use the student's profile, subjects, progress, tasks and study activity below.
- Do not pretend the student has information that is not provided.
- If information is missing, simply say that it is not available.
- Give actionable advice instead of generic motivational statements.
- Keep answers easy to understand.
- For study plans, use the student's available daily study hours.
- Prioritize subjects with lower progress when appropriate.
- Consider pending tasks.
- If the student asks what to study today, create a realistic plan using their subjects, progress and pending tasks.
- If the student asks about a technical topic, explain it simply first and then give an example.
- Do not overwhelm the student with unnecessary information.

STUDENT DATA:
${JSON.stringify(studentContext, null, 2)}

STUDENT'S QUESTION:
${message}
`;

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: mentorPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setReply(data.error || "Something went wrong.");
        return;
      }

      setReply(data.reply);
    } catch {
      setReply("Unable to connect to AI Mentor.");
    } finally {
      setLoading(false);
    }
  };

  const usePrompt = (prompt: string) => {
    setMessage(prompt);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const averageProgress =
    subjects.length > 0
      ? Math.round(
          subjects.reduce(
            (total, subject) => total + (subject.progress || 0),
            0
          ) / subjects.length
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <CompactSidebar />

      <section className="lg:ml-20">
        {/* Header */}
        <header className="border-b bg-white px-6 py-6 lg:px-10">
          <div className="max-w-6xl">
            <p className="text-sm font-medium text-indigo-600">
              StudyPlanner AI
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Your AI Study Mentor 🤖
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Get personalized study guidance based on your
              subjects, progress, tasks and study habits.
            </p>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <div className="mx-auto max-w-6xl">
            {/* Student Context */}
            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Current Semester
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {profile?.semester || "Not set"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {profile?.branch || "Complete setup"}
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Active Subjects
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {subjects.length}
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Average Progress
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {averageProgress}%
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Tasks Completed
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {completedTasks}/{tasks.length}
                </p>
              </div>
            </div>

            {/* Main AI Card */}
            <div className="rounded-3xl border bg-white p-6 shadow-sm lg:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                  🤖
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Ask your AI Mentor
                  </h2>

                  <p className="text-sm text-slate-500">
                    I know your current study profile and can guide
                    you accordingly.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                What do you need help with?
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    (e.ctrlKey || e.metaKey)
                  ) {
                    askAI();
                  }
                }}
                placeholder="Example: What should I study today?"
                className="min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
              />

              <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <p className="text-xs text-slate-400">
                  Tip: Press Ctrl + Enter to ask
                </p>

                <button
                  onClick={askAI}
                  disabled={loading || !message.trim()}
                  className="rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Thinking..." : "Ask AI Mentor →"}
                </button>
              </div>
            </div>

            {/* AI Reply */}
            {reply && (
              <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm lg:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-xl">
                    🤖
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      StudyPlanner AI Mentor
                    </h2>

                    <p className="text-xs text-slate-500">
                      Personalized for your study profile
                    </p>
                  </div>
                </div>

                <div className="whitespace-pre-wrap leading-7 text-slate-700">
                  {reply}
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-xl">
                    🤖
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Your AI Mentor is thinking...
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Checking your study profile and preparing
                      personalized guidance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Help */}
            {!reply && !loading && (
              <div className="mt-8">
                <div className="mb-4">
                  <h2 className="text-xl font-bold">
                    What can your AI Mentor do?
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Try one of these personalized requests.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <button
                    onClick={() =>
                      usePrompt(
                        "What should I study today? Make a realistic study plan based on my current subjects, progress and pending tasks."
                      )
                    }
                    className="rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="text-2xl">📅</div>

                    <h3 className="mt-3 font-semibold">
                      What should I study?
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Get today's personalized study plan.
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      usePrompt(
                        "Analyze my current subject progress and tell me which subjects I should prioritize and why."
                      )
                    }
                    className="rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="text-2xl">📊</div>

                    <h3 className="mt-3 font-semibold">
                      Analyze My Progress
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Find weak subjects and priorities.
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      usePrompt(
                        "Create a 7 day study plan using my available daily study hours, current subjects, pending tasks and progress."
                      )
                    }
                    className="rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="text-2xl">📚</div>

                    <h3 className="mt-3 font-semibold">
                      7-Day Study Plan
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Build a personalized weekly plan.
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      usePrompt(
                        "Give me an exam preparation strategy based on my current subjects and progress. Tell me what to revise first."
                      )
                    }
                    className="rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="text-2xl">🎯</div>

                    <h3 className="mt-3 font-semibold">
                      Exam Preparation
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Get a smart revision strategy.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Current Subjects */}
            {subjects.length > 0 && (
              <div className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-lg font-bold">
                    Your Current Subjects
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    These subjects are included in your AI Mentor
                    context.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {subject.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {subject.code}
                          </p>
                        </div>

                        <span className="text-sm font-bold text-indigo-600">
                          {subject.progress || 0}%
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{
                            width: `${Math.min(
                              subject.progress || 0,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}