import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { VerifyClient } from "@/components/auth/verify-client";
import { getDictionary } from "@/lib/get-dictionary";
import type { Locale } from "@/i18n-config";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 p-4 transition-colors dark:bg-slate-950">
      <Suspense
        fallback={
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
        }
      >
        <VerifyClient lang={lang} dictionary={dictionary} />
      </Suspense>
    </div>
  );
}
