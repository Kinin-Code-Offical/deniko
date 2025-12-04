import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { DenikoLogo } from "@/components/ui/deniko-logo"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation"
import { ArrowRight, Calendar, Users, LineChart, UserPlus, Settings, BookOpen, GraduationCap, LayoutDashboard, Wallet, Bell, Search, MoreHorizontal, MessageSquare, CreditCard, ShieldCheck, Library, Smartphone, CheckCircle2 } from "lucide-react"
import type { CSSProperties } from "react"
import { db } from "@/lib/db"

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dictionary = (await getDictionary(lang)) 

  // Fetch real stats
  const teacherCount = await db.teacherProfile.count()
  const studentCount = await db.studentProfile.count()
  const lessonCount = await db.lesson.count()

  const scheduleEntries = [
    { time: "09:00", subject: dictionary.home.mock_dashboard.math, room: "301" },
    { time: "11:30", subject: dictionary.home.mock_dashboard.physics, room: "205" },
    { time: "14:00", subject: dictionary.home.mock_dashboard.chemistry, room: "210" },
  ]

  const centerStats = [
    { label: dictionary.home.mock_dashboard.students, value: "48" },
    { label: dictionary.home.mock_dashboard.classes_today, value: "12" },
    { label: dictionary.home.mock_dashboard.completed, value: "68" },
  ]

  const completionMetrics = [
    { label: dictionary.home.mock_dashboard.completed, value: "68", filled: 85 },
    { label: dictionary.home.mock_dashboard.pending, value: "12", filled: 35 },
  ]

  const scheduleCard = (className = "") => (
    <div
      tabIndex={0}
      className={`bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-3xl shadow-[0_15px_45px_rgba(15,23,42,0.08)] border border-white/60 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:-translate-y-1 focus-visible:scale-[1.03] sm:hover:-translate-y-2 sm:hover:scale-[1.05] sm:hover:z-30 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-1">{dictionary.home.mock_dashboard.schedule}</p>
          <div className="text-sm font-semibold text-slate-800">12 {dictionary.home.mock_dashboard.math}</div>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-orange-100 flex items-center justify-center">
          <Calendar className="h-4 w-4 text-orange-600" />
        </div>
      </div>
      <div className="space-y-3">
        {scheduleEntries.map((lesson, i) => (
          <div key={`${lesson.subject}-${i}`} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2">
            <div className="text-[11px] font-semibold text-slate-500 w-12">{lesson.time}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">{lesson.subject}</p>
              <p className="text-[10px] text-slate-400">{dictionary.home.mock_dashboard.room} {lesson.room}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const profileCard = (className = "") => (
    <div
      tabIndex={0}
      className={`bg-white p-5 sm:p-6 rounded-3xl shadow-[0_30px_70px_rgba(15,23,42,0.12)] border border-slate-100 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:-translate-y-1 focus-visible:scale-[1.03] sm:hover:-translate-y-2 sm:hover:scale-[1.05] sm:hover:z-40 ${className}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-800">{dictionary.home.mock_dashboard.graphic_profile}</div>
          <div className="text-xs text-slate-500">{dictionary.home.mock_dashboard.graphic_performance}</div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-1">{dictionary.home.mock_dashboard.attendance}</p>
          <p className="text-3xl font-semibold text-slate-900">94%</p>
        </div>
        <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
          <LineChart className="h-6 w-6 text-blue-500" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {centerStats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between rounded-2xl px-3 py-2 bg-white border border-slate-100">
            <p className="text-[11px] text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
            <span className="text-lg font-semibold text-slate-900">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const analysisCard = (className = "") => (
    <div
      tabIndex={0}
      className={`bg-white/95 backdrop-blur-sm p-5 rounded-3xl shadow-[0_15px_45px_rgba(15,23,42,0.08)] border border-white/60 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-100 focus-visible:-translate-y-1 focus-visible:scale-[1.03] sm:hover:-translate-y-2 sm:hover:scale-[1.05] sm:hover:z-30 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-1">{dictionary.home.mock_dashboard.graphic_analysis}</p>
          <p className="text-sm font-semibold text-slate-800">A+ {dictionary.home.mock_dashboard.class_average}</p>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <LineChart className="h-4 w-4 text-emerald-600" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-1">
          <div className="relative h-24 w-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent border-r-transparent rotate-45"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center">
              <span className="text-lg font-bold text-emerald-600">92%</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3">
          {completionMetrics.map((metric) => (
            <div key={metric.label} className="flex items-center gap-2">
              <div className="h-2 w-12 rounded-full bg-emerald-100 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${metric.filled}%` }}></div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600">{metric.label}</p>
                <p className="text-sm font-bold text-slate-900">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const featureAxisStyle: CSSProperties & { "--feature-axis": string } = {
    "--feature-axis": "clamp(2.6rem, 4vw, 3.3rem)",
  }

  return (
    <div className="min-h-screen bg-white flex flex-col animate-in fade-in duration-1000">
      <Navbar lang={lang} dictionary={dictionary} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617] py-16 md:py-24">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              {/* Text Content */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight drop-shadow-[0_20px_80px_rgba(15,23,42,0.9)]">
                  {dictionary.home.hero_title}
                </h1>
                <p className="text-base md:text-lg text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {dictionary.home.hero_subtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Button size="lg" className="bg-white text-[#1d4ed8] hover:bg-blue-50 h-11 px-7 text-sm md:text-base w-full sm:w-auto shadow-lg shadow-blue-900/30" asChild>
                    <Link href={`/${lang}/register`}>
                      {dictionary.home.get_started}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-11 px-7 text-sm md:text-base w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10" asChild>
                    <Link href={`/${lang}/login`}>
                      {dictionary.home.login}
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="flex-1 w-full max-w-xl lg:max-w-none">
                <div className="relative perspective-1200">
                  <div className="bg-slate-900/90 rounded-3xl shadow-[0_40px_120px_rgba(15,23,42,0.9)] border border-blue-500/30 p-3 aspect-[4/3] overflow-hidden tilt-soft transition-transform duration-500">
                    <div className="w-full h-full bg-slate-900 rounded-2xl flex flex-col overflow-hidden">
                      {/* Mock UI Header */}
                      <div className="h-12 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-4 gap-4 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                          </div>
                          <div className="h-8 w-px bg-slate-800 mx-2"></div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="text-xs font-medium">{dictionary.home.mock_dashboard.dashboard_title}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-48 bg-slate-800/50 rounded-full flex items-center px-3 gap-2 border border-slate-700/50">
                            <Search className="h-3.5 w-3.5 text-slate-500" />
                            <div className="h-1.5 w-20 bg-slate-700/50 rounded-full"></div>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                            <Bell className="h-3.5 w-3.5 text-blue-400" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Mock UI Body */}
                      <div className="flex-1 p-5 grid grid-cols-12 gap-6 bg-slate-950/50">
                        {/* Sidebar */}
                        <div className="col-span-3 hidden sm:flex flex-col gap-1">
                          <div className="h-9 w-full bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center px-3 gap-3 text-blue-400">
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="text-xs font-medium">{dictionary.home.mock_dashboard.overview}</span>
                          </div>
                          <div className="h-9 w-full hover:bg-slate-800/50 rounded-lg flex items-center px-3 gap-3 text-slate-500 transition-colors">
                            <Users className="h-4 w-4" />
                            <span className="text-xs font-medium">{dictionary.home.mock_dashboard.students}</span>
                          </div>
                          <div className="h-9 w-full hover:bg-slate-800/50 rounded-lg flex items-center px-3 gap-3 text-slate-500 transition-colors">
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs font-medium">{dictionary.home.mock_dashboard.schedule}</span>
                          </div>
                          <div className="h-9 w-full hover:bg-slate-800/50 rounded-lg flex items-center px-3 gap-3 text-slate-500 transition-colors">
                            <Wallet className="h-4 w-4" />
                            <span className="text-xs font-medium">{dictionary.home.mock_dashboard.finance}</span>
                          </div>
                          
                          <div className="mt-auto">
                            <div className="h-24 w-full bg-gradient-to-br from-blue-900/20 to-slate-900 rounded-xl border border-blue-500/10 p-3 flex flex-col justify-between">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <GraduationCap className="h-4 w-4 text-blue-400" />
                                </div>
                                <div>
                                    <div className="h-1.5 w-12 bg-slate-700 rounded-full mb-1.5"></div>
                                    <div className="h-1 w-8 bg-slate-800 rounded-full"></div>
                                </div>
                            </div>
                          </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-span-12 sm:col-span-9 flex flex-col gap-4">
                          {/* Stats Row */}
                              <div className="grid grid-cols-3 gap-3">
                               <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-wider">{dictionary.home.mock_dashboard.attendance}</span>
                                    <span className="text-[10px] text-emerald-400 font-medium">+4.5%</span>
                                </div>
                                <div className="text-base sm:text-lg font-bold text-white mb-1">94%</div>
                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-[94%] bg-emerald-500 rounded-full"></div>
                                </div>
                             </div>
                               <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-wider">{dictionary.home.mock_dashboard.active_students}</span>
                                    <span className="text-[10px] text-blue-400 font-medium">{dictionary.home.mock_dashboard.active}</span>
                                </div>
                                <div className="text-base sm:text-lg font-bold text-white mb-1">48</div>
                                <div className="flex -space-x-2">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="h-5 w-5 rounded-full bg-slate-700 border border-slate-900"></div>
                                    ))}
                                </div>
                             </div>
                               <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-wider">{dictionary.home.mock_dashboard.classes_today}</span>
                                    <span className="text-[10px] text-orange-400 font-medium">{dictionary.home.mock_dashboard.pending}</span>
                                </div>
                                <div className="text-base sm:text-lg font-bold text-white mb-1">12</div>
                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-[60%] bg-orange-500 rounded-full"></div>
                                </div>
                             </div>
                          </div>

                          {/* Chart Area */}
                          <div className="h-32 w-full bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">{dictionary.home.mock_dashboard.exam_results}</div>
                                    <div className="text-sm font-bold text-white">{dictionary.home.mock_dashboard.class_average}: 84%</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-6 w-16 bg-slate-800 rounded-md flex items-center justify-center text-[10px] text-slate-400">{dictionary.home.mock_dashboard.weekly}</div>
                                    <div className="h-6 w-6 bg-blue-600/20 rounded-md flex items-center justify-center">
                                        <MoreHorizontal className="h-3 w-3 text-blue-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-end justify-between h-12 gap-2 px-2">
                                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75].map((h, i) => (
                                    <div key={i} className="w-full bg-blue-500/20 rounded-t-sm relative group-hover:bg-blue-500/30 transition-colors" style={{ height: `${h}%` }}>
                                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-sm transition-all duration-1000" style={{ height: `${h/2}%` }}></div>
                                    </div>
                                ))}
                            </div>
                          </div>

                          {/* Schedule Area */}
                          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 overflow-hidden flex flex-col">
                             <div className="text-[10px] font-medium text-slate-500 mb-2 uppercase tracking-wider">{dictionary.home.mock_dashboard.schedule}</div>
                             <div className="flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
                                {[
                                    { time: "09:00", subject: dictionary.home.mock_dashboard.math, color: "bg-blue-500" },
                                    { time: "11:00", subject: dictionary.home.mock_dashboard.physics, color: "bg-purple-500" },
                                    { time: "14:30", subject: dictionary.home.mock_dashboard.chemistry, color: "bg-emerald-500" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-800/50 hover:bg-slate-800 transition-colors">
                                        <div className="text-xs font-bold text-slate-400 w-9">{item.time}</div>
                                        <div className={`h-8 w-1 rounded-full ${item.color}`}></div>
                                        <div className="flex-1">
                                            <div className="text-xs font-medium text-slate-200">{item.subject}</div>
                                            <div className="text-[10px] text-slate-500">12-A • {dictionary.home.mock_dashboard.room} 301</div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Decorative Blobs */}
                  <div className="absolute -top-10 -right-6 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features + Stats Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-start gap-12 mb-16">
              <FadeIn className="flex-1">
                <p className="text-sm font-semibold tracking-[0.25em] uppercase text-[#2062A3]/80 mb-4">
                  {dictionary.home.features.badge}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {dictionary.home.features.title}
                </h2>
                <p className="text-gray-600 max-w-xl leading-relaxed">
                  {dictionary.home.features.subtitle}
                </p>
                <div className="mt-8 relative h-[400px] sm:h-[440px] lg:h-[460px] w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 overflow-hidden p-6 sm:p-8 flex items-center justify-center group">
                  {/* Abstract Background */}
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                  
                  {/* Floating Elements Composition */}
                    <div className="relative w-full h-full">
                      {/* Mobile swipeable cards */}
                      <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2">
                        {scheduleCard("snap-center shrink-0 w-60")}
                        {profileCard("snap-center shrink-0 w-64")}
                        {analysisCard("snap-center shrink-0 w-60")}
                      </div>

                      {/* Desktop floating layout */}
                      <div className="hidden sm:flex w-full h-full items-center justify-center relative">
                        {scheduleCard("absolute left-2 top-1/2 -translate-y-1/2 -translate-x-4 -rotate-6 group-hover:-rotate-9 z-10")}
                        {profileCard("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20")}
                        {analysisCard("absolute right-2 top-1/2 -translate-y-1/2 translate-x-4 rotate-6 group-hover:rotate-9 z-10")}
                      </div>
                    </div>
                </div>
              </FadeIn>

                    <div className="flex-1 relative pl-8 sm:pl-12" style={featureAxisStyle}>
                    {/* Connecting Line */}
                      <FadeIn className="pointer-events-none absolute inset-y-3 flex justify-center z-0 w-10" style={{ left: "var(--feature-axis)" }}>
                          <div className="feature-line relative h-full w-[6px] -translate-x-1/2">
                        <span className="feature-flash"></span>
                        <span className="feature-node feature-node--top"></span>
                        <span className="feature-node feature-node--bottom"></span>
                      </div>
                    </FadeIn>

                      <StaggerContainer className="flex flex-col gap-5 relative z-10" delay={0.2}>
                  {[
                    {
                      icon: Calendar,
                      title: dictionary.home.features.scheduling_title,
                      desc: dictionary.home.features.scheduling_desc,
                      color: "text-blue-600",
                      bg: "bg-blue-50"
                    },
                    {
                      icon: Users,
                      title: dictionary.home.features.students_title,
                      desc: dictionary.home.features.students_desc,
                      color: "text-indigo-600",
                      bg: "bg-indigo-50"
                    },
                    {
                      icon: LineChart,
                      title: dictionary.home.features.progress_title,
                      desc: dictionary.home.features.progress_desc,
                      color: "text-emerald-600",
                      bg: "bg-emerald-50"
                    },
                    {
                      icon: MessageSquare,
                      title: dictionary.home.features.communication_title,
                      desc: dictionary.home.features.communication_desc,
                      color: "text-purple-600",
                      bg: "bg-purple-50"
                    },
                    {
                      icon: CreditCard,
                      title: dictionary.home.features.payments_title,
                      desc: dictionary.home.features.payments_desc,
                      color: "text-orange-600",
                      bg: "bg-orange-50"
                    },
                    {
                      icon: ShieldCheck,
                      title: dictionary.home.features.guardians_title,
                      desc: dictionary.home.features.guardians_desc,
                      color: "text-slate-700",
                      bg: "bg-slate-100"
                    },
                    {
                      icon: Library,
                      title: dictionary.home.features.resources_title,
                      desc: dictionary.home.features.resources_desc,
                      color: "text-pink-600",
                      bg: "bg-pink-50"
                    },
                    {
                      icon: Smartphone,
                      title: dictionary.home.features.mobile_title,
                      desc: dictionary.home.features.mobile_desc,
                      color: "text-cyan-600",
                      bg: "bg-cyan-50"
                    }
                  ].map((feature, index) => (
                    <StaggerItem
                      key={index}
                      className="group relative flex items-center gap-4 sm:gap-5 px-5 sm:px-6 py-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300"
                    >
                      <span className="feature-dot"></span>
                      <div className={`shrink-0 w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10 ring-4 ring-white`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{dictionary.home.how_it_works.title}</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                {lang === 'tr' ? 'Karmaşık süreçleri basitleştirin. Sadece 3 adımda dijital dönüşümünüzü tamamlayın.' : 'Simplify complex processes. Complete your digital transformation in just 3 steps.'}
              </p>
            </div>

            <StaggerContainer className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 -z-10"></div>

              {/* Step 1 */}
              <StaggerItem className="relative group">
                <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 relative z-10">
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">1</div>
                    <UserPlus className="h-9 w-9 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 text-center group-hover:text-blue-700 transition-colors">{dictionary.home.how_it_works.step1_title}</h3>
                  <p className="text-slate-600 text-center leading-relaxed">{dictionary.home.how_it_works.step1_desc}</p>
                </div>
              </StaggerItem>

              {/* Step 2 */}
              <StaggerItem className="relative group">
                <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-indigo-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 relative z-10">
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">2</div>
                    <Settings className="h-9 w-9 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 text-center group-hover:text-indigo-700 transition-colors">{dictionary.home.how_it_works.step2_title}</h3>
                  <p className="text-slate-600 text-center leading-relaxed">{dictionary.home.how_it_works.step2_desc}</p>
                </div>
              </StaggerItem>

              {/* Step 3 */}
              <StaggerItem className="relative group">
                <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-emerald-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 relative z-10">
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">3</div>
                    <BookOpen className="h-9 w-9 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 text-center group-hover:text-emerald-700 transition-colors">{dictionary.home.how_it_works.step3_title}</h3>
                  <p className="text-slate-600 text-center leading-relaxed">{dictionary.home.how_it_works.step3_desc}</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white border-y border-slate-100">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Teachers */}
                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-colors">
                        <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-slate-900">{teacherCount.toLocaleString()}</span>
                                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{dictionary.home.stats.teachers_suffix}</span>
                            </div>
                            <p className="text-lg font-medium text-slate-700 mb-1">{dictionary.home.stats.teachers_label}</p>
                            <p className="text-sm text-slate-500">{dictionary.home.stats.teachers_hint}</p>
                        </div>
                    </div>
                    
                    {/* Students */}
                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
                        <div className="h-16 w-16 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
                            <GraduationCap className="h-8 w-8 text-indigo-600" />
                        </div>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-slate-900">{studentCount.toLocaleString()}</span>
                                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{dictionary.home.stats.students_suffix}</span>
                            </div>
                            <p className="text-lg font-medium text-slate-700 mb-1">{dictionary.home.stats.students_label}</p>
                            <p className="text-sm text-slate-500">{dictionary.home.stats.students_hint}</p>
                        </div>
                    </div>

                    {/* Lessons */}
                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-100 transition-colors">
                        <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                            <BookOpen className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-slate-900">{lessonCount.toLocaleString()}</span>
                                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{dictionary.home.stats.lessons_suffix}</span>
                            </div>
                            <p className="text-lg font-medium text-slate-700 mb-1">{dictionary.home.stats.lessons_label}</p>
                            <p className="text-sm text-slate-500">{dictionary.home.stats.lessons_hint}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#1d4f87]">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">{dictionary.home.cta.title}</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              {dictionary.home.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-white text-[#1d4f87] hover:bg-blue-50 h-14 px-10 text-lg shadow-xl shadow-blue-900/20 w-full sm:w-auto" asChild>
                <Link href={`/${lang}/register`}>
                    {dictionary.home.cta.button}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/20 text-white hover:bg-white/10 w-full sm:w-auto" asChild>
                    <Link href={`/${lang}/login`}>
                        {dictionary.home.login}
                    </Link>
                </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-2">
                <DenikoLogo className="h-8 w-8 text-slate-400" />
                <span className="font-bold text-2xl text-slate-400">Deniko</span>
              </div>
              <p className="text-slate-500 text-base leading-relaxed max-w-md">
                {dictionary.home.hero_subtitle}
              </p>
              <div className="flex items-center gap-4">
                {/* Social Media Icons */}
                <a href="https://github.com/Kinin-Code-Offical" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#2062A3] hover:border-blue-200 transition-colors cursor-pointer">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
                <a href="https://www.patreon.com/YamacGursel" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#2062A3] hover:border-blue-200 transition-colors cursor-pointer">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M0 .48c0-.176.144-.32.32-.32h7.214c5.225 0 9.46 4.235 9.46 9.46 0 5.225-4.235 9.46-9.46 9.46H4.741c-.176 0-.32-.144-.32-.32V.48zm-4.741 0c0-.176.144-.32.32-.32h4.101c.176 0 .32.144.32.32v23.04c0 .176-.144.32-.32.32H.32c-.176 0-.32-.144-.32-.32V.48z" transform="translate(4.741)" /><rect width="4.101" height="23.04" x="0" y=".48" rx=".32" ry=".32" /></svg>
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div className="md:col-span-3 md:col-start-7">
              <h4 className="font-bold text-slate-900 mb-6">{lang === 'tr' ? 'Platform' : 'Platform'}</h4>
              <ul className="space-y-4 text-sm text-slate-600">
                <li>
                  <Link href={`/${lang}/login`} className="hover:text-[#2062A3] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
                    {dictionary.home.login}
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/register`} className="hover:text-[#2062A3] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
                    {dictionary.home.get_started}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="md:col-span-3">
              <h4 className="font-bold text-slate-900 mb-6">{lang === 'tr' ? 'Yasal' : 'Legal'}</h4>
              <ul className="space-y-4 text-sm text-slate-600">
                <li>
                  <Link href={`/${lang}/legal/terms`} className="hover:text-[#2062A3] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
                    {lang === 'tr' ? 'Kullanıcı Sözleşmesi' : 'Terms of Service'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/legal/privacy`} className="hover:text-[#2062A3] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
                    {lang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/legal/cookies`} className="hover:text-[#2062A3] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
                    {lang === 'tr' ? 'Çerez Politikası' : 'Cookie Policy'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/legal/kvkk`} className="hover:text-[#2062A3] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
                    {lang === 'tr' ? 'KVKK Aydınlatma Metni' : 'KVKK Clarification Text'}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              {lang === 'tr' ? '© 2025 Deniko. Tüm hakları saklıdır.' : '© 2025 Deniko. All rights reserved.'}
            </p>
            <div className="flex items-center gap-6">
                <span className="text-xs text-slate-400">
                    {lang === 'tr' ? 'Patent hakları Deniko\'ya aittir.' : 'Patent rights belong to Deniko.'}
                </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}