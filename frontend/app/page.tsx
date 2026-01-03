"use client";

import { motion, Variants } from "framer-motion";
import {
  Leaf,
  ArrowRight,
  ShoppingCart,
  Brain,
  Sprout,
  Users,
  Microscope,
  BarChart3,
  BookOpen,
  TrendingUp,
  Target,
  ShieldCheck,
  MapPin,
  ShoppingBag,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function LandingPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  
  const features = [
    {
      title: "Yield Prediction",
      desc: "Advanced AI models to forecast your harvest accurately based on soil and weather.",
      icon: BarChart3,
      color: "emerald",
      image: "/assets/images/Yield.png"
    },
    {
      title: "Crop Recommendation",
      desc: "Personalized suggestions for what to plant next to maximize your season's profit.",
      icon: Sprout,
      color: "green",
      image: "/assets/images/Crop.png"
    },
    {
      title: "Disease Detection",
      desc: "Snap a photo and get instant diagnosis and organic treatment solutions.",
      icon: Microscope,
      color: "teal",
      image: "/assets/images/Disease.png"
    },
    {
      title: "Farmer Network",
      desc: "Connect with local experts, share wisdom, and grow your community.",
      icon: Users,
      color: "blue",
      image: "/assets/images/Farmer.png"
    },
    {
      title: "Plantation Guide",
      desc: "Smart schedules and maintenance tips tailored for your specific environment.",
      icon: MapPin,
      color: "amber",
      image: "/assets/images/Plantation.png"
    },
    {
      title: "Marketplace",
      desc: "Direct farm-to-table access. Sell your produce at fair prices with no middlemen.",
      icon: ShoppingBag,
      color: "rose",
      image: "/assets/images/Marketplace.png"
    }
  ];

  const steps = [
    {
      title: "Register",
      desc: "Create your profile and list your farm location.",
      icon: CheckCircle2
    },
    {
      title: "Analyze",
      desc: "Use AI tools to optimize your farming strategy.",
      icon: Microscope
    },
    {
      title: "Trade",
      desc: "Sell your produce directly to verified buyers.",
      icon: ShoppingBag
    }
  ];

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-left z-10"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold mb-6">
              
              
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-6xl sm:text-7xl lg:text-8xl font-black leading-tight mb-6">
              <span className="nepali-text block text-gray-900 dark:text-white mb-2">कृषि सहयोगी</span>
              <span className="gradient-text">Future of Farming</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed">
              Empowering farmers with AI-driven insights, disease detection, and a direct-to-consumer marketplace. Grow more, sell better.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href={isAuthenticated ? "/marketplace" : "/register"} className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-lg font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 group text-center">
                {isAuthenticated ? "Go to Marketplace" : "Start Farming Smarter"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/marketplace" className="px-8 py-4 glass text-gray-900 dark:text-white text-lg font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-center">
                Explore Features
              </Link>
            </motion.div>



            
          </motion.div >

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <img
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000"
                alt="Modern Farming"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent"></div>
            </div>

            {/* Floating UI Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -left-10 glass p-6 rounded-3xl z-20 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="text-emerald-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Growth</p>
                
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -right-10 glass p-6 rounded-3xl z-20 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Health</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">Optimal</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div >

        {/* Background blobs */}
        < div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-200/20 dark:bg-emerald-900/20 rounded-full blur-[120px] -z-10 animate-pulse-soft" ></div >
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-green-200/20 dark:bg-green-900/20 rounded-full blur-[100px] -z-10"></div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 animate-bounce">
          <ChevronDown className="w-8 h-8" />
        </div>
      </section >

    

      {/* Features Section */}
      < section id="features" className="py-32 bg-gray-50/50 dark:bg-gray-950/50 relative px-4 sm:px-6 lg:px-8" >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Core Ecosystem</h2>
            <h3 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white mb-6">Designed for Every Farmer</h3>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Our comprehensive suite of tools leverages cutting-edge technology to solve traditional farming challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden"
              >
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-[1.25rem] bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className="text-emerald-600 w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-emerald-600 transition-colors">{feature.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                    {feature.desc}
                  </p>
                  <div className="w-full aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-600/5 rounded-full blur-3xl group-hover:bg-emerald-600/10 transition-colors"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* How it Works */}
      < section className="py-32 px-4 sm:px-6 lg:px-8" >
        <div className="max-w-7xl mx-auto">
          <div className="bg-emerald-600 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden shadow-2xl shadow-emerald-500/20">
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-4xl sm:text-6xl font-black text-white mb-8">Getting Started is Simple</h3>
                <div className="space-y-12">
                  {steps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className="flex gap-6"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 border border-white/30">
                        <step.icon className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                        <p className="text-emerald-50/80 leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <button className="mt-16 px-10 py-5 bg-white text-emerald-600 text-lg font-black rounded-2xl hover:scale-105 transition-transform">
                  Join the Revolution
                </button>
              </div>
              <div className="relative hidden lg:block">
                <div className="aspect-[4/5] bg-white/10 rounded-[3rem] border border-white/20 backdrop-blur-sm p-4 overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&q=80&w=800"
                    alt="Success"
                    className="w-full h-full object-cover rounded-[2rem]"
                  />
                </div>
              </div>
            </div>

            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute w-[800px] h-[800px] bg-white rounded-full blur-[150px] -top-1/2 -right-1/4"></div>
            </div>
          </div>
        </div>
      </section >

      

      {/* Footer */}
      < footer className="bg-gray-900 dark:bg-black py-24 px-4 sm:px-6 lg:px-8" >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Sprout className="text-white w-6 h-6" />
                </div>
                <span className="nepali-text text-2xl text-white">कृषि सहयोगी</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
                Empowering Nepali farmers with the power of Artificial Intelligence and direct market access.
              </p>
              <div className="flex gap-4">
                {[MessageCircle, Users, BarChart3].map((Icon, idx) => (
                  <Link key={idx} href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-emerald-500 transition-colors">
                    <Icon className="w-6 h-6" />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h6 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Resources</h6>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">AI Diagnostics</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">Market Pricing</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">Plantation Guide</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">Support Portal</Link></li>
              </ul>
            </div>

            <div>
              <h6 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Company</h6>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <p>© 2026 Krishi Sahayogi. All rights reserved.</p>
            <p className="nepali-text text-emerald-500/50">भविष्यको कृषि, आजको प्रविधि</p>
          </div>
        </div>
      </footer >
    </main >
  );
}
