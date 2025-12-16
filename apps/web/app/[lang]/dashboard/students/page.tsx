import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/get-dictionary";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import { AddStudentDialog } from "@/components/students/add-student-dialog";
import { StudentTable } from "@/components/students/student-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudents } from "@/lib/api/students";
import { getClassrooms } from "@/lib/api/classrooms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseUrl = "https://deniko.net";
  const pathname = "/dashboard/students";

  return {
    title: dict.metadata.students.title,
    description: dict.metadata.students.description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${lang}${pathname}`,
      languages: {
        "tr-TR": `/tr${pathname}`,
        "en-US": `/en${pathname}`,
      },
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

export default async function StudentsPage({
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

  const [students, classrooms] = await Promise.all([
    getStudents(),
    getClassrooms(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {dictionary.dashboard.students.title}
        </h2>
        <AddStudentDialog dictionary={dictionary} classrooms={classrooms} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{dictionary.dashboard.students.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentTable data={students} dictionary={dictionary} lang={lang} />
        </CardContent>
      </Card>
    </div>
  );
}
