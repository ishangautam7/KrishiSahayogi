"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, Leaf, Brain, BookOpen, LogOut, User, Users, Sun, Moon, ChevronDown, Microscope, BarChart3, FileText, Sparkles, Sprout, FlaskConical , Bot } from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { logoutUser } from "@/store/slices/authSlice";
import { useLanguage } from "@/context/LanguageContext";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

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

  if (pathname === '/notices') return null;

  /* 
    Updated Navbar:
    - Removed theme toggle (dark mode forced elsewhere).
    - Added Notices link.
  */
  const navLinks = [
    { name: t("marketplace"), href: "/marketplace", icon: ShoppingCart },
    {
      name: t("ai_features"),
      icon: Bot,
      isDropdown: true,
      features: [
        { name: "Smart Advisor", href: "/smart-advisor", icon: Sparkles, color: "text-purple-500", highlight: true },
        { name: t("fertilizer_prediction"), href: "/fertilizer-prediction", icon: FlaskConical, color: "text-emerald-500" },
        { name: t("crop_recommendation"), href: "/crop-recommendation", icon: Sprout, color: "text-green-500" },
        { name: t("disease_detection"), href: "/disease-detection", icon: Microscope, color: "text-teal-500" },
        { name: t("plantation_guide"), href: "/plantation-guide", icon: BookOpen, color: "text-amber-500" },
        { name: t("price_prediction"), href: "/price-prediction", icon: BarChart3, color: "text-blue-500" },
      ]
    },
    { name: t("community_network"), href: "/farmer-network", icon: Users },
    { name: t("notice"), href: "/notices", icon: FileText },
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
              link.isDropdown ? (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setIsAiDropdownOpen(true)}
                  onMouseLeave={() => setIsAiDropdownOpen(false)}
                >
                  <button className="text-sm font-bold text-gray-800 dark:text-gray-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 py-2">
                    <link.icon className="w-4 h-4" />
                    {link.name}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isAiDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isAiDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 mt-2 w-72 p-4 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 z-50"
                      >
                        <div className="space-y-2">
                          {link.features?.map((feature) => (
                            <Link
                              key={feature.href}
                              href={feature.href}
                              onClick={() => setIsAiDropdownOpen(false)}
                              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
                            >
                              <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform ${feature.color}`}>
                                <feature.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-gray-900 dark:text-white">{feature.name}</p>

                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href || "#"}
                  className="text-sm font-bold text-gray-800 dark:text-gray-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              )
            ))}

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
                <div key={link.name}>
                  {link.isDropdown ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-4 py-3 text-emerald-600 dark:text-emerald-400 font-black uppercase text-[10px] tracking-widest bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <link.icon className="w-4 h-4" />
                        {link.name}
                      </div>
                      <div className="grid grid-cols-1 gap-2 pl-4">
                        {link.features?.map((feature) => (
                          <Link
                            key={feature.href}
                            href={feature.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-700 dark:text-gray-200 transition-colors"
                          >
                            <feature.icon className={`w-5 h-5 ${feature.color}`} />
                            <span className="font-medium">{feature.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.href || "#"}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-700 dark:text-gray-200 transition-colors font-bold"
                    >
                      <link.icon className="w-5 h-5 text-emerald-500" />
                      <span>{link.name}</span>
                    </Link>
                  )}
                </div>
              ))}
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
