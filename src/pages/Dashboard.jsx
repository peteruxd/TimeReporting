import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList } from 'recharts';
import { Calendar, ChevronRight, TrendingUp, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { db } from '../services/db';

export default function Dashboard() {
    const [entries, setEntries] = useState([]);
    const [user, setUser] = useState(null);
    const [focusThreshold, setFocusThreshold] = useState(20);
    const [isThresholdOpen, setIsThresholdOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setUser(db.getUser());
        setEntries(db.getEntries());

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsThresholdOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper to format date range as "YYYY MMDD-MMDD"
    const formatDateRange = (startDate, endDate) => {
        if (!startDate || !endDate) return '';
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const startParts = startDate.split('-');
        const endParts = endDate.split('-');

        if (startParts.length !== 3 || endParts.length !== 3) return `${startDate} — ${endDate}`;

        const year = startParts[0];
        const startMonth = months[parseInt(startParts[1]) - 1];
        const startDay = startParts[2];
        const endMonth = months[parseInt(endParts[1]) - 1];
        const endDay = endParts[2];

        return `${year} ${startMonth}${startDay}-${endMonth}${endDay}`;
    };

    // Helper to truncate text
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    // Prepare shared data for Chart and History (Last 12 submitted entries)
    const recentEntries = entries
        .filter(e => e.status === 'submitted')
        .slice(0, 12); // Take last 12

    // Sort for Chart: Oldest to Newest (Left to Right)
    const chartData = [...recentEntries]
        .reverse()
        .map(entry => {
            const meetingHours = entry.meetings?.totalDuration || 0;
            const focusHours = Math.max(0, 40 - meetingHours);

            // Split date range for two-line display
            const startParts = entry.startDate.split('-');
            const endParts = entry.endDate.split('-');
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            const year = startParts[0];
            const startMonth = months[parseInt(startParts[1]) - 1];
            const startDay = startParts[2];
            const endMonth = months[parseInt(endParts[1]) - 1];
            const endDay = endParts[2];
            const dateRange = `${startMonth}${startDay}-${endMonth}${endDay}`;

            return {
                name: `${year}\n${dateRange}`, // Two-line label
                year: year,
                dateRange: dateRange,
                focusHours: focusHours,
                meetings: meetingHours
            };
        });

    const maxFocus = Math.max(...chartData.map(d => d.focusHours), 40) + 5;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name.split(' ')[0]}</h1>
                    <p className="text-slate-500">Here's your insights overview.</p>
                </div>
                <Link to="/entry/current" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                    Create New Entry
                </Link>
            </div>

            {/* Insight Card */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl shadow-sm text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-semibold text-white/90 mb-1">Weekly Insight</h3>
                    <p className="text-2xl font-bold mb-4">Design System Focus</p>
                    <p className="text-white/80 text-sm leading-relaxed mb-6">
                        You've spent 25% more time on "Design System" compared to last month. Consider whether this aligns with your quarterly goals.
                    </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                    <TrendingUp className="w-48 h-48" />
                </div>
            </div>

            {/* Stats / Focus Trend */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 select-none">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Focus Trend (Last 12 Weeks)
                    </h3>

                    {/* Threshold Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsThresholdOpen(!isThresholdOpen)}
                            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-slate-200"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Target: {focusThreshold}h
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>

                        {isThresholdOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-20">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-700">Focus Target</span>
                                    <span className="text-sm font-bold text-blue-600">{focusThreshold}h</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="40"
                                    step="1"
                                    value={focusThreshold}
                                    onChange={(e) => setFocusThreshold(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-slate-400 mt-2">
                                    <span>0h</span>
                                    <span>40h</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-64 w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 10, bottom: 60, left: 0 }}>
                                <XAxis
                                    dataKey="name"
                                    tick={({ x, y, payload }) => {
                                        const lines = payload.value.split('\n');
                                        return (
                                            <g transform={`translate(${x},${y})`}>
                                                <g transform="rotate(-45)">
                                                    <text
                                                        x={0}
                                                        y={0}
                                                        dy={0}
                                                        textAnchor="end"
                                                        fill="#64748b"
                                                        fontSize={9}
                                                        fontWeight="500"
                                                    >
                                                        {lines[0]}
                                                    </text>
                                                    <text
                                                        x={0}
                                                        y={10}
                                                        dy={0}
                                                        textAnchor="end"
                                                        fill="#64748b"
                                                        fontSize={9}
                                                    >
                                                        {lines[1]}
                                                    </text>
                                                </g>
                                            </g>
                                        );
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                    height={60}
                                />
                                <YAxis hide domain={[0, maxFocus]} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <ReferenceLine
                                    y={focusThreshold}
                                    stroke="#94a3b8"
                                    strokeDasharray="3 3"
                                    isFront={true}
                                />
                                <Bar dataKey="focusHours" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.focusHours >= focusThreshold ? '#bbf7d0' : '#fecaca'}
                                        />
                                    ))}
                                    <LabelList dataKey="focusHours" position="top" fill="#64748b" fontSize={10} formatter={(v) => `${v}h`} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                            No data yet
                        </div>
                    )}
                </div>
            </div>

            {/* Recent History */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        Recent History
                    </h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {recentEntries.map(entry => {
                        // Calculate total allocation for this entry
                        const workingHours = 40;
                        const projectHours = entry.allocations?.reduce((sum, item) => sum + (item.hours || 0), 0) || 0;
                        const meetingHours = entry.meetings?.totalDuration || 0;
                        const totalAllocation = ((projectHours + meetingHours) / workingHours) * 100;
                        const isOverAllocated = totalAllocation > 100;

                        return (
                            <div key={entry.id}>
                                <Link to={`/entry/${entry.id}`} className="block px-6 py-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-slate-900">{formatDateRange(entry.startDate, entry.endDate)}</span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${entry.status === 'submitted'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {entry.status === 'submitted' ? 'Submitted' : 'Draft'}
                                                </span>
                                            </div>
                                            {entry.narrative?.text && (
                                                <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                                                    {entry.narrative.text.substring(0, 80)}...
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 ml-4">
                                            {/* Total Allocation */}
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-slate-400">Allocation:</span>
                                                <span className={`text-sm font-semibold ${isOverAllocated ? 'text-red-600' : 'text-green-600'}`}>
                                                    {totalAllocation.toFixed(0)}%
                                                </span>
                                            </div>
                                            {/* Happiness Score */}
                                            {entry.narrative?.happinessScore && (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs text-slate-400">Happiness:</span>
                                                    <span className={`text-sm font-semibold ${entry.narrative.happinessScore <= 3 ? 'text-red-600' :
                                                            entry.narrative.happinessScore <= 6 ? 'text-orange-600' :
                                                                entry.narrative.happinessScore <= 8 ? 'text-yellow-600' :
                                                                    'text-green-600'
                                                        }`}>
                                                        {entry.narrative.happinessScore}/10
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                    {recentEntries.length === 0 && (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            No entries found. Create your first weekly report!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
