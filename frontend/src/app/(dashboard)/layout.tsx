'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden">
      {/* ================== Background Layers ================== */}
      <div className="absolute inset-0 -z-10">
        {/* Animated diagonal gradient */}
        <div className="absolute inset-0 bg-linear-to-tr from-purple-800 via-cyan-900 to-pink-800 bg-size-[200%_200%] animate-gradient-x opacity-40"></div>

        {/* Floating radial lights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.05),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.05),transparent_70%)]"></div>

        {/* Floating blobs */}
        <div className="absolute top-10 left-5 w-32 h-32 bg-purple-600/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* ================== Navigation Bar ================== */}
      <nav className="bg-(--card-bg)/80 backdrop-blur-md border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-(--primary) to-(--accent)">
                ✨ TaskWiz Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <>
                  <span className="text-sm text-gray-300">{user.email}</span>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================== Main Content ================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>

      {/* ================== Animations ================== */}
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
