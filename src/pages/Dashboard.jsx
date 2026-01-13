import React, { useEffect, useState, useRef } from 'react'; // Added useRef
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'; // Added ReferenceLine
import { Calendar, ChevronRight, TrendingUp, GripHorizontal } from 'lucide-react'; // Added GripHorizontal
import { db } from '../services/db';

export default function Dashboard() {
    const [entries, setEntries] = useState([]);
    const [user, setUser] = useState(null);
    const [focusThreshold, setFocusThreshold] = useState(20); // Default threshold
    const [isDragging, setIsDragging] = useState(false);
    const chartRef = useRef(null);

    useEffect(() => {
        setUser(db.getUser());
        setEntries(db.getEntries());
    }, []);

    const handleMouseMove = (e) => {
        if (isDragging && e && e.chartY) {
            // Calculate value from chartY
            // Approximating chart height (responsive container makes this tricky, but standard height is set)
            // Or better: Recharts doesn't give unlimited power here.
            // Let's use a simpler "click to set" or relative calculation if possible.
            // We can infer the domain max from data (usually slightly above max value).
            const containerHeight = 256; // h-64 = 16rem = 256px
            const chartBottomPadding = 30; // Approximation
            const chartTopPadding = 10;

            // This is tricky without exact dimensions. 
            // Let's try a simpler approach: Just update based on relative position if we can get it.
        }
    };

    // Helper to format date YYYY-MM-DD to MMMDD
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        return `${months[parseInt(parts[1]) - 1]}${parts[2]}`;
    };

    // Prepare chart data: Project allocation trends for submitted weeks
    const chartData = entries
        .filter(e => e.status === 'submitted')
        .slice(0, 12) // Last 12 entries
        .reverse()
        .map(entry => {
            const meetingHours = entry.meetings?.totalDuration || 0;
            // Assume 40h standard work week for focus calculation
            const focusHours = Math.max(0, 40 - meetingHours);
            const label = `${formatDate(entry.startDate)}-${formatDate(entry.endDate)}`;

            return {
                name: label,
                focusHours: focusHours,
                meetings: meetingHours
            };
        });

    // Calculate max value for stable Y-axis
    const maxFocus = Math.max(...chartData.map(d => d.focusHours), 40) + 5;

    // Draggable logic using simple mouse events on the chart wrapper
    const handleChartMouseDown = (e) => {
        // Only trigger if close to the current threshold line visually? 
        // Or just allow clicking anywhere to set/drag?
        // Let's rely on the Recharts onClick for simplicity or custom overlay.
        setIsDragging(true);
    };

    const handleChartMouseUp = () => {
        setIsDragging(false);
    };

    // Recharts interaction
    const onChartMouseMove = (state) => {
        if (isDragging && state) {
            // Invert Y calculation: 
            // chartY is pixels from top. 
            // We need to map [paddingTop, height - paddingBottom] -> [max, 0]
            // This is hard to get perfectly accurate without ref.
            // Let's accept a slight approximation or use a different UI pattern for "setting" if this is too flaky.
            // Actually, let's use the 'activeLabel' or any available hook if possible.
            // ...
            // Let's try a simpler robust way: 
            // Just use the chart state to find the value if available, or fallback to visual approximation.
            const plotHeight = 210; // Approx inner height
            const plotTop = 10;
            if (state.chartY !== undefined) {
                const y = state.chartY;
                const ratio = (plotHeight + plotTop - y) / plotHeight;
                const newValue = ratio * maxFocus;
                setFocusThreshold(Math.max(0, Math.min(maxFocus, newValue)));
            }
        }
    };

    return (
        <div className="space-y-6" onMouseUp={handleChartMouseUp} onMouseLeave={handleChartMouseUp}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name.split(' ')[0]}</h1>
                    <p className="text-slate-500">Here's your time reporting overview.</p>
                </div>
                <Link to="/entry/current" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                    Create New Entry
                </Link>
            </div>

            {/* Insight Card (Moved Above) */}
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

            {/* Stats / Focus Trend (Full width for 12 weeks) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 select-none">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Focus Trend (Last 12 Weeks)
                    </h3>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500">Target: <span className="font-bold">{Math.round(focusThreshold)}h</span></span>
                        <span className="text-xs text-slate-400">Drag line to adjust</span>
                    </div>
                </div>
                <div
                    className="h-64 w-full cursor-row-resize"
                    onMouseDown={handleChartMouseDown}
                >
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                onMouseMove={onChartMouseMove}
                                onClick={(state) => {
                                    if (state && state.chartY) {
                                        // Also allow click-to-set
                                        setIsDragging(true);
                                        onChartMouseMove(state);
                                        setIsDragging(false);
                                    }
                                }}
                            >
                                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} interval={0} />
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
                                >
                                </ReferenceLine>
                                <Bar dataKey="focusHours" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.focusHours >= focusThreshold ? '#bbf7d0' : '#fecaca'}
                                        />
                                    ))}
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
            <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">History</h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <ul className="divide-y divide-slate-100">
                        {entries.map((entry) => (
                            <li key={entry.id} className="hover:bg-slate-50 transition-colors">
                                <Link to={`/entry/${entry.id}`} className="block px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${entry.status === 'draft' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-slate-900">
                                                    {entry.startDate} — {entry.endDate}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5 max-w-md truncate">
                                                    {entry.status === 'draft' ? 'Draft • ' + entry.narrative?.text : entry.summary}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${entry.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {entry.status === 'draft' ? 'Draft' : 'Submitted'}
                                            </span>
                                            <ChevronRight className="ml-4 w-5 h-5 text-slate-300" />
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
