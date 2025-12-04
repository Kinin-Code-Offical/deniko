"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintButton({ label }: { label: string }) {
  return (
    <Button 
        variant="outline" 
        size="sm" 
        onClick={() => window.print()} 
        className="gap-2 hidden sm:flex rounded-full border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 print:hidden"
    >
      <Printer className="h-4 w-4" />
      {label}
    </Button>
  )
}
