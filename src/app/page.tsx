"use client";

import { useState } from "react";

const subjects = [
  { name: "Data Structures", progress: 78, color: "bg-blue-500" },
  { name: "Database Management", progress: 65, color: "bg-purple-500" },
  { name: "Web Development", progress: 82, color: "bg-green-500" },
  { name: "Software Engineering", progress: 54, color: "bg-orange-500" },
];

const initialTasks = [
  { id: 1, title: "Complete DSA assignment", subject: "Data Structures", done: true },
  { id: 2, title: "Study SQL Joins", subject: "Database Management", done: false },
  { id: 3, title: "Build React components", subject: "Web Development", done: false },
  { id: 4, title: "Revise Agile methodology", subject: "Software Engineering", done: false },
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);

  const completedTasks = tasks.filter((task) => task.done).length;

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-slate-950 p-6 text-white lg:block">
        <div className="mb-10">
          <h1 className="text-2xl font-bold">StudyPlanner</h1>
          <p className="mt-1 text-sm text-slate-400">Smart Study Companion</p>
        </div>

        <nav className="space-y-2">
          {[
            ["🏠", "Dashboard"],
            ["📚", "Subjects"],
            ["✅", "Tasks"],
            ["📅", "Schedule"],
            ["📊", "Progress"],
            ["🤖", "AI Assistant"],
          ].map(([icon, name], index) => (
            <button
              key={name}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${
                index === 0
                  ? "bg-blue-600"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-slate-800 p-4">
          <p className="text-sm font-semibold">Need help?</p>
          <p className="mt-1 text-xs text-slate-400">
            Ask your AI study assistant.
          </p>
        </div>
      </aside>

      {/* Main */}
      <section className="lg:ml-64">
        {/* Header */}
        <header className="border-b bg-white px-6 py-5 lg:px-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Monday, October 5, 2026</p>
              <h2 className="mt-1 text-2xl font-bold">
                Good afternoon, Jash 👋
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              J
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
              Manage your subjects, tasks and study sessions from one place.
              Let your AI assistant help you study smarter.
            </p>

            <button className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50">
              🤖 Ask AI Assistant
            </button>
          </div>

          {/* Stats */}
          <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["📚", "4", "Active Subjects"],
              ["✅", `${completedTasks}/${tasks.length}`, "Tasks Completed"],
              ["⏱️", "2.5h", "Study Time Today"],
              ["🔥", "7 Days", "Current Streak"],
            ].map(([icon, value, label]) => (
              <div
                key={label}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="text-2xl">{icon}</div>
                <p className="mt-3 text-2xl font-bold">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-7 xl:grid-cols-2">
            {/* Subjects */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Your Subjects</h3>
                <button className="text-sm font-semibold text-blue-600">
                  View all
                </button>
              </div>

              <div className="mt-6 space-y-5">
                {subjects.map((subject) => (
                  <div key={subject.name}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium">{subject.name}</span>
                      <span className="text-slate-500">
                        {subject.progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${subject.color}`}
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Today's Tasks</h3>
                <button className="text-sm font-semibold text-blue-600">
                  + Add Task
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex w-full items-center gap-3 rounded-xl border p-4 text-left hover:bg-slate-50"
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
                ))}
              </div>
            </div>
          </div>

          {/* AI Section */}
          <div className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <h3 className="text-lg font-bold">AI Study Assistant</h3>
                </div>

                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Get personalized study plans, explanations and
                  recommendations based on your subjects and progress.
                </p>
              </div>

              <button className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800">
                Open AI Assistant →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}