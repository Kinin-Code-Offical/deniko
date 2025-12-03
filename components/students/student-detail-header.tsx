"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { InviteButton } from "./invite-button"

interface StudentDetailHeaderProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    student: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dictionary: any
    totalLessons: number
    balance: number
    lang: string
}

export function StudentDetailHeader({ student, dictionary, totalLessons, balance, lang }: StudentDetailHeaderProps) {
    const isClaimed = student.isClaimed
    const displayName = student.userId
        ? (student.user?.name || `${student.user?.firstName} ${student.user?.lastName}`)
        : `${student.tempFirstName} ${student.tempLastName}`

    const initials = displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={student.user?.image || ""} />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold">{displayName}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Badge variant={isClaimed ? "default" : "secondary"}>
                            {isClaimed
                                ? dictionary.dashboard.student_detail.header.status.active
                                : dictionary.dashboard.student_detail.header.status.shadow}
                        </Badge>
                        {student.gradeLevel && <span>• {student.gradeLevel}</span>}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {!isClaimed && student.inviteToken && (
                    <InviteButton
                        token={student.inviteToken}
                        lang={lang}
                        dictionary={dictionary}
                    />
                )}

                <Card className="w-full sm:w-auto">
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className="text-center">
                            <div className="text-xs text-muted-foreground">
                                {dictionary.dashboard.student_detail.header.total_lessons}
                            </div>
                            <div className="text-xl font-bold">{totalLessons}</div>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="text-center">
                            <div className="text-xs text-muted-foreground">
                                {dictionary.dashboard.student_detail.header.balance}
                            </div>
                            <div className={`text-xl font-bold ${balance < 0 ? "text-destructive" : "text-primary"}`}>
                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(balance)}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
