'use client'

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  BookOpen,
  Menu,
  GraduationCap,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Ejercicios', href: '/exercises', icon: Dumbbell },
  { name: 'Cuentos', href: '/stories', icon: BookOpen },
];

export default function SidebarLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200
          flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300
        `}
      >
        <div className="p-8 border-b border-slate-100">
          <Link href="/exercises" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900">Aprendiendo con amor</h1>
              <p className="text-xs text-slate-500">Web diseñada para ti!!</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 mb-1.5 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : ''}`} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <span className="font-semibold text-slate-900">Aprendiendo con amor</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}