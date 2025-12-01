"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { claimStudentProfile } from "@/app/actions/student"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function JoinCard({ token, studentName, teacherName, lang }: { token: string, studentName: string, teacherName: string, lang: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleJoin = async () => {
        setLoading(true)
        try {
            const result = await claimStudentProfile(token)
            if (result.success) {
                toast.success("Successfully joined the class!")
                router.push(`/${lang}/dashboard`)
            } else {
                toast.error(result.error || "Failed to join")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{lang === 'tr' ? 'Davetiyeyi Kabul Et' : 'Accept Invitation'}</CardTitle>
                <CardDescription>
                    {lang === 'tr'
                        ? `Sayın ${studentName}, ${teacherName} sizi öğrencisi olarak eklemek istiyor.`
                        : `Dear ${studentName}, ${teacherName} wants to add you as a student.`
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    {lang === 'tr'
                        ? "Kabul ederek bu sınıfa katılacak ve derslerinizi buradan takip edebileceksiniz."
                        : "By accepting, you will join this class and be able to track your lessons here."
                    }
                </p>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleJoin} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {lang === 'tr' ? 'Kabul Et ve Birleştir' : 'Accept and Join'}
                </Button>
            </CardFooter>
        </Card>
    )
}
