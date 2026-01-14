"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* ================== Background Layers ================== */}
      <div className="absolute inset-0 -z-10">
        {/* Animated diagonal gradient */}
        <div className="absolute inset-0 bg-linear-to-tr from-purple-800 via-cyan-900 to-pink-800 bg-size-[200%_200%] animate-gradient-x opacity-50"></div>

        {/* Floating radial lights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.1),transparent_70%)]"></div>

        {/* Floating blobs */}
        <div className="absolute top-10 left-5 w-32 h-32 bg-purple-600/40 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* ================== Page Content ================== */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="flex justify-between items-center py-6">
          <Link href="/">
            <h1 className="text-3xl sm:text-4xl font-extrabold cursor-pointer bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-cyan-400 hover:scale-105 transition-transform duration-300">
              ✨ TaskWiz
            </h1>
          </Link>
          <div className="flex gap-3">
            <Link href="/signin">
              <Button className="border border-gray-600 rounded-lg px-4 py-2 hover:scale-105 hover:border-purple-400 transition-all duration-300">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="border border-purple-500 rounded-lg px-4 py-2 hover:scale-105 hover:shadow-lg transition-all duration-300">
                Sign Up
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center py-24 md:py-32 relative z-10">
          <div className="px-5 py-2 rounded-full bg-purple-500/20 mb-6 animate-pulse">
            <span className="text-sm font-medium text-purple-300">
              🚀 Modern Task Management
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Organize Your Tasks
            <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-400">
              Simply & Efficiently
            </span>
          </h2>

          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mb-12 leading-relaxed">
            Stay productive with our intuitive task manager. Create, edit, and track
            tasks effortlessly with a modern dark interface.
          </p>

          <div className="flex gap-5 flex-wrap justify-center">
            <Link href="/signup">
              <Button className="border border-purple-500 rounded-lg px-6 py-3 hover:scale-105 hover:shadow-xl transition-all duration-300">
                🎯 Get Started Free
              </Button>
            </Link>
            <Link href="/signin">
              <Button className="border border-gray-600 rounded-lg px-6 py-3 hover:scale-105 hover:shadow-lg transition-all duration-300">
                Sign In →
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto relative z-10">
          {[
            {
              title: "Easy Task Creation",
              desc: "Add tasks quickly with titles & descriptions. Stay organized effortlessly.",
              icon: (
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              ),
            },
            {
              title: "Responsive Design",
              desc: "Access your tasks on any device - desktop, tablet, or mobile.",
              icon: (
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              title: "Secure & Private",
              desc: "Your tasks are secured with JWT authentication. Only you can access your data.",
              icon: (
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              ),
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-(--card-bg)/70 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-purple-700/20 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="py-10 text-center text-gray-400 text-sm border-t border-gray-800 flex flex-col items-center gap-4 relative z-10">
          <p>&copy; 2026 TaskWiz. Built by LAIBA NAZ.</p>
          <div className="flex gap-5 text-gray-400 hover:text-white transition-colors">
            <a href="https://www.linkedin.com/in/laiba-naz-643b192b5/" target="_blank">
              <FaLinkedin size={20} />
            </a>
            <a href="https://x.com/RajLaiba" target="_blank">
              <FaTwitter size={20} />
            </a>
            <a href="https://www.youtube.com/@motivate-l9v" target="_blank">
              <FaYoutube size={20} />
            </a>
            <a href="https://www.instagram.com/laibanaz012/" target="_blank">
              <FaInstagram size={20} />
            </a>
            <a href="https://github.com/Laiba772" target="_blank">
              <FaGithub size={20} />
            </a>
          </div>
        </footer>
      </div>

      {/* ================== Extra Tailwind Animations ================== */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 20s ease infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
