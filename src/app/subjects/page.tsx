"use client";

import { useEffect, useState } from "react";
import CompactSidebar from "../../components/CompactSidebar";

type Subject = {
  id: string | number;
  name: string;
  code: string;
  category?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  progress?: number;
  selected?: boolean;
};

type Profile = {
  branch?: string;
  year?: string;
  semester?: string;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [profile, setProfile] = useState<Profile>({});
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("Other");
  const [difficulty, setDifficulty] =
    useState<Subject["difficulty"]>("Medium");

  // Load selected subjects from Setup
  useEffect(() => {
    const savedSubjects = localStorage.getItem(
      "studyplanner-subjects"
    );

    const savedProfile = localStorage.getItem(
      "studyplanner-profile"
    );

    if (savedSubjects) {
      try {
        const parsedSubjects: Subject[] =
          JSON.parse(savedSubjects);

        const selectedSubjects = parsedSubjects
          .filter((subject) => subject.selected !== false)
          .map((subject) => ({
            ...subject,
            progress: subject.progress ?? 0,
            difficulty: subject.difficulty ?? "Medium",
            category: subject.category ?? "Academic",
          }));

        setSubjects(selectedSubjects);
      } catch {
        setSubjects([]);
      }
    }

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch {
        setProfile({});
      }
    }
  }, []);

  // Save subjects whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "studyplanner-subjects",
        JSON.stringify(subjects)
      );
    }
  }, [subjects]);

  const addSubject = () => {
    if (!name.trim()) {
      alert("Please enter subject name.");
      return;
    }

    const newSubject: Subject = {
      id: Date.now(),
      name: name.trim(),
      code: code.trim().toUpperCase() || "CUSTOM",
      category,
      difficulty: difficulty ?? "Medium",
      progress: 0,
      selected: true,
    };

    setSubjects((current) => [newSubject, ...current]);

    setName("");
    setCode("");
    setCategory("Other");
    setDifficulty("Medium");
    setShowForm(false);
  };

  const deleteSubject = (id: string | number) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this subject?"
    );

    if (!confirmed) return;

    setSubjects((current) =>
      current.filter((subject) => subject.id !== id)
    );
  };

  const updateProgress = (
    id: string | number,
    progress: number
  ) => {
    setSubjects((current) =>
      current.map((subject) =>
        subject.id === id
          ? { ...subject, progress }
          : subject
      )
    );
  };

  const filteredSubjects = subjects.filter((subject) =>
    `${subject.name} ${subject.code} ${subject.category ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const difficultyStyle = (
    level: Subject["difficulty"]
  ) => {
    if (level === "Hard") {
      return "bg-red-100 text-red-700";
    }

    if (level === "Medium") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  const averageProgress =
    subjects.length > 0
      ? Math.round(
          subjects.reduce(
            (total, subject) =>
              total + (subject.progress ?? 0),
            0
          ) / subjects.length
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <CompactSidebar />

      <div className="lg:ml-20">
        {/* Header */}
        <header className="border-b bg-white px-6 py-6 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                StudyPlanner AI
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                My Subjects
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Your selected subjects, progress and learning
                journey.
              </p>

              {profile.branch && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {profile.branch}
                  </span>

                  {profile.year && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {profile.year}
                    </span>
                  )}

                  {profile.semester && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Semester {profile.semester}
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              {showForm ? "Close" : "+ Add Subject"}
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          {/* No Subjects */}
          {subjects.length === 0 && (
            <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">📚</div>

              <h2 className="mt-5 text-2xl font-bold">
                No subjects selected yet
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
                Complete your student setup and select the subjects
                you want StudyPlanner AI to guide you with.
              </p>

              <a
                href="/setup"
                className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Go to Setup
              </a>
            </section>
          )}

          {subjects.length > 0 && (
            <>
              {/* Overview */}
              <section className="grid gap-5 sm:grid-cols-3">
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">
                    Selected Subjects
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {subjects.length}
                  </p>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">
                    Average Progress
                  </p>

                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    {averageProgress}%
                  </p>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">
                    Learning Status
                  </p>

                  <p className="mt-2 text-lg font-bold">
                    {averageProgress === 0
                      ? "Ready to Start"
                      : averageProgress < 50
                      ? "In Progress"
                      : averageProgress < 80
                      ? "Doing Great"
                      : "Almost There"}
                  </p>
                </div>
              </section>

              {/* Add Subject Form */}
              {showForm && (
                <section className="mt-8 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold">
                      Add a New Subject
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Add any additional subject you are currently
                      studying.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    {/* Subject Name */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Subject Name
                      </label>

                      <input
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        placeholder="e.g. Artificial Intelligence"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Subject Code */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Subject Code
                      </label>

                      <input
                        value={code}
                        onChange={(e) =>
                          setCode(e.target.value)
                        }
                        placeholder="e.g. AI"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 uppercase outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Category
                      </label>

                      <select
                        value={category}
                        onChange={(e) =>
                          setCategory(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
                      >
                        <option>Academic</option>
                        <option>Engineering</option>
                        <option>Development</option>
                        <option>Programming</option>
                        <option>Management</option>
                        <option>Other</option>
                      </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Difficulty
                      </label>

                      <select
                        value={difficulty}
                        onChange={(e) =>
                          setDifficulty(
                            e.target.value as Subject["difficulty"]
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
                      >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={addSubject}
                    className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Add Subject
                  </button>
                </section>
              )}

              {/* Selected Subjects */}
              <section className="mt-10">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-blue-100 px-2 py-1 text-sm">
                        📚
                      </span>

                      <h2 className="text-2xl font-bold">
                        Your Selected Subjects
                      </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      These subjects were selected during your
                      student setup.
                    </p>
                  </div>

                  <div className="w-full lg:w-80">
                    <input
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search subjects..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Subject Cards */}
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredSubjects.map((subject) => {
                    const progress = subject.progress ?? 0;

                    return (
                      <div
                        key={subject.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        {/* Top */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                              {subject.code.slice(0, 2)}
                            </div>

                            <div>
                              <h3 className="font-bold">
                                {subject.name}
                              </h3>

                              <p className="text-xs text-slate-400">
                                {subject.code}
                                {subject.category
                                  ? ` • ${subject.category}`
                                  : ""}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              deleteSubject(subject.id)
                            }
                            className="text-sm text-slate-400 hover:text-red-600"
                            title="Remove subject"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Progress */}
                        <div className="mt-6">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              Study Progress
                            </span>

                            <span className="text-sm font-bold">
                              {progress}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-blue-600 transition-all"
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Difficulty */}
                        <div className="mt-5">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyStyle(
                              subject.difficulty
                            )}`}
                          >
                            {subject.difficulty ?? "Medium"}
                          </span>
                        </div>

                        {/* Slider */}
                        <div className="mt-5">
                          <label className="mb-2 block text-xs text-slate-500">
                            Update Progress
                          </label>

                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={(e) =>
                              updateProgress(
                                subject.id,
                                Number(e.target.value)
                              )
                            }
                            className="w-full accent-blue-600"
                          />
                        </div>

                        {/* Progress Message */}
                        <p className="mt-3 text-xs text-slate-500">
                          {progress === 0
                            ? "Start learning this subject."
                            : progress < 30
                            ? "Getting started."
                            : progress < 60
                            ? "Good progress. Keep going."
                            : progress < 85
                            ? "You're doing great."
                            : "Almost mastered!"}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {filteredSubjects.length === 0 && (
                  <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <div className="text-4xl">🔎</div>

                    <h3 className="mt-3 font-bold">
                      No subjects found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Try another search or add a new subject.
                    </p>
                  </div>
                )}
              </section>

              {/* AI Guidance */}
              <section className="mt-12 rounded-3xl bg-slate-900 p-7 text-white">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-400">
                      AI STUDY GUIDE
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      Not sure what to study next?
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm text-slate-400">
                      StudyPlanner AI can use your selected subjects,
                      progress and tasks to guide you toward your next
                      study goal.
                    </p>
                  </div>

                  <a
                    href="/ai-assistant"
                    className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold hover:bg-blue-700"
                  >
                    Ask AI Mentor →
                  </a>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}