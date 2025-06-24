"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white text-black border-b border-gray-200 dark:bg-[#0e0e1a] dark:text-white dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:text-cyan-500 transition"
        >
          The AI Stack
        </Link>

        <Link
          href="/blog"
          className="text-sm text-gray-700 dark:text-gray-300 hover:text-cyan-500"
        >
          Blog
        </Link>

        <div className="flex items-center gap-3 relative">
          <Link
            href="#subscribe"
            className="text-sm sm:text-base px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:from-indigo-400 hover:to-cyan-400 transition-all"
          >
            Join Newsletter
          </Link>

          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-48 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50"
              >
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      href="/login"
                      className="block text-gray-700 dark:text-gray-200 hover:text-cyan-500 transition"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="block text-gray-700 dark:text-gray-200 hover:text-cyan-500 transition"
                    >
                      Signup
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-cyan-500 transition"
                    >
                      {mounted &&
                        (theme === "dark" ? (
                          <>
                            <Sun size={16} /> Light Theme
                          </>
                        ) : (
                          <>
                            <Moon size={16} /> Dark Theme
                          </>
                        ))}
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
