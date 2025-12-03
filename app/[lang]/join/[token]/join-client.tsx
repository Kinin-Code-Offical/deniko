"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { claimStudentProfile } from "@/app/actions/student"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface JoinClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dict: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inviteDetails: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userProfile: any
    token: string
}

export default function JoinClient({ dict, inviteDetails, userProfile, token }: JoinClientProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [preferences, setPreferences] = useState({
        useTeacherGrade: true,
        useTeacherParentInfo: true,
        useTeacherClassroom: true
    })

    const handleClaim = async () => {
        setLoading(true)
        try {
            const res = await claimStudentProfile(token, preferences)
            if (res.success) {
                toast.success(dict.dashboard.join.success)
                router.push("/dashboard")
            } else {
                toast.error(res.error || dict.dashboard.join.error)
            }
        } catch {
            toast.error(dict.dashboard.join.error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>{dict.dashboard.join.title}</CardTitle>
                <CardDescription>
                    {dict.dashboard.join.desc} ({inviteDetails.teacherName})
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Grade / Student No Comparison */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <h4 className="font-medium text-muted-foreground">{dict.dashboard.join.teacher_data}</h4>
                        <div className="rounded-md border p-3 text-sm">
                            <p><span className="font-semibold">{dict.dashboard.join.conflict_grade}:</span> {inviteDetails.gradeLevel || "-"} / {inviteDetails.studentNo || "-"}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-muted-foreground">{dict.dashboard.join.your_data}</h4>
                        <div className="rounded-md border p-3 text-sm">
                            <p><span className="font-semibold">{dict.dashboard.join.conflict_grade}:</span> {userProfile?.gradeLevel || "-"} / {userProfile?.studentNo || "-"}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="useTeacherGrade"
                        checked={preferences.useTeacherGrade}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, useTeacherGrade: checked as boolean }))}
                    />
                    <Label htmlFor="useTeacherGrade">{dict.dashboard.join.keep_teacher_data}</Label>
                </div>

                <div className="border-t my-4" />

                {/* Parent Info Comparison */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <h4 className="font-medium text-muted-foreground">{dict.dashboard.join.teacher_data}</h4>
                        <div className="rounded-md border p-3 text-sm">
                            <p>{inviteDetails.parentName || "-"}</p>
                            <p>{inviteDetails.parentPhone || "-"}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-muted-foreground">{dict.dashboard.join.your_data}</h4>
                        <div className="rounded-md border p-3 text-sm">
                            <p>{userProfile?.parentName || "-"}</p>
                            <p>{userProfile?.parentPhone || "-"}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="useTeacherParentInfo"
                        checked={preferences.useTeacherParentInfo}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, useTeacherParentInfo: checked as boolean }))}
                    />
                    <Label htmlFor="useTeacherParentInfo">{dict.dashboard.join.keep_teacher_data}</Label>
                </div>

            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                    {dict.dashboard.join.reject}
                </Button>
                <Button onClick={handleClaim} disabled={loading}>
                    {loading ? "..." : dict.dashboard.join.accept_merge}
                </Button>
            </CardFooter>
        </Card>
    )
}
