
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Subject = {
  id: string;
  name: string;
  code: string;
  selected: boolean;
  progress?: number;
  color?: string;
};

type Task = {
  id: number;
  title: string;
  subject: string;
  done: boolean;
};

const colors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
];

export default function Home() {
  const router = useRouter();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Load selected subjects from Study Preferences / Setup
    const savedSubjects = localStorage.getItem("studyplanner-subjects");

    if (!savedSubjects) {
      return;
    }

    try {
      const parsedSubjects: Subject[] = JSON.parse(savedSubjects);

      const selectedSubjects = parsedSubjects
        .filter((subject) => subject.selected !== false)
        .map((subject, index) => ({
          ...subject,
          progress: subject.progress ?? 0,
          color: colors[index % colors.length],
        }));

      setSubjects(selectedSubjects);

      // Load existing tasks
      const savedTasks = localStorage.getItem("studyplanner-tasks");

      if (savedTasks) {
        try {
          setTasks(JSON.parse(savedTasks));
        } catch {
          console.error("Unable to load saved tasks.");
        }
      } else {
        // Create starter tasks from selected subjects
        const starterTasks: Task[] = selectedSubjects
          .slice(0, 4)
          .map((subject, index) => ({
            id: Date.now() + index,
            title: `Start studying ${subject.name}`,
            subject: subject.name,
            done: false,
          }));

        setTasks(starterTasks);

        localStorage.setItem(
          "studyplanner-tasks",
          JSON.stringify(starterTasks)
        );
      }
    } catch (error) {
      console.error(
        "Unable to load study planner data:",
        error
      );
    }
  }, []);

  const completedTasks = tasks.filter((task) => task.done).length;

  const toggleTask = (id: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, done: !task.done }
        : task
    );

    setTasks(updatedTasks);

    localStorage.setItem(
      "studyplanner-tasks",
      JSON.stringify(updatedTasks)
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("studyplanner-authenticated");
    localStorage.removeItem("studyplanner-user-email");

    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-slate-950 p-6 text-white lg:block">
        <div className="mb-10">
          <h1 className="text-2xl font-bold">
            StudyPlanner
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Smart Study Companion
          </p>
        </div>

        <nav className="space-y-2">
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-left"
          >
            <span>🏠</span>
            Dashboard
          </Link>

          <Link
            href="/subjects"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <span>📚</span>
            Subjects
          </Link>

          <Link
            href="/tasks"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <span>✅</span>
            Tasks
          </Link>

          <Link
            href="/schedule"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <span>📅</span>
            Schedule
          </Link>

          <Link
            href="/planner"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <span>🧠</span>
            Smart Planner
          </Link>

          <Link
            href="/progress"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <span>📊</span>
            Progress
          </Link>

          <Link
            href="/ai-assistant"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <span>🤖</span>
            AI Assistant
          </Link>
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <div className="rounded-2xl bg-slate-800 p-4">
            <p className="text-sm font-semibold">
              Need help?
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Ask your AI study assistant.
            </p>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <section className="lg:ml-64">
        {/* Header */}
        <header className="border-b bg-white px-6 py-5 lg:px-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Monday, October 5, 2026
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Good to See you here! 👋
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:block"
              >
                Logout
              </button>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                J
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          {/* Welcome */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-7 text-white shadow-lg">
            <p className="text-sm font-medium text-blue-100">
              YOUR STUDY OVERVIEW
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              Stay focused. Keep learning.
            </h3>

            <p className="mt-2 max-w-xl text-blue-100">
              Manage your selected subjects, tasks and
              study sessions from one place. Let your AI
              assistant help you study smarter.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/ai-assistant")
              }
              className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              🤖 Ask AI Assistant
            </button>
          </div>

          {/* Stats */}
          <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "📚",
                `${subjects.length}`,
                "Active Subjects",
              ],
              [
                "✅",
                `${completedTasks}/${tasks.length}`,
                "Tasks Completed",
              ],
              [
                "⏱️",
                "2.5h",
                "Study Time Today",
              ],
              [
                "🔥",
                "7 Days",
                "Current Streak",
              ],
            ].map(([icon, value, label]) => (
              <div
                key={label}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="text-2xl">
                  {icon}
                </div>

                <p className="mt-3 text-2xl font-bold">
                  {value}
                </p>

                <p className="text-sm text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-7 xl:grid-cols-2">
            {/* Subjects */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  Your Subjects
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/subjects")
                  }
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View all
                </button>
              </div>

              <div className="mt-6 space-y-5">
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <div key={subject.id}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-medium">
                          {subject.name}
                        </span>

                        <span className="text-slate-500">
                          {subject.progress ?? 0}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            subject.color ??
                            "bg-blue-500"
                          }`}
                          style={{
                            width: `${
                              subject.progress ?? 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-slate-50 p-6 text-center">
                    <p className="font-semibold text-slate-700">
                      No subjects selected yet.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        router.push("/setup")
                      }
                      className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Select Subjects
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tasks */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  Today&apos;s Tasks
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/tasks")
                  }
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  + Add Task
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() =>
                        toggleTask(task.id)
                      }
                      className="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition hover:bg-slate-50"
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                          task.done
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {task.done ? "✓" : ""}
                      </span>

                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            task.done
                              ? "text-slate-400 line-through"
                              : "text-slate-800"
                          }`}
                        >
                          {task.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {task.subject}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-xl bg-slate-50 p-6 text-center">
                    <p className="font-semibold text-slate-700">
                      No tasks yet.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        router.push("/tasks")
                      }
                      className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Create Task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Section */}
          <div className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    🤖
                  </span>

                  <h3 className="text-lg font-bold">
                    AI Study Assistant
                  </h3>
                </div>

                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Get personalized study plans,
                  explanations and recommendations based
                  on your selected subjects and progress.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/ai-assistant")
                }
                className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Open AI Assistant →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
