import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  FolderOpen,
  StickyNote,
  Search,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const FEATURES = [
  {
    icon: FolderOpen,
    title: "Organize by subject",
    desc: "Color-coded subject folders keep every note where it belongs.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: StickyNote,
    title: "Write in Markdown",
    desc: "Format notes with headings, bold, lists and code — rendered beautifully.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Search,
    title: "Find anything fast",
    desc: "Search your notes by title or content in real time.",
    color: "bg-amber-50 text-amber-600",
  },
];

const STEPS = [
  { num: 1, label: "Create an account" },
  { num: 2, label: "Add subjects & notes" },
  { num: 3, label: "Study from anywhere" },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="overflow-x-hidden">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-purple-50" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium mb-6">
            <CheckCircle2 size={14} />
            Your smart study companion
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-5">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              NoteSphere
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-base sm:text-lg text-gray-500 mb-8 leading-relaxed">
            Organize your study notes by subject, search them instantly, and
            never lose an important idea again.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 h-12 w-full sm:w-auto px-7 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors shadow-lg shadow-gray-900/10"
              >
                Go to Dashboard
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 h-12 w-full sm:w-auto px-7 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors shadow-lg shadow-gray-900/10"
                >
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center h-12 w-full sm:w-auto px-7 text-base font-semibold text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-12">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold shrink-0">
                  {step.num}
                </span>
                <span className="whitespace-nowrap">{step.label}</span>
                {i < STEPS.length - 1 && (
                  <ArrowRight size={16} className="text-gray-300 ml-1 shrink-0 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Everything you need
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Simple tools to keep your study life organized and productive.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${f.color} mb-4`}>
                <f.icon size={20} />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="bg-gray-900 rounded-3xl py-12 px-6 sm:py-16 sm:px-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to get started?
          </h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Join students who are already organizing their notes smarter.
          </p>
          {!isAuthenticated && (
            <div className="flex items-center justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 h-12 w-full sm:w-auto px-7 text-base font-semibold text-gray-900 bg-white hover:bg-gray-100 rounded-full transition-colors"
              >
                Create Free Account
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-1.5">
          <BookOpen size={14} />
          NoteSphere
        </div>
      </footer>
    </div>
  );
};

export default Home;
