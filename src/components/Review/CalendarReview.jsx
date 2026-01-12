import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronRight, XCircle, RefreshCw } from 'lucide-react';

export default function CalendarReview({ meetings, onChange }) {
    const [expandedGroups, setExpandedGroups] = useState({});

    const toggleGroup = (category) => {
        setExpandedGroups(prev => ({ ...prev, [category]: !prev[category] }));
    };

    // Group events by category
    const eventsByCategory = meetings.events.reduce((acc, event) => {
        const cat = event.category || 'Unclassified';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(event);
        return acc;
    }, {});

    const categories = Object.keys(meetings.categories);

    return (
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Calendar Review</h3>
            <div className="space-y-6">
                {/* Summary Header */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                        <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Total Time</span>
                        <span className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            {meetings.totalDuration}h
                        </span>
                    </div>
                    {Object.entries(meetings.categories).slice(0, 3).map(([cat, hours]) => (
                        <div key={cat}>
                            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1 truncate">{cat}</span>
                            <span className="text-lg font-semibold text-slate-700">{hours}h</span>
                        </div>
                    ))}
                </div>

                {/* Detailed List */}
                <div className="space-y-4">
                    {categories.map((category) => {
                        const categoryEvents = eventsByCategory[category] || [];
                        if (categoryEvents.length === 0) return null;
                        const isExpanded = expandedGroups[category];

                        return (
                            <div key={category} className="border border-slate-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleGroup(category)}
                                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                                        <span className="font-medium text-slate-900">{category}</span>
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                            {meetings.categories[category]}h
                                        </span>
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="bg-slate-50/50 border-t border-slate-200 divide-y divide-slate-100">
                                        {categoryEvents.map(event => (
                                            <div key={event.id} className="p-4 pl-12 flex items-center justify-between group">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{event.title}</p>
                                                    <p className="text-xs text-slate-500">{event.date} • {event.duration}h</p>
                                                </div>

                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50" title="Reclassify">
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50" title="Exclude">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
