"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface StudentData {
    id: string
    name: string
    email?: string | null
    status: string
    studentNo: string | null
    inviteToken: string | null
    isClaimed: boolean
    gradeLevel: string | null
}

interface StudentTableProps {
    data: StudentData[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dictionary: any
    lang: string
}

export function StudentTable({ data, dictionary, lang }: StudentTableProps) {
    const copyInviteLink = (token: string) => {
        const url = `${window.location.origin}/${lang}/join/${token}`
        navigator.clipboard.writeText(url)
        toast.success(lang === 'tr' ? "Davet linki kopyalandı" : "Invite link copied")
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{dictionary.dashboard.students.table.name}</TableHead>
                    <TableHead>{dictionary.dashboard.students.table.status}</TableHead>
                    <TableHead>{dictionary.dashboard.students.table.student_no}</TableHead>
                    <TableHead>{dictionary.dashboard.students.table.grade}</TableHead>
                    <TableHead className="text-right">{dictionary.dashboard.students.table.actions}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((student) => (
                    <TableRow key={student.id}>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-medium">{student.name}</span>
                                {student.email && (
                                    <span className="text-xs text-muted-foreground">{student.email}</span>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            {student.isClaimed ? (
                                <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                    {lang === 'tr' ? 'Onaylı' : 'Verified'}
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                                    {lang === 'tr' ? 'Davet Bekliyor' : 'Pending Invite'}
                                </Badge>
                            )}
                        </TableCell>
                        <TableCell>{student.studentNo || "-"}</TableCell>
                        <TableCell>{student.gradeLevel || "-"}</TableCell>
                        <TableCell className="text-right">
                            {!student.isClaimed && student.inviteToken && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyInviteLink(student.inviteToken!)}
                                >
                                    <Copy className="mr-2 h-4 w-4" />
                                    {lang === 'tr' ? 'Davet Linki' : 'Invite Link'}
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
