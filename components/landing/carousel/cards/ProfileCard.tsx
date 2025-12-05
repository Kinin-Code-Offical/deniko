import React from "react";
import { GraduationCap, TrendingUp } from "lucide-react";

interface ProfileCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dictionary: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ dictionary }) => {
  const t = dictionary.home.mock_dashboard;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white p-6 transition-colors dark:bg-slate-900">
      {/* Header */}
      <div className="z-10 mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-3 dark:bg-blue-900/20">
            <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              {t.graphic_profile}
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {t.graphic_performance}
            </p>
          </div>
        </div>
      </div>

      {/* Main Stat */}
      <div className="z-10 mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-bold tracking-widest text-gray-400 uppercase dark:text-slate-500">
            {t.attendance}
          </p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            94%
          </h1>
        </div>
        <div className="mb-1 rounded-full bg-blue-50 p-3 dark:bg-blue-900/10">
          <TrendingUp className="h-6 w-6 text-blue-500 dark:text-blue-400" />
        </div>
      </div>

      {/* Sub Stats */}
      <div className="z-10 space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase dark:text-slate-500">
            {t.students}
          </span>
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            48
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase dark:text-slate-500">
            {t.classes_today}
          </span>
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            12
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase dark:text-slate-500">
            {t.completed}
          </span>
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            68
          </span>
        </div>
      </div>

      {/* Decorative Background Blur */}
      {/* Decorative Background Blur - Removed for performance */}
      {/* <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div> */}
    </div>
  );
};

export default ProfileCard;
