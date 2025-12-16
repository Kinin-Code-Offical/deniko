import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell";
import { getDictionary } from "@/lib/get-dictionary";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: {
      default: dict.metadata.dashboard.title,
      template: `%s | ${dict.common.brand_name}`,
    },
    description: dict.metadata.dashboard.description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const dictionary = await getDictionary(lang as Locale);
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${lang}/login`);
  }

  const { user } = session;

  // Enforce Onboarding Completion
  if (!user.isOnboardingCompleted) {
    redirect(`/${lang}/onboarding`);
  }

  // Construct user object for client components
  // We pass minimal required data. Avatar URL is constructed on client or here.
  // To ensure consistency, we can just pass the raw image field (to check existence)
  // and let the client helper construct the URL, OR construct it here.
  // The user wants: "/api/avatar/${userId}?v=${avatarVersion}"

  const userForClient = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image, // Pass raw value to determine if avatar exists
    role: user.role,
    username: user.username,
    avatarVersion: user.avatarVersion,
  };

  return (
    <DashboardShell user={userForClient} dictionary={dictionary} lang={lang}>
      {children}
    </DashboardShell>
  );
}
