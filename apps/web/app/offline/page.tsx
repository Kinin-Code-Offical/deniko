import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
};

export default function Offline() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 text-center dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        You are offline
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Please check your internet connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      >
        Retry
      </button>
    </div>
  );
}
