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

type Profile = {
  name?: string;
  branch?: string;
  year?: string;
  semester?: string;
  studyHours?: string;
  studyTime?: string;
  goals?: string[];
};

type PlanItem = {
  time: string;
  subject: string;
  topic: string;
  duration: string;
  reason: string;
};

export default function SmartPlanner() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [planText, setPlanText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = () => {
    try {
      const savedProfile = localStorage.getItem(
        "studyplanner-profile"
      );

      const savedSubjects = localStorage.getItem(
        "studyplanner-subjects"
      );

      const savedTasks = localStorage.getItem(
        "studyplanner-tasks"
      );

      const savedPlan = localStorage.getItem(
        "studyplanner-smart-plan"
      );

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

      if (savedPlan) {
        const parsedPlan = JSON.parse(savedPlan);

        setPlan(parsedPlan.plan || []);
        setPlanText(parsedPlan.text || "");
      }
    } catch {
      console.log("Unable to load planner data.");
    }
  };

  const getAverageProgress = () => {
    if (subjects.length === 0) return 0;

    return Math.round(
      subjects.reduce(
        (total, subject) => total + (subject.progress || 0),
        0
      ) / subjects.length
    );
  };

  const generatePlan = async () => {
    if (subjects.length === 0) {
      setPlanText(
        "Please complete your StudyPlanner setup and select your subjects first."
      );
      return;
    }

    setLoading(true);
    setPlan([]);
    setPlanText("");
    setSaved(false);

    const pendingTasks = tasks.filter(
      (task) => !task.completed
    );

    const studentData = {
      profile: {
        name: profile?.name || "Student",
        branch: profile?.branch || "Not specified",
        year: profile?.year || "Not specified",
        semester: profile?.semester || "Not specified",
        dailyStudyHours: profile?.studyHours || "2",
        preferredStudyTime:
          profile?.studyTime || "Any time",
        goals: profile?.goals || [],
      },

      subjects: subjects.map((subject) => ({
        name: subject.name,
        code: subject.code,
        progress: subject.progress || 0,
      })),

      pendingTasks: pendingTasks.map((task) => ({
        title: task.title,
        subject: task.subject || "General",
      })),

      averageProgress: getAverageProgress(),
    };

    const prompt = `
You are the Smart Planner engine inside StudyPlanner AI.

Create a realistic DAILY study plan for this student.

STUDENT DATA:
${JSON.stringify(studentData, null, 2)}

PLANNING RULES:
1. Use the student's available daily study hours.
2. Prioritize subjects with lower progress.
3. Include pending tasks when relevant.
4. Do not schedule more study time than the student's available hours.
5. Give realistic durations.
6. Include short breaks between longer sessions.
7. Prefer the student's preferred study time.
8. Make the plan practical for a college student.
9. Do not create impossible schedules.
10. If a subject has very low progress, give it more attention.
11. Include revision where useful.
12. Keep the plan easy to follow.

Return the answer in EXACTLY this format:

PLAN_START

ITEM
TIME: 6:00 PM - 7:00 PM
SUBJECT: Subject Name
TOPIC: Topic or task
DURATION: 60 minutes
REASON: Short reason

ITEM
TIME: 7:00 PM - 7:15 PM
SUBJECT: Break
TOPIC: Short break
DURATION: 15 minutes
REASON: Recovery

ITEM
TIME: 7:15 PM - 8:00 PM
SUBJECT: Subject Name
TOPIC: Topic or task
DURATION: 45 minutes
REASON: Short reason

PLAN_END

After PLAN_END, write:

SUMMARY:
A short 2-3 sentence explanation of why this plan was created.

IMPORTANT:
Use only subjects from the student's subject list.
`;

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPlanText(
          data.error || "Unable to generate study plan."
        );
        return;
      }

      const reply = data.reply || "";

      setPlanText(reply);

      const parsedPlan = parsePlan(reply);

      setPlan(parsedPlan);

      localStorage.setItem(
        "studyplanner-smart-plan",
        JSON.stringify({
          plan: parsedPlan,
          text: reply,
          generatedAt: new Date().toISOString(),
        })
      );

      setSaved(true);
    } catch {
      setPlanText(
        "Unable to connect to StudyPlanner AI."
      );
    } finally {
      setLoading(false);
    }
  };

  const parsePlan = (text: string): PlanItem[] => {
    const items: PlanItem[] = [];

    const sections = text.split("ITEM");

    sections.forEach((section) => {
      if (
        !section.includes("TIME:") ||
        !section.includes("SUBJECT:")
      ) {
        return;
      }

      const getValue = (label: string) => {
        const regex = new RegExp(
          `${label}:\\s*(.*?)(?=\\n[A-Z]+:|$)`,
          "s"
        );

        const match = section.match(regex);

        return match ? match[1].trim() : "";
      };

      const time = getValue("TIME");
      const subject = getValue("SUBJECT");
      const topic = getValue("TOPIC");
      const duration = getValue("DURATION");
      const reason = getValue("REASON");

      if (time && subject) {
        items.push({
          time,
          subject,
          topic,
          duration,
          reason,
        });
      }
    });

    return items;
  };

  const addPlanToTasks = () => {
    if (plan.length === 0) return;

    try {
      const existingTasks = JSON.parse(
        localStorage.getItem("studyplanner-tasks") || "[]"
      );

      const newTasks: Task[] = plan
        .filter(
          (item) =>
            item.subject.toLowerCase() !== "break"
        )
        .map((item, index) => ({
          id: `ai-plan-${Date.now()}-${index}`,
          title: `${item.topic} (${item.duration})`,
          subject: item.subject,
          completed: false,
        }));

      const updatedTasks = [
        ...existingTasks,
        ...newTasks,
      ];

      localStorage.setItem(
        "studyplanner-tasks",
        JSON.stringify(updatedTasks)
      );

      setTasks(updatedTasks);

      window.dispatchEvent(
        new Event("studyplanner-data-updated")
      );

      setSaved(true);
    } catch {
      console.log("Unable to add plan to tasks.");
    }
  };

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
              Smart Planner 📅
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Let AI create a personalized daily study plan
              using your subjects, progress and pending tasks.
            </p>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <div className="mx-auto max-w-6xl">
            {/* Student Overview */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Branch
                </p>

                <p className="mt-2 font-bold">
                  {profile?.branch || "Not set"}
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Semester
                </p>

                <p className="mt-2 font-bold">
                  {profile?.semester || "Not set"}
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Daily Study Time
                </p>

                <p className="mt-2 font-bold">
                  {profile?.studyHours || "Not set"}
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Average Progress
                </p>

                <p className="mt-2 text-2xl font-bold text-indigo-600">
                  {getAverageProgress()}%
                </p>
              </div>
            </div>

            {/* Planner Generator */}
            <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm lg:p-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                      🧠
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">
                        Generate Today's Plan
                      </h2>

                      <p className="text-sm text-slate-500">
                        AI will decide what you should study first.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                      {subjects.length} subjects
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                      {tasks.filter(
                        (task) => !task.completed
                      ).length}{" "}
                      pending tasks
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                      {profile?.studyHours || "2"} study hours
                    </span>
                  </div>
                </div>

                <button
                  onClick={generatePlan}
                  disabled={loading}
                  className="rounded-xl bg-indigo-600 px-7 py-4 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Creating Plan..."
                    : "Generate Smart Plan →"}
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="mt-6 rounded-3xl border bg-white p-8 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-xl">
                    🤖
                  </div>

                  <div>
                    <p className="font-bold">
                      AI is building your study plan...
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Checking your subjects, progress and pending
                      tasks.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Plan */}
            {plan.length > 0 && !loading && (
              <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm lg:p-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">
                      AI Generated
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Today's Smart Study Plan
                    </h2>
                  </div>

                  <button
                    onClick={addPlanToTasks}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    + Add Study Tasks
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {plan.map((item, index) => {
                    const isBreak =
                      item.subject.toLowerCase() === "break";

                    return (
                      <div
                        key={`${item.time}-${index}`}
                        className={`rounded-2xl border p-5 ${
                          isBreak
                            ? "border-slate-200 bg-slate-50"
                            : "border-indigo-100 bg-white"
                        }`}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-lg">
                              {isBreak ? "☕" : "📚"}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-indigo-600">
                                {item.time}
                              </p>

                              <h3 className="mt-1 font-bold">
                                {item.subject}
                              </h3>

                              <p className="mt-1 text-sm text-slate-600">
                                {item.topic}
                              </p>
                            </div>
                          </div>

                          <div className="md:text-right">
                            <p className="font-bold">
                              {item.duration}
                            </p>

                            <p className="mt-1 max-w-xs text-xs text-slate-500">
                              {item.reason}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {saved && (
                  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                    ✓ Your smart plan has been saved.
                  </div>
                )}
              </div>
            )}

            {/* Raw AI Summary */}
            {planText && !loading && plan.length === 0 && (
              <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="font-bold">
                  AI Planner Response
                </h2>

                <div className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">
                  {planText}
                </div>
              </div>
            )}

            {/* How it works */}
            {!loading && (
              <div className="mt-8">
                <h2 className="text-xl font-bold">
                  How Smart Planner works
                </h2>

                <div className="mt-4 grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <div className="text-2xl">📚</div>
                    <h3 className="mt-3 font-semibold">
                      Your Subjects
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Uses the subjects you selected during setup.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <div className="text-2xl">📊</div>
                    <h3 className="mt-3 font-semibold">
                      Your Progress
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Gives more attention to weaker subjects.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <div className="text-2xl">✅</div>
                    <h3 className="mt-3 font-semibold">
                      Your Tasks
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Includes important pending tasks.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <div className="text-2xl">🤖</div>
                    <h3 className="mt-3 font-semibold">
                      AI Planning
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Creates a realistic plan for your day.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}