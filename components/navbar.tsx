"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DenikoLogo } from "@/components/ui/deniko-logo"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ArrowRight, BookOpen, LogIn, Menu } from "lucide-react"
import { useEffect, useState } from "react"

interface NavbarProps {
    lang: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dictionary: any
}

export function Navbar({ lang, dictionary }: NavbarProps) {
    const [open, setOpen] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsClient(true))
        return () => cancelAnimationFrame(frame)
    }, [])

    // Close mobile menu when pathname changes
    useEffect(() => {
        // Close mobile menu when navigating to a new route
        setOpen(false)
    }, [pathname])

    return (
        <header className="border-b dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
            <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href={`/${lang}`} className="inline-flex items-center leading-none">
                    <DenikoLogo className="h-12 w-12 md:h-14 md:w-14 text-[#2062A3] dark:text-blue-400 -mr-2.5" />
                    <span className="text-[26px] md:text-[32px] font-bold tracking-tight text-[#2062A3] dark:text-blue-400">
                        eniko
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-3 ml-auto">
                    {isClient && <ThemeToggle labels={dictionary.theme} />}
                    <LanguageSwitcher currentLocale={lang} />

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            asChild
                            className="h-11 px-4 text-[15px] font-medium text-slate-600 dark:text-slate-300 hover:text-[#2062A3] dark:hover:text-blue-400"
                        >
                            <Link href={`/${lang}/login`} className="inline-flex items-center gap-2">
                                <LogIn className="h-4 w-4" />
                                <span>{dictionary.home.login}</span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            className="relative overflow-hidden h-11 px-6 text-[15px] font-semibold rounded-full text-white shadow-lg shadow-blue-900/20 bg-gradient-to-r from-[#1d4f87] via-[#1a4b7d] to-[#113055] hover:opacity-95"
                        >
                            <Link href={`/${lang}/register`} className="inline-flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                <span>{dictionary.home.get_started}</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center gap-2">
                    {isClient ? (
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                size="lg"
                                aria-label={lang === "tr" ? "Menüyü aç" : "Open menu"}
                                className="h-11 px-5 rounded-full bg-[#1d4f87] text-white shadow-md shadow-blue-900/20 hover:bg-[#163b65] focus-visible:ring-[#99bdfc]/50 transition-all gap-2"
                            >
                                <Menu className="h-5 w-5" strokeWidth={2.4} />
                                <span className="text-sm font-semibold tracking-wide">
                                    {lang === "tr" ? "Menü" : "Menu"}
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[250px] sm:w-[300px] flex flex-col overflow-y-auto bg-white dark:bg-slate-950 border-l dark:border-slate-800">
                            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                            <div className="flex flex-col gap-6 py-6">
                                <div className="flex items-center gap-2">
                                    <div className="bg-[#2062A3] dark:bg-blue-600 p-1.5 rounded-lg">
                                        <DenikoLogo className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-[#2062A3] dark:text-blue-400">Deniko</span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button variant="outline" className="w-full justify-start h-12 text-base dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800" asChild onClick={() => setOpen(false)}>
                                        <Link href={`/${lang}/login`}>{dictionary.home.login}</Link>
                                    </Button>
                                    <Button className="w-full justify-start bg-[#2062A3] hover:bg-[#1a4f83] dark:bg-blue-600 dark:hover:bg-blue-700 h-12 text-base" asChild onClick={() => setOpen(false)}>
                                        <Link href={`/${lang}/register`}>{dictionary.home.get_started}</Link>
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Footer Section */}
                            <div className="mt-auto flex flex-col gap-6">
                                {/* Settings */}
                                <div className="border-t dark:border-slate-800 pt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground dark:text-slate-400">
                                            {lang === 'tr' ? 'Tema' : 'Theme'}
                                        </span>
                                        {isClient && <ThemeToggle labels={dictionary.theme} />}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground dark:text-slate-400">
                                            {lang === 'tr' ? 'Dil' : 'Language'}
                                        </span>
                                        <LanguageSwitcher currentLocale={lang} />
                                    </div>
                                </div>

                                {/* Legal Links */}
                                <div className="border-t dark:border-slate-800 pt-6 pb-2">
                                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 px-2">
                                        {lang === 'tr' ? 'Yasal' : 'Legal'}
                                    </h4>
                                    <div className="flex flex-col gap-1">
                                    <Link href={`/${lang}/legal/terms`} className="flex items-center justify-between px-2 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#2062A3] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors" onClick={() => setOpen(false)}>
                                        {lang === 'tr' ? 'Kullanıcı Sözleşmesi' : 'Terms of Service'}
                                    </Link>
                                    <Link href={`/${lang}/legal/privacy`} className="flex items-center justify-between px-2 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#2062A3] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors" onClick={() => setOpen(false)}>
                                        {lang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
                                    </Link>
                                    <Link href={`/${lang}/legal/cookies`} className="flex items-center justify-between px-2 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#2062A3] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors" onClick={() => setOpen(false)}>
                                        {lang === 'tr' ? 'Çerez Politikası' : 'Cookie Policy'}
                                    </Link>
                                    <Link href={`/${lang}/legal/kvkk`} className="flex items-center justify-between px-2 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#2062A3] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors" onClick={() => setOpen(false)}>
                                        KVKK
                                    </Link>
                                </div>
                            </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    ) : (
                        <Button
                            size="lg"
                            aria-label={lang === "tr" ? "Menüyü aç" : "Open menu"}
                            className="h-11 px-5 rounded-full bg-[#1d4f87] text-white opacity-80 cursor-default"
                            disabled
                        >
                            <Menu className="h-5 w-5" strokeWidth={2.4} />
                            <span className="text-sm font-semibold tracking-wide">
                                {lang === "tr" ? "Menü" : "Menu"}
                            </span>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
