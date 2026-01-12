import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Sparkles } from 'lucide-react';

export default function NarrativeReview({ narrative }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full">
            <div
                className="p-6 cursor-pointer hover:bg-slate-50 transition-colors flex items-start justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start space-x-4">
                    <div className="mt-1 bg-purple-100 p-2 rounded-lg">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-slate-900">Narrative Understanding</h3>
                        <p className="text-slate-500 mt-1 max-w-xl">
                            {isExpanded
                                ? "Reviewing the full narrative and extracted signals."
                                : "You mentioned working across 3 projects, with Project 2 taking longer than expected."}
                        </p>
                    </div>
                </div>
                <button className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </button>
            </div>

            {isExpanded && (
                <div className="px-6 pb-8 pl-[4.5rem]">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                        <div className="flex items-start gap-3">
                            <MessageSquare className="w-4 h-4 text-slate-400 mt-1" />
                            <p className="text-slate-700 italic">"{narrative.text}"</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Extracted Signals</h4>
                        <ul className="space-y-2">
                            {narrative.signals.map((signal, idx) => (
                                <li key={idx} className="flex items-center text-sm text-slate-700">
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3" />
                                    {signal}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
