"use client";

import { useEffect, useState } from "react";
import CompactSidebar from "../../components/CompactSidebar";

type Task = {
  id: number;
  title: string;
  subject: string;
  priority: "Low" | "Medium" | "High";
  done: boolean;
};

type SelectedSubject = {
  id: string;
  name: string;
  code: string;
  selected: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] =
    useState<Task["priority"]>("Medium");

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] =
    useState<"All" | "Pending" | "Completed">("All");

  // Load selected subjects and tasks
  useEffect(() => {
    const savedSubjects = localStorage.getItem("studyplanner-subjects");
    const savedTasks = localStorage.getItem("studyplanner-tasks");

    if (savedSubjects) {
      try {
        const parsedSubjects: SelectedSubject[] =
          JSON.parse(savedSubjects);

        const selectedSubjects = parsedSubjects
          .filter((item) => item.selected !== false)
          .map((item) => item.name);

        setSubjects(selectedSubjects);

        if (selectedSubjects.length > 0) {
          setSubject(selectedSubjects[0]);
        }
      } catch {
        setSubjects([]);
      }
    }

    if (savedTasks) {
      try {
        const parsedTasks: Task[] = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch {
        setTasks([]);
      }
    }
  }, []);

  // Save tasks whenever tasks change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "studyplanner-tasks",
        JSON.stringify(tasks)
      );
    }
  }, [tasks]);

  const completedTasks = tasks.filter((task) => task.done).length;
  const pendingTasks = tasks.filter((task) => !task.done).length;

  const addTask = () => {
    if (!title.trim() || !subject) return;

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      subject,
      priority,
      done: false,
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);

    setTitle("");
    setPriority("Medium");

    if (subjects.length > 0) {
      setSubject(subjects[0]);
    }

    setShowForm(false);
  };

  const toggleTask = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, done: !task.done }
          : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.done;
    if (filter === "Pending") return !task.done;

    return true;
  });

  const priorityStyle = (priority: Task["priority"]) => {
    if (priority === "High") {
      return "bg-red-100 text-red-700";
    }

    if (priority === "Medium") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Compact Sidebar */}
      <CompactSidebar />

      {/* Main Content */}
      <section className="lg:ml-20">
        {/* Header */}
        <header className="border-b bg-white px-6 py-5 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                StudyPlanner
              </p>

              <h1 className="mt-1 text-2xl font-bold">
                Your Tasks
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your daily study work and assignments.
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              disabled={subjects.length === 0}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {showForm ? "Close" : "+ Add Task"}
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          {/* No Subjects */}
          {subjects.length === 0 && (
            <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
              <div className="text-4xl">📚</div>

              <h2 className="mt-4 text-xl font-bold">
                No subjects selected
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Complete your student setup first and select your
                subjects.
              </p>

              <a
                href="/setup"
                className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Go to Setup
              </a>
            </div>
          )}

          {/* Stats */}
          {subjects.length > 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">
                    Total Tasks
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {tasks.length}
                  </p>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">
                    Pending
                  </p>

                  <p className="mt-2 text-3xl font-bold text-orange-500">
                    {pendingTasks}
                  </p>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">
                    Completed
                  </p>

                  <p className="mt-2 text-3xl font-bold text-green-600">
                    {completedTasks}
                  </p>
                </div>
              </div>

              {/* Selected Subjects */}
              <div className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
                <div>
                  <h2 className="text-lg font-bold">
                    Your Subjects
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tasks can be created only for your selected
                    subjects.
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {subjects.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add Task */}
              {showForm && (
                <div className="mt-7 rounded-2xl border bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold">
                    Add New Task
                  </h2>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {/* Title */}
                    <div className="md:col-span-3">
                      <label className="mb-2 block text-sm font-medium">
                        Task Title
                      </label>

                      <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                          setTitle(e.target.value)
                        }
                        placeholder="e.g. Complete DBMS assignment"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Subject
                      </label>

                      <select
                        value={subject}
                        onChange={(e) =>
                          setSubject(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                      >
                        {subjects.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Priority
                      </label>

                      <select
                        value={priority}
                        onChange={(e) =>
                          setPriority(
                            e.target.value as Task["priority"]
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>

                    {/* Add Button */}
                    <div className="flex items-end">
                      <button
                        onClick={addTask}
                        className="w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800"
                      >
                        Add Task
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="mt-7 flex flex-wrap gap-2">
                {(
                  ["All", "Pending", "Completed"] as const
                ).map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                      filter === item
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Task List */}
              <div className="mt-5 space-y-3">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm"
                  >
                    {/* Complete */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                        task.done
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {task.done ? "✓" : ""}
                    </button>

                    {/* Task Info */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`font-semibold ${
                          task.done
                            ? "text-slate-400 line-through"
                            : "text-slate-800"
                        }`}
                      >
                        {task.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {task.subject}
                      </p>
                    </div>

                    {/* Priority */}
                    <span
                      className={`hidden rounded-lg px-3 py-1 text-xs font-semibold sm:block ${priorityStyle(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {filteredTasks.length === 0 && (
                  <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
                    <div className="text-4xl">✓</div>

                    <h2 className="mt-4 text-xl font-bold">
                      No tasks found
                    </h2>

                    <p className="mt-2 text-slate-500">
                      Try another filter or add a new task.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}