
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getBranches, getSubjects } from "../../data/subjectCatalog";

type Subject = {
  id: string;
  name: string;
  code: string;
  selected: boolean;
};

const branches = getBranches();

const years = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "Final Year",
];

export default function SetupPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [studyHours, setStudyHours] = useState("2");
  const [studyTime, setStudyTime] = useState("Evening");
  const [goal, setGoal] = useState("Prepare for exams");

  const [customSubject, setCustomSubject] = useState("");

  const semesters = useMemo(() => {
    if (year === "1st Year") {
      return ["Semester 1", "Semester 2"];
    }

    if (year === "2nd Year") {
      return ["Semester 3", "Semester 4"];
    }

    if (year === "3rd Year") {
      return ["Semester 5", "Semester 6"];
    }

    if (year === "Final Year") {
      return ["Semester 7", "Semester 8"];
    }

    return [];
  }, [year]);

  const canContinueStep1 = branch !== "";
  const canContinueStep2 = year !== "";
  const canContinueStep3 = semester !== "";

  const selectedSubjects = subjects.filter(
    (subject) => subject.selected
  );

  /*
   * Load subjects according to:
   * Branch + Semester
   */
  const createSubjects = () => {
    if (!branch || !semester) return;

    const subjectList = getSubjects(branch, semester);

    setSubjects(
      subjectList.map((subject) => ({
        id: subject.id,
        name: subject.name,
        code: subject.code,
        selected: true,
      }))
    );
  };

  const toggleSubject = (id: string) => {
    setSubjects((current) =>
      current.map((subject) =>
        subject.id === id
          ? {
              ...subject,
              selected: !subject.selected,
            }
          : subject
      )
    );
  };

  const addCustomSubject = () => {
    const name = customSubject.trim();

    if (!name) return;

    const newSubject: Subject = {
      id: `custom-${Date.now()}`,
      name,
      code: "CUSTOM",
      selected: true,
    };

    setSubjects((current) => [...current, newSubject]);
    setCustomSubject("");
  };

  const saveProfile = () => {
    if (!branch || !year || !semester || selectedSubjects.length === 0) {
      return;
    }

    const profile = {
      branch,
      year,
      semester,
      subjects: selectedSubjects,
      studyHoursPerDay: Number(studyHours),
      preferredStudyTime: studyTime,
      goal,
      setupCompleted: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "studyplanner-profile",
      JSON.stringify(profile)
    );

    localStorage.setItem(
      "studyplanner-subjects",
      JSON.stringify(selectedSubjects)
    );

    router.push("/planner");
  };

  const goNext = () => {
    if (step === 1 && canContinueStep1) {
      setStep(2);
      return;
    }

    if (step === 2 && canContinueStep2) {
      setStep(3);
      return;
    }

    if (step === 3 && canContinueStep3) {
      createSubjects();
      setStep(4);
      return;
    }

    if (step === 4 && selectedSubjects.length > 0) {
      setStep(5);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold shadow-lg shadow-blue-600/20">
            S
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Tell us about yourself
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Let&apos;s build a Smart Study Plan based on your branch,
            year, semester and study preferences.
          </p>
        </div>

        {/* PROGRESS */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Step {step} of 5
            </span>

            <span className="font-medium text-blue-400">
              {step === 1 && "Choose Branch"}
              {step === 2 && "Choose Year"}
              {step === 3 && "Choose Semester"}
              {step === 4 && "Select Subjects"}
              {step === 5 && "Study Preferences"}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${(step / 5) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-10">

          {/* STEP 1 */}
          {step === 1 && (
            <section>
              <div className="mb-7">
                <p className="mb-2 text-sm font-medium text-blue-400">
                  STEP 1
                </p>

                <h2 className="text-2xl font-bold">
                  What is your engineering branch?
                </h2>

                <p className="mt-2 text-slate-400">
                  Choose your branch so we can recommend relevant
                  semester subjects.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {branches.map((item) => {
                  const selected = branch === item;
                  const isIT =
                    item === "Information Technology";

                  return (
                    <button
                      key={item}
                      onClick={() => {
                        setBranch(item);
                        setSemester("");
                        setSubjects([]);
                      }}
                      className={`rounded-2xl border p-5 text-left transition ${
                        selected
                          ? "border-blue-500 bg-blue-600/10 ring-2 ring-blue-500/20"
                          : "border-slate-700 bg-slate-950 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">
                            {item}
                          </h3>

                          {isIT && (
                            <p className="mt-2 text-xs font-medium text-blue-400">
                              ⭐ Featured for IT Engineering
                            </p>
                          )}
                        </div>

                        {selected && (
                          <span className="text-xl text-blue-400">
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <section>
              <div className="mb-7">
                <p className="mb-2 text-sm font-medium text-blue-400">
                  STEP 2
                </p>

                <h2 className="text-2xl font-bold">
                  Which year are you in?
                </h2>

                <p className="mt-2 text-slate-400">
                  Your year helps us determine the correct semester.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {years.map((item) => {
                  const selected = year === item;

                  return (
                    <button
                      key={item}
                      onClick={() => {
                        setYear(item);
                        setSemester("");
                        setSubjects([]);
                      }}
                      className={`rounded-2xl border p-6 text-left transition ${
                        selected
                          ? "border-blue-500 bg-blue-600/10 ring-2 ring-blue-500/20"
                          : "border-slate-700 bg-slate-950 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                          {item}
                        </span>

                        {selected && (
                          <span className="text-xl text-blue-400">
                            ✓
                          </span>
                        )}
                      </div>

                      {item === "Final Year" && (
                        <p className="mt-2 text-sm text-blue-400">
                          🎓 Project &amp; career preparation
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <section>
              <div className="mb-7">
                <p className="mb-2 text-sm font-medium text-blue-400">
                  STEP 3
                </p>

                <h2 className="text-2xl font-bold">
                  Select your semester
                </h2>

                <p className="mt-2 text-slate-400">
                  Choose the semester you are currently studying.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {semesters.map((item) => {
                  const selected = semester === item;

                  return (
                    <button
                      key={item}
                      onClick={() => {
                        setSemester(item);
                        setSubjects([]);
                      }}
                      className={`rounded-2xl border p-6 text-left transition ${
                        selected
                          ? "border-blue-500 bg-blue-600/10 ring-2 ring-blue-500/20"
                          : "border-slate-700 bg-slate-950 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                          {item}
                        </span>

                        {selected && (
                          <span className="text-xl text-blue-400">
                            ✓
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {branch} • {year}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <section>
              <div className="mb-7">
                <p className="mb-2 text-sm font-medium text-blue-400">
                  STEP 4
                </p>

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Select your subjects
                    </h2>

                    <p className="mt-2 text-slate-400">
                      Recommended for{" "}
                      <span className="font-medium text-white">
                        {branch}
                      </span>{" "}
                      •{" "}
                      <span className="font-medium text-white">
                        {semester}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-600/10 px-4 py-2 text-sm text-blue-400">
                    {selectedSubjects.length} selected
                  </div>
                </div>
              </div>

              {subjects.length === 0 ? (
                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 text-center">
                  <p className="font-semibold text-yellow-400">
                    No subjects found
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    You can add your subjects manually below.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        subject.selected
                          ? "border-blue-500 bg-blue-600/10"
                          : "border-slate-700 bg-slate-950 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">
                            {subject.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {subject.code}
                          </p>
                        </div>

                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                            subject.selected
                              ? "border-blue-500 bg-blue-600 text-white"
                              : "border-slate-600 text-slate-500"
                          }`}
                        >
                          {subject.selected ? "✓" : ""}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* CUSTOM SUBJECT */}
              <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-5">
                <p className="mb-3 font-semibold">
                  + Add Custom Subject
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={customSubject}
                    onChange={(e) =>
                      setCustomSubject(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addCustomSubject();
                      }
                    }}
                    placeholder="Enter subject name"
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <button
                    onClick={addCustomSubject}
                    className="rounded-xl bg-slate-800 px-6 py-3 font-semibold hover:bg-slate-700"
                  >
                    Add Subject
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <section>
              <div className="mb-7">
                <p className="mb-2 text-sm font-medium text-blue-400">
                  STEP 5
                </p>

                <h2 className="text-2xl font-bold">
                  Set your study preferences
                </h2>

                <p className="mt-2 text-slate-400">
                  This helps SmartPlanner create a realistic study routine.
                </p>
              </div>

              <div className="space-y-6">

                {/* HOURS */}
                <div>
                  <label className="mb-3 block font-semibold">
                    How many hours can you study daily?
                  </label>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {["1", "2", "3", "4"].map((hours) => (
                      <button
                        key={hours}
                        onClick={() => setStudyHours(hours)}
                        className={`rounded-xl border px-4 py-4 font-semibold transition ${
                          studyHours === hours
                            ? "border-blue-500 bg-blue-600/10 text-blue-400"
                            : "border-slate-700 bg-slate-950"
                        }`}
                      >
                        {hours}{" "}
                        {hours === "1" ? "hour" : "hours"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* STUDY TIME */}
                <div>
                  <label className="mb-3 block font-semibold">
                    Preferred study time
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {["Morning", "Afternoon", "Evening"].map(
                      (time) => (
                        <button
                          key={time}
                          onClick={() => setStudyTime(time)}
                          className={`rounded-xl border px-3 py-4 font-semibold transition ${
                            studyTime === time
                              ? "border-blue-500 bg-blue-600/10 text-blue-400"
                              : "border-slate-700 bg-slate-950"
                          }`}
                        >
                          {time}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* GOAL */}
                <div>
                  <label className="mb-3 block font-semibold">
                    What is your main goal?
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      "Prepare for exams",
                      "Improve my grades",
                      "Build strong concepts",
                      "Prepare for placements",
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() => setGoal(item)}
                        className={`rounded-xl border p-4 text-left font-medium transition ${
                          goal === item
                            ? "border-blue-500 bg-blue-600/10 text-blue-400"
                            : "border-slate-700 bg-slate-950"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SUMMARY */}
                <div className="rounded-2xl border border-blue-500/20 bg-blue-600/5 p-5">
                  <p className="mb-4 text-sm font-medium text-blue-400">
                    YOUR SMART PLANNER PROFILE
                  </p>

                  <div className="grid gap-3 text-sm sm:grid-cols-2">

                    <div>
                      <span className="text-slate-500">
                        Branch
                      </span>

                      <p className="font-semibold">
                        {branch}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500">
                        Year
                      </span>

                      <p className="font-semibold">
                        {year}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500">
                        Semester
                      </span>

                      <p className="font-semibold">
                        {semester}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500">
                        Subjects
                      </span>

                      <p className="font-semibold">
                        {selectedSubjects.length} subjects
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500">
                        Study Time
                      </span>

                      <p className="font-semibold">
                        {studyHours} hours/day • {studyTime}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500">
                        Goal
                      </span>

                      <p className="font-semibold">
                        {goal}
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </section>
          )}

          {/* NAVIGATION */}
          <div className="mt-10 flex items-center justify-between border-t border-slate-800 pt-6">

            <button
              onClick={goBack}
              disabled={step === 1}
              className="rounded-xl px-5 py-3 font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:invisible"
            >
              ← Back
            </button>

            {step < 5 ? (
              <button
                onClick={goNext}
                disabled={
                  (step === 1 && !canContinueStep1) ||
                  (step === 2 && !canContinueStep2) ||
                  (step === 3 && !canContinueStep3) ||
                  (step === 4 && selectedSubjects.length === 0)
                }
                className="rounded-xl bg-blue-600 px-7 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={saveProfile}
                disabled={selectedSubjects.length === 0}
                className="rounded-xl bg-blue-600 px-7 py-3 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                🚀 Build My Smart Plan
              </button>
            )}

          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          StudyPlanner AI • Your Personal AI Study Guide
        </p>
      </div>
    </main>
  );
}
