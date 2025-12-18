import { auth } from "@/auth";
import { getDictionary } from "@/lib/get-dictionary";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import type { Locale } from "@/i18n-config";
import { StudentHeader } from "@/components/students/student-header";
import { StudentSettingsTab } from "@/components/students/settings-tab";
import { StudentNotes } from "@/components/students/student-notes";
import { StudentExamsTab } from "@/components/students/student-exams-tab";
import { StudentAttendanceTab } from "@/components/students/student-attendance-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getStudent, type StudentDetailResponse } from "@/lib/api/students";
import { type Lesson, type Payment } from "@/types/api-models";

interface StudentPageProps {
  params: Promise<{
    lang: string;
    studentId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type StudentView = StudentDetailResponse & {
  student: StudentDetailResponse["student"] & {
    lessons: Lesson[];
    payments: Payment[];
  };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; studentId: string }>;
}): Promise<Metadata> {
  const { lang, studentId } = await params;
  const dictionary = await getDictionary(lang);

  try {
    const student = await getStudent(studentId);

    let studentName = dictionary.auth.register.student;
    if (student) {
      if (student.customName) {
        studentName = student.customName;
      } else {
        const s = student.student;
        const u = s.user;
        const first = s.tempFirstName || u?.firstName || u?.name || "";
        const last = s.tempLastName || u?.lastName || "";
        studentName = `${first} ${last}`.trim();
      }
    }

    const title = dictionary.metadata.student_detail.title.replace(
      "{name}",
      studentName
    );
    const description = dictionary.metadata.student_detail.description.replace(
      "{name}",
      studentName
    );

    const baseUrl = "https://deniko.net";
    const pathname = `/dashboard/students/${studentId}`;

    return {
      title,
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
  } catch {
    return {
      title: dictionary.metadata.student_detail.fallback_title,
      description: dictionary.metadata.student_detail.fallback_description,
    };
  }
}

export default async function StudentPage({
  params,
  searchParams,
}: StudentPageProps) {
  const { lang, studentId } = await params;
  const { tab } = await searchParams;
  const session = await auth();
  const dictionary = await getDictionary(lang as "en" | "tr");

  if (!session?.user?.id) {
    redirect(`/${lang}/login`);
  }

  let studentData;
  try {
    studentData = await getStudent(studentId);
  } catch (error) {
    console.error("Failed to fetch student:", error);
    notFound();
  }

  if (!studentData) {
    notFound();
  }

  // Construct the relation object expected by components
  const relation: StudentView = {
    ...studentData,
    student: {
      ...studentData.student,
      lessons: [],
      payments: [],
    },
  };

  const activeTab = typeof tab === "string" ? tab : "overview";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground -ml-2"
        >
          <Link href={`/${lang}/dashboard/students`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {dictionary.common?.back || "Geri"}
          </Link>
        </Button>
      </div>

      <StudentHeader
        relation={relation}
        dictionary={dictionary}
        lang={lang as Locale}
      />

      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="overview">
            {dictionary.student_detail.tabs.overview}
          </TabsTrigger>
          <TabsTrigger value="lessons">
            {dictionary.student_detail.tabs.lessons}
          </TabsTrigger>
          <TabsTrigger value="homework">
            {dictionary.student_detail.tabs.homework}
          </TabsTrigger>
          <TabsTrigger value="exams">
            {dictionary.student_detail.tabs.exams}
          </TabsTrigger>
          <TabsTrigger value="attendance">
            {dictionary.student_detail.tabs.attendance}
          </TabsTrigger>
          <TabsTrigger value="classes">
            {dictionary.student_detail.tabs.classes}
          </TabsTrigger>
          <TabsTrigger value="settings">
            {dictionary.student_detail.tabs.settings}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {dictionary.student_detail.overview.upcoming_lessons}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {relation.student.lessons.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    {dictionary.student_detail.overview.no_upcoming_lessons}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {relation.student.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-muted-foreground text-sm">
                            {new Date(lesson.startTime).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge>{lesson.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {dictionary.student_detail.overview.recent_payments}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {relation.student.payments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    {dictionary.student_detail.overview.no_recent_payments}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {relation.student.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">
                            {new Intl.NumberFormat(lang, {
                              style: "currency",
                              currency: "TRY",
                            }).format(Number(payment.amount))}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="default">{payment.type}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <StudentNotes
              studentId={studentId}
              initialNotes={relation.privateNotes}
              dictionary={dictionary}
              lang={lang}
            />
          </div>
        </TabsContent>

        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <CardTitle>{dictionary.student_detail.tabs.lessons}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {dictionary.student_detail.lessons_coming_soon}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homework">
          <Card>
            <CardHeader>
              <CardTitle>{dictionary.student_detail.tabs.homework}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {dictionary.student_detail.homework_coming_soon}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams">
          <StudentExamsTab lang={lang} dictionary={dictionary} />
        </TabsContent>

        <TabsContent value="attendance">
          <StudentAttendanceTab lang={lang} dictionary={dictionary} />
        </TabsContent>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>{dictionary.student_detail.tabs.classes}</CardTitle>
            </CardHeader>
            <CardContent>
              {relation.student.classrooms.length === 0 ? (
                <p className="text-muted-foreground">
                  {dictionary.student_detail.classes.no_classes}
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {relation.student.classrooms.map((c) => (
                    <Card key={c.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{c.name}</CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <StudentSettingsTab
            relation={relation}
            dictionary={dictionary}
            lang={lang as Locale}
            studentId={studentId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
