import type { Locale } from "@/i18n-config"
import { termsContent } from "@/lib/legal-content"
import { PrintButton } from "@/components/ui/print-button"
import { LegalSection } from "@/components/ui/legal-section"
import { Calendar, FileText } from "lucide-react"

export default async function TermsPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const content = termsContent[lang as keyof typeof termsContent] || termsContent.en

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 overflow-hidden">
            {/* Document Header */}
            <div className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 p-8 md:p-12 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center print:hidden">
                        <FileText className="h-7 w-7" />
                    </div>
                    <PrintButton label={lang === 'tr' ? 'Yazdır' : 'Print'} />
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">{content.title}</h1>
                
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-full w-fit border border-slate-200 dark:border-slate-700">
                    <Calendar className="h-4 w-4" />
                    {content.lastUpdated}
                </div>
            </div>

            {/* Document Content */}
            <div className="p-8 md:p-12">
                <div className="max-w-none">
                    <div className="mb-12 p-6 md:p-8 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/20">
                        <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                            {content.intro}
                        </p>
                    </div>

                    <div className="space-y-2">
                        {content.sections.map((section, index) => (
                            <LegalSection 
                                key={index}
                                title={section.title}
                                content={section.content}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
