"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, MoveLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import en from "@/dictionaries/en.json";
import tr from "@/dictionaries/tr.json";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  const isEnglish = pathname?.startsWith("/en");

  const dict = isEnglish ? en.not_found : tr.not_found;

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-slate-50 font-sans transition-colors dark:bg-slate-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[50%] w-[50%] rounded-full bg-blue-200/35 blur-[120px] dark:bg-blue-900/25" />
        <div className="absolute top-[40%] -right-[10%] h-[40%] w-[40%] rounded-full bg-indigo-200/35 blur-[120px] dark:bg-indigo-900/30" />
        <div className="absolute bottom-[10%] left-[20%] h-[30%] w-[30%] rounded-full bg-sky-200/35 blur-[100px] dark:bg-sky-900/25" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        <div className="mb-10 flex justify-center">
          <div className="group relative">
            <div className="absolute inset-0 rounded-full bg-blue-200 opacity-50 blur-xl transition-opacity duration-500 group-hover:opacity-75 dark:bg-blue-900" />
            <div className="relative transform rounded-full border border-slate-100 bg-white p-8 shadow-2xl transition-transform duration-300 group-hover:scale-105 dark:border-slate-800 dark:bg-slate-900">
              <FileQuestion className="h-20 w-20 text-blue-600 dark:text-blue-400" />
            </div>

            {/* Floating elements */}
            <div className="absolute -top-2 -right-2 animate-bounce rounded-full bg-indigo-100 p-2 delay-100">
              <div className="h-3 w-3 rounded-full bg-indigo-500" />
            </div>
            <div className="absolute -bottom-1 -left-2 animate-bounce rounded-full bg-sky-100 p-2 delay-300">
              <div className="h-2 w-2 rounded-full bg-sky-500" />
            </div>
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
          {dict.title}
        </h1>

        <p className="mb-8 text-lg font-medium text-slate-600 dark:text-slate-300">
          {dict.heading}
        </p>

        <p className="mx-auto mb-10 max-w-md text-slate-500 dark:text-slate-400">
          {dict.description}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="group border-slate-200 bg-white/50 text-slate-700 hover:bg-white hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50"
          >
            <MoveLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {dict.go_back}
          </Button>

          <Button
            asChild
            size="lg"
            className="bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-600/35 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {dict.home}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
