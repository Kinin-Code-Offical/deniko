import React from 'react';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';

interface AssignmentsCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dictionary: any
}

const AssignmentsCard: React.FC<AssignmentsCardProps> = ({ dictionary }) => {
  const t = dictionary.home.mock_dashboard;

  return (
    <div className="w-full h-full p-6 flex flex-col bg-white dark:bg-slate-900 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 tracking-widest uppercase mb-1">{t.assignments}</h3>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t.assignments_pending}</h2>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-xl">
          <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 space-y-4">
        {/* Item 1 */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/20 group hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <span className="bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">{t.math}</span>
            <Clock className="w-4 h-4 text-purple-400 dark:text-purple-500" />
          </div>
          <h4 className="font-bold text-gray-800 dark:text-white mb-1">{t.assignment_math_title}</h4>
          <p className="text-xs text-gray-500 dark:text-slate-400">{t.due_tomorrow}</p>
        </div>

        {/* Item 2 */}
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl hover:border-purple-200 dark:hover:border-purple-900/50 transition-colors cursor-pointer">
           <div className="flex justify-between items-start mb-2">
            <span className="bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-300 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">{t.physics}</span>
            <CheckCircle2 className="w-4 h-4 text-gray-300 dark:text-slate-600" />
          </div>
          <h4 className="font-bold text-gray-700 dark:text-slate-200 mb-1">{t.assignment_physics_title}</h4>
          <p className="text-xs text-gray-400 dark:text-slate-500">{t.due_3days}</p>
        </div>
        
         {/* Item 3 */}
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl hover:border-purple-200 dark:hover:border-purple-900/50 transition-colors cursor-pointer">
           <div className="flex justify-between items-start mb-2">
            <span className="bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-300 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">{t.literature}</span>
            <CheckCircle2 className="w-4 h-4 text-gray-300 dark:text-slate-600" />
          </div>
          <h4 className="font-bold text-gray-700 dark:text-slate-200 mb-1">{t.assignment_lit_title}</h4>
          <p className="text-xs text-gray-400 dark:text-slate-500">{t.completed}</p>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsCard;
