import type { Locale } from "@/i18n-config"
import { getDictionary } from "@/lib/get-dictionary"
import { DenikoLogo } from "@/components/ui/deniko-logo"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Shield, Cookie, Scale } from "lucide-react"

export default async function LegalLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  const navItems = [
    { 
      href: `/${lang}/legal/terms`,  
      label: lang === 'tr' ? 'Kullanıcı Sözleşmesi' : 'Terms of Service',
      icon: FileText
    },
    { 
      href: `/${lang}/legal/privacy`, 
      label: lang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy',
      icon: Shield
    },
    { 
      href: `/${lang}/legal/cookies`, 
      label: lang === 'tr' ? 'Çerez Politikası' : 'Cookie Policy',
      icon: Cookie
    },
    { 
      href: `/${lang}/legal/kvkk`, 
      label: lang === 'tr' ? 'KVKK' : 'KVKK',
      icon: Scale
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col print:bg-white print:min-h-0">
      {/* Print Header - Visible only when printing */}
      <div className="hidden print:flex items-center gap-3 mb-8 border-b pb-4 px-8 pt-8">
         <DenikoLogo className="h-8 w-8 text-black" />
         <span className="font-bold text-2xl text-black tracking-tight">Deniko <span className="font-normal text-slate-600">Legal</span></span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-8">
                <Link href={`/${lang}`} className="flex items-center gap-2 transition-opacity hover:opacity-80 group">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                        <DenikoLogo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Deniko <span className="text-slate-400 font-normal">Legal</span></span>
                </Link>
                
                <nav className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-full transition-all"
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2 border-r border-slate-200 dark:border-slate-800 pr-2 sm:pr-3 mr-1">
                    <ThemeToggle labels={dictionary.theme} />
                    <LanguageSwitcher currentLocale={lang} />
                </div>
                <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-full px-2 sm:px-4 group transition-all">
                     <Link href={`/${lang}`}>
                        <ArrowLeft className="h-4 w-4 sm:mr-2 transition-transform group-hover:-translate-x-1" />
                        <span className="hidden sm:inline">{lang === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}</span>
                     </Link>
                </Button>
            </div>
        </div>
      </header>

      {/* Mobile Nav (Horizontal Scroll) */}
      <div className="lg:hidden border-b bg-white dark:bg-slate-900 overflow-x-auto print:hidden">
          <div className="container mx-auto px-4 flex items-center gap-2 py-3 min-w-max">
            {navItems.map((item) => (
                <Link 
                    key={item.href} 
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 dark:text-slate-400 dark:bg-slate-800 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-full transition-all border border-slate-200 dark:border-slate-700"
                >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                </Link>
            ))}
          </div>
      </div>

      <main className="flex-1 container mx-auto py-12 px-4 md:px-6 lg:px-8 print:p-0 print:max-w-none">
        <div className="mx-auto max-w-4xl print:max-w-none">
            {children}
        </div>
      </main>
      
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-900 mt-auto print:hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <DenikoLogo className="h-6 w-6 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Deniko Legal Center</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    &copy; {new Date().getFullYear()} Deniko. {lang === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
                </p>
            </div>
          </div>
      </footer>
    </div>
  )
}
