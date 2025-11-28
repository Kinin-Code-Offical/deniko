import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/shell"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            teacherProfile: true,
            studentProfile: true,
        },
    })

    if (!user) {
        redirect("/login")
    }

    // If user has no role or no profile, redirect to onboarding
    if (
        !user.role ||
        (user.role === "TEACHER" && !user.teacherProfile) ||
        (user.role === "STUDENT" && !user.studentProfile)
    ) {
        redirect("/onboarding")
    }

    return (
        <DashboardShell user={user}>
            {children}
        </DashboardShell>
    )
}
