import React from "react"

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
    return (
        <div className={`relative flex items-center justify-center rounded-full bg-blue-600 text-white font-bold ${className}`}>
            <span className="text-xl">D</span>
        </div>
    )
}
