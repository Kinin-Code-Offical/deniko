import {
    LayoutDashboard,
    Users,
    Calendar,
    CreditCard,
    Settings,
    BookOpen,
    FileText,
    GraduationCap,
} from "lucide-react"

export const dashboardConfig = {
    teacherNav: [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Öğrencilerim",
            href: "/dashboard/students",
            icon: Users,
        },
        {
            title: "Ders Programı",
            href: "/dashboard/schedule",
            icon: Calendar,
        },
        {
            title: "Finans",
            href: "/dashboard/finance",
            icon: CreditCard,
        },
        {
            title: "Ayarlar",
            href: "/dashboard/settings",
            icon: Settings,
        },
    ],
    studentNav: [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Derslerim",
            href: "/dashboard/lessons",
            icon: BookOpen,
        },
        {
            title: "Ödevlerim",
            href: "/dashboard/homework",
            icon: FileText,
        },
        {
            title: "Sınavlarım",
            href: "/dashboard/exams",
            icon: GraduationCap,
        },
        {
            title: "Ayarlar",
            href: "/dashboard/settings",
            icon: Settings,
        },
    ],
}
