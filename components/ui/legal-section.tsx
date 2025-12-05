"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface LegalSectionProps {
  title: string
  content: string
}

function parseInline(text: string) {
  // Split by **bold** and *italic* markers
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index} className="italic text-slate-700 dark:text-slate-300">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function formatText(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('* ')) {
      // List item
      const content = trimmed.substring(2);
      currentList.push(
        <li key={`li-${i}`} className="ml-4 pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500 dark:before:text-blue-400">
            <span className="block">{parseInline(content)}</span>
        </li>
      );
    } else {
      // Flush list if exists
      if (currentList.length > 0) {
        elements.push(<ul key={`ul-${i}`} className="mb-4 space-y-2 text-slate-600 dark:text-slate-300">{currentList}</ul>);
        currentList = [];
      }
      
      if (trimmed === '') {
        // elements.push(<br key={`br-${i}`} />); // Skip empty lines for cleaner spacing
      } else {
        elements.push(<p key={`p-${i}`} className="mb-3 last:mb-0">{parseInline(line)}</p>);
      }
    }
  });

  // Flush remaining list
  if (currentList.length > 0) {
    elements.push(<ul key={`ul-end`} className="mb-4 space-y-2 text-slate-600 dark:text-slate-300">{currentList}</ul>);
  }

  return elements;
}

export function LegalSection({ title, content }: LegalSectionProps) {
  const [isActive, setIsActive] = useState(false)

  const handleCopy = async () => {
    const textToCopy = `${title}\n\n${content}`
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsActive(true)
      toast.success("Kopyalandı / Copied", {
        description: "Bölüm panoya kopyalandı. / Section copied to clipboard."
      })
      
      // Keep active state for a bit to show feedback
      setTimeout(() => setIsActive(false), 2000) 
    } catch {
      toast.error("Hata / Error", {
        description: "Kopyalama başarısız. / Copy failed."
      })
    }
  }

  return (
    <div 
      onClick={handleCopy}
      className={cn(
        "group relative p-6 sm:p-8 -mx-4 sm:-mx-8 rounded-3xl transition-all duration-300 cursor-pointer border mb-4 print:border-none print:p-0 print:mx-0 print:mb-6",
        isActive 
          ? "bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm" 
          : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
      )}
    >
      <div className="flex items-center justify-between mb-4 print:mb-2">
        <h2 className={cn(
          "text-xl sm:text-2xl font-bold transition-colors pr-4 print:text-black print:text-lg",
          isActive ? "text-blue-700 dark:text-blue-300" : "text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
        )}>
          {title}
        </h2>
        <div className={cn(
            "shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 print:hidden",
            isActive 
                ? "bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-200 scale-110" 
                : "opacity-0 group-hover:opacity-100 bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 shadow-sm"
        )}>
            {isActive ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        </div>
      </div>
      
      <div className={cn(
        "leading-relaxed text-base sm:text-lg transition-colors print:text-black print:text-sm",
        isActive ? "text-blue-900/80 dark:text-blue-100/80" : "text-slate-600 dark:text-slate-300"
      )}>
        {formatText(content)}
      </div>
    </div>
  )
}
