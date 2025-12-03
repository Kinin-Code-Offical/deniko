import { auth } from "@/auth"
import { getInviteDetails } from "@/app/actions/student"
import { getDictionary } from "@/lib/get-dictionary"
import JoinClient from "./join-client"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DenikoLogo } from "@/components/ui/deniko-logo"
import Link from "next/link"
import { LogIn, UserPlus } from "lucide-react"

export default async function JoinPage({
    params,
}: {
    params: Promise<{ lang: "en" | "tr"; token: string }>
}) {
    const { lang, token } = await params
    const session = await auth()
    const dict = await getDictionary(lang)

    const inviteDetails = await getInviteDetails(token)

    if (!inviteDetails) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-destructive">{dict.dashboard.join.error}</p>
            </div>
        )
    }

    if (inviteDetails.isClaimed) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-muted-foreground">This invite has already been used.</p>
            </div>
        )
    }

    // 1. User NOT Logged In
    if (!session?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto bg-[#2062A3] p-3 rounded-xl w-fit mb-4 shadow-md">
                            <DenikoLogo className="h-10 w-10 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-[#2062A3]">Deniko&apos;ya Hoş Geldiniz</CardTitle>
                        <CardDescription className="text-base">
                            <span className="font-semibold text-foreground">{inviteDetails.teacherName}</span> sizi öğrencisi olarak eklemek istiyor.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            Daveti kabul etmek ve derslerinizi takip etmek için lütfen giriş yapın veya yeni bir hesap oluşturun.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button className="w-full h-11 text-base bg-[#2062A3] hover:bg-[#1a4f83]" asChild>
                            <Link href={`/${lang}/login?callbackUrl=/${lang}/join/${token}`}>
                                <LogIn className="mr-2 h-4 w-4" />
                                Giriş Yap
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full h-11 text-base" asChild>
                            <Link href={`/${lang}/register?invite=${token}`}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Kayıt Ol
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // 2. User IS Logged In
    // Fetch current user's profile for comparison
    const userProfile = await db.studentProfile.findUnique({
        where: { userId: session.user.id }
    })

    return (
        <div className="container flex h-screen items-center justify-center py-10">
            <JoinClient
                dict={dict}
                inviteDetails={inviteDetails}
                userProfile={userProfile}
                token={token}
            />
        </div>
    )
}
