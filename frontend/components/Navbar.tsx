"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, Leaf, Brain, BookOpen, LogOut, User, Users, Sun, Moon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "next-themes";
import { RootState, AppDispatch } from "@/store/store";
import { logoutUser } from "@/store/slices/authSlice";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("marketplace"), href: "/marketplace", icon: ShoppingCart },
    { name: t("ai_features"), href: "/crop-recommendation", icon: Brain },
    { name: t("plantation_guide"), href: "/plantation-guide", icon: BookOpen },
    { name: t("community_network"), href: "/farmer-network", icon: Users },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`glass rounded-3xl px-6 py-3 flex items-center justify-between transition-all duration-300 ${scrolled
            ? "shadow-2xl bg-white/90 dark:bg-gray-900/90 border-emerald-500/10"
            : "bg-white/40 dark:bg-gray-900/40 backdrop-blur-lg border-white/20 dark:border-white/10"
            }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="nepali-text text-xl leading-none text-gray-900 dark:text-white">
                कृषि सहयोगी
              </span>
              <span className="text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                Krishi Sahayogi
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-bold text-gray-800 dark:text-gray-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2"
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-500 transition-all shadow-sm"
              aria-label="Toggle theme"
            >
              {mounted && (theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-emerald-600" />)}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${language === "en" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-gray-500 hover:text-emerald-500"}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("ne")}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${language === "ne" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-gray-500 hover:text-emerald-500"}`}
              >
                नेपाली
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    {user?.name?.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[100px]">
                    {user?.name}
                  </span>
                </Link>
                <button
                  onClick={() => dispatch(logoutUser())}
                  className="p-2.5 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105">
                {t("login_join")}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-2 mx-4"
          >
            <div className="glass rounded-2xl p-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-700 dark:text-gray-200 transition-colors"
                >
                  <link.icon className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Theme</span>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-500 transition-all"
                >
                  {mounted && (theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-emerald-600" />)}
                </button>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg text-center"
              >
                {t("login_join")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
