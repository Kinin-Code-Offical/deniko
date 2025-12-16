import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/get-dictionary";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { internalApiFetch } from "@/lib/internal-api";

const TeacherView = dynamic(
  () =>
    import("@/components/dashboard/teacher-view").then(
      (mod) => mod.TeacherView
    ),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
    ),
  }
);

const StudentView = dynamic(
  () =>
    import("@/components/dashboard/student-view").then(
      (mod) => mod.StudentView
    ),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
    ),
  }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const session = await auth();
  const role = session?.user?.role;
  const userName =
    session?.user?.name || (role === "STUDENT" ? "Student" : "Teacher");

  const titleTemplate =
    role === "STUDENT"
      ? dictionary.metadata.dashboard.student_title
      : dictionary.metadata.dashboard.teacher_title;

  const title = titleTemplate.replace("{name}", userName);

  const { description } = dictionary.metadata.dashboard;

  const baseUrl = "https://deniko.net";
  const pathname = "/dashboard";

  return {
    title, // Template in layout.tsx will add "| Deniko"
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${lang}${pathname}`,
      languages: {
        "tr-TR": `/tr${pathname}`,
        "en-US": `/en${pathname}`,
      },
    },
    openGraph: {
      title: `${title} | Deniko`,
      description,
    },
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

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const dictionary = await getDictionary(lang as Locale);
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${lang}/login`);
  }

  const res = await internalApiFetch("/dashboard", {
    headers: { "x-user-id": session.user.id },
  });

  if (!res.ok) {
    redirect(`/${lang}/login`);
  }

  const data = await res.json();

  if (data.needsOnboarding) {
    redirect(`/${lang}/onboarding`);
  }

  if (data.role === "TEACHER") {
    return (
      <TeacherView
        dictionary={dictionary}
        lang={lang}
        stats={data.stats}
        schedule={data.schedule}
      />
    );
  }

  if (data.role === "STUDENT") {
    return (
      <StudentView
        dictionary={dictionary}
        lang={lang}
        stats={data.stats}
        nextLesson={data.nextLesson}
        upcomingLessons={data.upcomingLessons}
        pendingHomeworks={data.pendingHomeworks}
      />
    );
  }

  // Fallback for other roles or no role
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">
        {dictionary.dashboard.welcome_title}
      </h1>
      <p className="text-muted-foreground">
        {dictionary.dashboard.contact_support}
      </p>
    </div>
  );
}
