import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface ScheduleCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dictionary: any
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ dictionary }) => {
  const t = dictionary.home.mock_dashboard;
  
  return (
    <div className="w-full h-full p-6 flex flex-col bg-white dark:bg-slate-900 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 tracking-widest uppercase mb-1">{t.schedule}</h3>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">12 {t.math}</h2>
        </div>
        <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-xl">
          <Calendar className="w-5 h-5 text-orange-500 dark:text-orange-400" />
        </div>
      </div>

      {/* Timeline Items */}
      <div className="flex-1 space-y-4">
        {/* Active Item */}
        <div className="flex gap-4 p-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex flex-col justify-center items-center min-w-[50px]">
            <span className="text-sm font-semibold text-gray-600 dark:text-slate-300">09:00</span>
          </div>
          <div className="flex-1 border-l-2 border-blue-500 pl-4">
            <h4 className="font-bold text-gray-800 dark:text-white">{t.math}</h4>
            <div className="flex items-center text-xs text-gray-500 dark:text-slate-400 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {t.room} 301
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex gap-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-transparent">
          <div className="flex flex-col justify-center items-center min-w-[50px]">
            <span className="text-sm font-semibold text-gray-500 dark:text-slate-400">11:30</span>
          </div>
          <div className="flex-1 border-l-2 border-gray-300 dark:border-slate-600 pl-4">
            <h4 className="font-bold text-gray-700 dark:text-slate-200">{t.physics}</h4>
            <div className="flex items-center text-xs text-gray-400 dark:text-slate-500 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {t.room} 205
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex gap-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-transparent">
          <div className="flex flex-col justify-center items-center min-w-[50px]">
            <span className="text-sm font-semibold text-gray-500 dark:text-slate-400">13:00</span>
          </div>
          <div className="flex-1 border-l-2 border-gray-300 dark:border-slate-600 pl-4">
            <h4 className="font-bold text-gray-700 dark:text-slate-200">{t.chemistry}</h4>
            <div className="flex items-center text-xs text-gray-400 dark:text-slate-500 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {t.lab} 2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
