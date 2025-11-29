import { getDictionary } from "@/lib/get-dictionary"
import { Locale } from "@/i18n-config"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DenikoLogo } from "@/components/ui/deniko-logo"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { ArrowRight, Calendar, Users, LineChart, UserPlus, Settings, BookOpen } from "lucide-react"

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#2062A3] p-1.5 rounded-lg">
              <DenikoLogo className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#2062A3]">Deniko</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="hidden sm:flex gap-2">
              <Button variant="ghost" asChild>
                <Link href={`/${lang}/login`}>{dictionary.home.login}</Link>
              </Button>
              <Button className="bg-[#2062A3] hover:bg-[#1a4f83]" asChild>
                <Link href={`/${lang}/register`}>{dictionary.home.get_started}</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight max-w-4xl mx-auto">
              {dictionary.home.hero_title}
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              {dictionary.home.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-[#2062A3] hover:bg-[#1a4f83] h-12 px-8 text-lg w-full sm:w-auto" asChild>
                <Link href={`/${lang}/register`}>
                  {dictionary.home.get_started}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto" asChild>
                <Link href={`/${lang}/login`}>
                  {dictionary.home.login}
                </Link>
              </Button>
            </div>

            {/* Hero Visual Placeholder */}
            <div className="mt-16 relative max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-2 aspect-[16/9] overflow-hidden">
                <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Abstract Dashboard UI */}
                  <div className="absolute inset-0 grid grid-cols-4 gap-4 p-8 opacity-50">
                    <div className="col-span-1 bg-blue-100 rounded-lg h-full"></div>
                    <div className="col-span-3 grid grid-rows-3 gap-4">
                      <div className="bg-gray-200 rounded-lg row-span-1"></div>
                      <div className="bg-gray-100 rounded-lg row-span-2 grid grid-cols-2 gap-4">
                        <div className="bg-white shadow-sm rounded-md"></div>
                        <div className="bg-white shadow-sm rounded-md"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-400 font-medium relative z-10">Dashboard Preview</span>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{dictionary.home.features.title}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow group">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{dictionary.home.features.f1_title}</h3>
                <p className="text-gray-600">{dictionary.home.features.f1_desc}</p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow group">
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{dictionary.home.features.f2_title}</h3>
                <p className="text-gray-600">{dictionary.home.features.f2_desc}</p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow group">
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600 group-hover:scale-110 transition-transform">
                  <LineChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{dictionary.home.features.f3_title}</h3>
                <p className="text-gray-600">{dictionary.home.features.f3_desc}</p>
              </div>
            </div>
          </div>
        </section>        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{dictionary.home.how_it_works.title}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>

              {/* Step 1 */}
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-6 relative z-10">
                  <UserPlus className="h-10 w-10 text-[#2062A3]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{dictionary.home.how_it_works.step1_title}</h3>
                <p className="text-gray-600">{dictionary.home.how_it_works.step1_desc}</p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-6 relative z-10">
                  <Settings className="h-10 w-10 text-[#2062A3]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{dictionary.home.how_it_works.step2_title}</h3>
                <p className="text-gray-600">{dictionary.home.how_it_works.step2_desc}</p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-6 relative z-10">
                  <BookOpen className="h-10 w-10 text-[#2062A3]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{dictionary.home.how_it_works.step3_title}</h3>
                <p className="text-gray-600">{dictionary.home.how_it_works.step3_desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#2062A3] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{dictionary.home.cta.title}</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              {dictionary.home.cta.subtitle}
            </p>
            <Button size="lg" className="bg-white text-[#2062A3] hover:bg-blue-50 h-14 px-10 text-lg" asChild>
              <Link href={`/${lang}/register`}>
                {dictionary.home.cta.button}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t py-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <div className="flex items-center justify-center gap-2 mb-4">
            <DenikoLogo className="h-6 w-6 text-gray-400" />
            <span className="font-semibold text-gray-700">Deniko</span>
          </div>
          <p className="mb-2">© 2025 Deniko. All rights reserved.</p>
          <p className="text-xs text-gray-400">v1.0.0</p>
        </div>
      </footer>
    </div>
  )
}