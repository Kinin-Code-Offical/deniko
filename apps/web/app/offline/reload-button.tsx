"use client";

export function ReloadButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => window.location.reload()}
      className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
    >
      {label}
    </button>
  );
}
