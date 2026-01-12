import React from 'react';
import { Calendar, ShieldCheck } from 'lucide-react';

export default function WeekHeader({ entry, onDateChange }) {
    const pickerRef = React.useRef(null);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2 text-sm text-slate-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span>Weekly Review</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Date Picker Trigger using showPicker() */}
                    <div className="relative group flex items-center gap-2">
                        <input
                            ref={pickerRef}
                            type="date"
                            className="w-0 h-0 opacity-0 absolute"
                            onChange={(e) => onDateChange && onDateChange(e.target.value)}
                        />
                        <button
                            onClick={() => pickerRef.current?.showPicker()}
                            className="text-3xl font-bold text-slate-900 group-hover:underline decoration-slate-300 decoration-2 underline-offset-4 cursor-pointer bg-transparent border-none p-0 text-left"
                            title="Click to change week"
                        >
                            {entry.startDate} — {entry.endDate}
                        </button>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                        {entry.status}
                    </span>
                </div>
            </div>
            <div className="flex items-center mt-1 text-sm text-slate-500 bg-blue-50/50 p-2 rounded-lg border border-blue-100 self-start">
                <ShieldCheck className="w-4 h-4 mr-2 text-blue-500" />
                {entry.aiNote}
            </div>
        </div>
    );
}
