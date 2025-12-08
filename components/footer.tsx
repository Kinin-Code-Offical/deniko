import Link from "next/link";
import type { Dictionary } from "@/types/i18n";
import { DenikoLogo } from "@/components/ui/deniko-logo";

interface FooterProps {
  lang: string;
  dictionary: Dictionary;
}

export function Footer({ lang, dictionary }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 pt-12 pb-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid gap-8 md:grid-cols-12">
          {/* Brand & Social */}
          <div className="md:col-span-4">
            <Link href={`/${lang}`} className="mb-6 flex items-center gap-2">
              <DenikoLogo className="h-8 w-8 text-slate-600 dark:text-blue-500" />
              <span className="text-2xl font-medium text-slate-600 dark:text-white">
                {dictionary.home.footer.brand}
              </span>
            </Link>
            <p className="mb-6 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400">
              {dictionary.metadata.home.description}
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/Kinin-Code-Offical"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={dictionary.home.footer.github}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors hover:border-blue-200 hover:text-[#2062A3] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:border-blue-800 dark:hover:text-blue-400"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.patreon.com/YamacGursel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={dictionary.home.footer.patreon}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors hover:border-blue-200 hover:text-[#2062A3] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:border-blue-800 dark:hover:text-blue-400"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M0 .48c0-.176.144-.32.32-.32h7.214c5.225 0 9.46 4.235 9.46 9.46 0 5.225-4.235 9.46-9.46 9.46H4.741c-.176 0-.32-.144-.32-.32V.48zm-4.741 0c0-.176.144-.32.32-.32h4.101c.176 0 .32.144.32.32v23.04c0 .176-.144.32-.32.32H.32c-.176 0-.32-.144-.32-.32V.48z"
                    transform="translate(4.741)"
                  />
                  <rect
                    width="4.101"
                    height="23.04"
                    x="0"
                    y=".48"
                    rx=".32"
                    ry=".32"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Support Links (New) */}
          <div className="md:col-span-2">
            <h2 className="mb-6 text-base font-medium text-slate-600 dark:text-white">
              {dictionary.home.footer.support}
            </h2>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href={`/${lang}/faq`}
                  className="flex items-center gap-2 transition-colors hover:text-[#2062A3] dark:hover:text-blue-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-200 dark:bg-blue-800"></span>
                  {dictionary.support.nav.faq}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/support`}
                  className="flex items-center gap-2 transition-colors hover:text-[#2062A3] dark:hover:text-blue-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-200 dark:bg-blue-800"></span>
                  {dictionary.support.nav.support}
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-3">
            <h2 className="mb-6 text-base font-medium text-slate-600 dark:text-white">
              {dictionary.home.footer.platform}
            </h2>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href={`/${lang}/login`}
                  className="flex items-center gap-2 transition-colors hover:text-[#2062A3] dark:hover:text-blue-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-200 dark:bg-blue-800"></span>
                  {dictionary.home.login}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/register`}
                  className="flex items-center gap-2 transition-colors hover:text-[#2062A3] dark:hover:text-blue-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-200 dark:bg-blue-800"></span>
                  {dictionary.home.get_started}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/legal`}
                  className="flex items-center gap-2 transition-colors hover:text-[#2062A3] dark:hover:text-blue-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-200 dark:bg-blue-800"></span>
                  {dictionary.legal.center}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-3">
            <h2 className="mb-6 text-base font-medium text-slate-600 dark:text-white">
              {dictionary.home.footer.legal}
            </h2>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href={`/${lang}/legal/terms`}
                  className="flex items-center gap-2 transition-colors hover:text-[#2062A3] dark:hover:text-blue-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-200 dark:bg-blue-800"></span>
                  {dictionary.legal.nav.terms}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/legal/privacy`}
                  className="flex items-center gap-2 transition-colors hover:text-[#2062A3] dark:hover:text-blue-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-200 dark:bg-blue-800"></span>
                  {dictionary.legal.nav.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/legal/cookies`}
                  className="flex items-center gap-2 transition-colors hover:text-[#2062A3] dark:hover:text-blue-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-200 dark:bg-blue-800"></span>
                  {dictionary.legal.nav.cookies}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/legal/kvkk`}
                  className="flex items-center gap-2 transition-colors hover:text-[#2062A3] dark:hover:text-blue-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-200 dark:bg-blue-800"></span>
                  {dictionary.legal.nav.kvkk}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 md:flex-row dark:border-slate-800">
          <p className="text-sm text-slate-500 md:ml-16 dark:text-slate-400">
            {dictionary.common.copyright}{" "}
            {dictionary.legal.footer.rights_reserved}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {dictionary.home.footer.patent}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
