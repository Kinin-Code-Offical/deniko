import type { Metadata } from "next";
import { getDictionary } from "@/lib/get-dictionary";
import { i18n } from "@/i18n-config";
import { ReloadButton } from "./reload-button";

export const metadata: Metadata = {
  title: "Offline",
};

export default async function Offline() {
  const dictionary = await getDictionary(i18n.defaultLocale);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 text-center dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {dictionary.offline.title}
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {dictionary.offline.description}
      </p>
      <ReloadButton label={dictionary.offline.retry} />
    </div>
  );
}
