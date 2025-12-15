"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalSectionProps {
  title: string;
  content: string;
  labels: {
    copied: string;
    copied_desc: string;
    error: string;
    copy_failed: string;
  };
}

function parseInline(text: string) {
  // Split by **bold** and *italic* markers
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong
          key={index}
          className="font-bold text-slate-900 dark:text-slate-100"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="text-slate-700 italic dark:text-slate-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

function formatText(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("* ")) {
      // List item
      const content = trimmed.substring(2);
      currentList.push(
        <li
          key={`li-${i}`}
          className="relative ml-4 pl-2 before:absolute before:left-0 before:text-blue-500 before:content-['•'] dark:before:text-blue-400"
        >
          <span className="block">{parseInline(content)}</span>
        </li>
      );
    } else {
      // Flush list if exists
      if (currentList.length > 0) {
        elements.push(
          <ul
            key={`ul-${i}`}
            className="mb-4 space-y-2 text-slate-600 dark:text-slate-300"
          >
            {currentList}
          </ul>
        );
        currentList = [];
      }

      if (trimmed === "") {
        // elements.push(<br key={`br-${i}`} />); // Skip empty lines for cleaner spacing
      } else {
        elements.push(
          <p key={`p-${i}`} className="mb-3 last:mb-0">
            {parseInline(line)}
          </p>
        );
      }
    }
  });

  // Flush remaining list
  if (currentList.length > 0) {
    elements.push(
      <ul
        key={`ul-end`}
        className="mb-4 space-y-2 text-slate-600 dark:text-slate-300"
      >
        {currentList}
      </ul>
    );
  }

  return elements;
}

export function LegalSection({ title, content, labels }: LegalSectionProps) {
  const [isActive, setIsActive] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `${title}\n\n${content}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsActive(true);
      toast.success(labels.copied, {
        description: labels.copied_desc,
      });

      // Keep active state for a bit to show feedback
      setTimeout(() => setIsActive(false), 2000);
    } catch {
      toast.error(labels.error, {
        description: labels.copy_failed,
      });
    }
  };

  return (
    <div
      onClick={handleCopy}
      className={cn(
        "group relative -mx-4 mb-4 cursor-pointer rounded-3xl border p-6 transition-all duration-300 sm:-mx-8 sm:p-8 print:mx-0 print:mb-6 print:border-none print:p-0",
        isActive
          ? "border-blue-200 bg-blue-50/80 shadow-sm dark:border-blue-800 dark:bg-blue-900/20"
          : "border-transparent bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
      )}
    >
      <div className="mb-4 flex items-center justify-between print:mb-2">
        <h2
          className={cn(
            "pr-4 text-xl font-bold transition-colors sm:text-2xl print:text-lg print:text-black",
            isActive
              ? "text-blue-700 dark:text-blue-300"
              : "text-slate-800 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400"
          )}
        >
          {title}
        </h2>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 print:hidden",
            isActive
              ? "scale-110 bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
              : "bg-white text-slate-400 opacity-0 shadow-sm group-hover:opacity-100 dark:bg-slate-700 dark:text-slate-300"
          )}
        >
          {isActive ? (
            <Check className="h-5 w-5" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </div>
      </div>

      <div
        className={cn(
          "text-base leading-relaxed transition-colors sm:text-lg print:text-sm print:text-black",
          isActive
            ? "text-blue-900/80 dark:text-blue-100/80"
            : "text-slate-600 dark:text-slate-300"
        )}
      >
        {formatText(content)}
      </div>
    </div>
  );
}
