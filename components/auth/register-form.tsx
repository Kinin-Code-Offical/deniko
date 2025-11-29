"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, User, GraduationCap, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PhoneInput } from "@/components/ui/phone-input"
import { DenikoLogo } from "@/components/ui/deniko-logo"
import { registerUser } from "@/app/actions/auth"
import { LanguageSwitcher } from "@/components/ui/language-switcher"

interface RegisterFormProps {
    dictionary: any
    lang: string
}

export function RegisterForm({ dictionary, lang }: RegisterFormProps) {
    const d = dictionary.auth.register
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const registerSchema = z.object({
        firstName: z.string().min(2, d.validation.first_name_min),
        lastName: z.string().min(2, d.validation.last_name_min),
        email: z.string().email(d.validation.email_invalid),
        phoneNumber: z.string().min(10, d.validation.phone_min),
        role: z.enum(["TEACHER", "STUDENT"], {
            required_error: d.validation.role_required,
        }),
        password: z.string()
            .min(8, d.validation.password_min)
            .regex(/[A-Z]/, d.validation.password_regex)
            .regex(/[a-z]/, d.validation.password_regex)
            .regex(/[0-9]/, d.validation.password_regex)
            .regex(/[^A-Za-z0-9]/, d.validation.password_regex),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: d.validation.password_mismatch,
        path: ["confirmPassword"],
    })

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            role: undefined,
            password: "",
            confirmPassword: "",
        },
    })

    function onSubmit(values: z.infer<typeof registerSchema>) {
        startTransition(async () => {
            try {
                const result = await registerUser(values, lang)
                if (result.success) {
                    setSuccess(true)
                    toast.success(d.success_title)
                } else {
                    toast.error(result.message)
                }
            } catch (error) {
                toast.error("An error occurred")
            }
        })
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
                <Card className="w-full max-w-md text-center shadow-lg border-slate-200 relative">
                    <div className="absolute top-4 right-4">
                        <LanguageSwitcher />
                    </div>
                    <CardHeader>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-900">{d.success_title}</CardTitle>
                        <CardDescription className="text-slate-600">
                            {d.success_desc}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button asChild variant="outline" className="w-full">
                            <Link href={`/${lang}/login`}>{d.login_link}</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4 py-10">
            <Card className="w-full max-w-2xl shadow-xl border-slate-200 relative">
                <div className="absolute top-4 right-4">
                    <LanguageSwitcher />
                </div>
                <CardHeader className="space-y-2 text-center">
                    <div className="flex justify-center mb-2">
                        <DenikoLogo className="h-12 w-12 text-[#2062A3]" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-900">{d.title}</CardTitle>
                    <CardDescription className="text-slate-600 text-lg">
                        {d.subtitle}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Role Selection */}
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="text-base font-semibold text-slate-900">{d.role_select}</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                            >
                                                <FormItem>
                                                    <FormControl>
                                                        <RadioGroupItem value="STUDENT" className="peer sr-only" />
                                                    </FormControl>
                                                    <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-slate-50 hover:text-accent-foreground peer-data-[state=checked]:border-[#2062A3] peer-data-[state=checked]:text-[#2062A3] cursor-pointer transition-all">
                                                        <GraduationCap className="mb-3 h-8 w-8" />
                                                        <span className="text-lg font-bold">{d.student}</span>
                                                        <span className="text-sm text-muted-foreground text-center mt-1">{d.student_desc}</span>
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem>
                                                    <FormControl>
                                                        <RadioGroupItem value="TEACHER" className="peer sr-only" />
                                                    </FormControl>
                                                    <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-slate-50 hover:text-accent-foreground peer-data-[state=checked]:border-[#2062A3] peer-data-[state=checked]:text-[#2062A3] cursor-pointer transition-all">
                                                        <User className="mb-3 h-8 w-8" />
                                                        <span className="text-lg font-bold">{d.teacher}</span>
                                                        <span className="text-sm text-muted-foreground text-center mt-1">{d.teacher_desc}</span>
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{d.first_name}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={d.first_name} {...field} className="h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{d.last_name}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={d.last_name} {...field} className="h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{d.email}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ornek@email.com" type="email" {...field} className="h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{d.phone}</FormLabel>
                                            <FormControl>
                                                <PhoneInput
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{d.password}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="******" type="password" {...field} className="h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{d.password_confirm}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="******" type="password" {...field} className="h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg bg-[#2062A3] hover:bg-[#1a4f83] transition-colors"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        {d.submitting}
                                    </>
                                ) : (
                                    d.submit
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="justify-center pb-8">
                    <p className="text-sm text-slate-600">
                        {d.have_account}{" "}
                        <Link href={`/${lang}/login`} className="text-[#2062A3] font-semibold hover:underline">
                            {d.login_link}
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
