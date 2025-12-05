import { i18n } from "@/i18n-config";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n-config";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  // Validate that the incoming `lang` parameter is a valid locale
  if (!i18n.locales.includes(lang as Locale)) {
    notFound();
  }
  return <>{children}</>;
}
