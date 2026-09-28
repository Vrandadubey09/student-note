import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  BookOpen,
  GraduationCap,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please double-check.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      await register(name, email, password, course, semester);
      setSuccess("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 900);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your details and try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 sm:py-16 bg-gradient-to-br from-emerald-50/40 via-gray-50 to-white min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 mb-4 hover:scale-105 transition-transform"
          >
            <BookOpen size={24} className="text-emerald-600" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          {success && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
              <p className="font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="register-name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vranda Dubey"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vrandadubey31@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="register-course"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Course (optional)
                </label>
                <div className="relative">
                  <GraduationCap
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="register-course"
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech / CS"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="register-semester"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Semester (optional)
                </label>
                <div className="relative">
                  <Calendar
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="register-semester"
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    placeholder="e.g. Sem 4"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="register-confirm-password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  minLength={6}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex items-center justify-center gap-2 w-full h-11 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
            >
              <UserPlus size={16} />
              {submitting ? "Creating Account..." : "Create Account & Get Started"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
