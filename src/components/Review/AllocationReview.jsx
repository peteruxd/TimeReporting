import React from 'react';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';

export default function AllocationReview({ allocations, onChange, meetings }) {
    const workingHours = 40;
    const meetingHours = meetings?.totalDuration || 0;

    // Calculate total project hours
    const totalProjectHours = allocations.reduce((sum, item) => sum + (item.hours || 0), 0);

    // Total allocation = (project hours + meeting hours) / working hours * 100
    const totalAllocation = ((totalProjectHours + meetingHours) / workingHours) * 100;
    const isOverAllocated = totalAllocation > 100;

    const handleSliderChange = (id, newValue) => {
        const hours = Math.max(0, Math.min(40, parseFloat(newValue) || 0));
        const newAllocations = allocations.map(p =>
            p.id === id ? { ...p, hours } : p
        );
        onChange(newAllocations);
    };

    const handleNameChange = (id, newName) => {
        onChange(allocations.map(p => p.id === id ? { ...p, name: newName } : p));
    };

    const handleDelete = (id) => {
        onChange(allocations.filter(p => p.id !== id));
    };

    const handleAdd = () => {
        const id = `p-${Date.now()}`;
        onChange([...allocations, { id, name: "New Project", hours: 0, color: "bg-slate-400" }]);
    };

    const COLOR_MAP = {
        'bg-blue-500': '#3b82f6',
        'bg-purple-500': '#a855f7',
        'bg-green-500': '#22c55e',
        'bg-slate-400': '#94a3b8',
        'bg-indigo-500': '#6366f1',
        'bg-red-500': '#ef4444',
    };

    return (
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Work Allocation</h3>

            <div className="space-y-8">
                {allocations.map((project) => {
                    const hours = project.hours || 0;
                    const percentage = (hours / 40) * 100;
                    const colorHex = COLOR_MAP[project.color] || '#cbd5e1';
                    const backgroundStyle = `linear-gradient(to right, ${colorHex} 0%, ${colorHex} ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;

                    return (
                        <div key={project.id} className="space-y-4 group">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 flex-1">
                                    <span className={`w-3 h-3 rounded-full ${project.color}`} />
                                    <input
                                        type="text"
                                        value={project.name}
                                        onChange={(e) => handleNameChange(project.id, e.target.value)}
                                        className="font-medium text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-colors w-full max-w-[200px]"
                                    />
                                    {project.warning && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 shrink-0">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {project.warning}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete project"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Hours</span>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="40"
                                            value={hours}
                                            onChange={(e) => handleSliderChange(project.id, e.target.value)}
                                            className="w-16 text-right font-semibold text-slate-900 border-b border-slate-300 focus:border-blue-500 focus:outline-none bg-transparent pr-4"
                                        />
                                        <span className="absolute right-0 top-0 text-slate-400 pointer-events-none text-sm">h</span>
                                    </div>
                                </div>
                            </div>

                            <input
                                id={`slider-${project.id}`}
                                type="range"
                                min="0"
                                max="40"
                                step="0.5"
                                value={hours}
                                onChange={(e) => handleSliderChange(project.id, e.target.value)}
                                style={{ background: backgroundStyle }}
                                className={`
                                    w-full h-3 rounded-full appearance-none cursor-pointer outline-none
                                    [&::-webkit-slider-thumb]:appearance-none
                                    [&::-webkit-slider-thumb]:w-6
                                    [&::-webkit-slider-thumb]:h-6
                                    [&::-webkit-slider-thumb]:rounded-full
                                    [&::-webkit-slider-thumb]:bg-current
                                    [&::-webkit-slider-thumb]:shadow-sm
                                    [&::-webkit-slider-thumb]:border-2
                                    [&::-webkit-slider-thumb]:border-white
                                    [&::-webkit-slider-thumb]:hover:scale-110
                                    [&::-webkit-slider-thumb]:transition-transform
                                    ${project.color.replace('bg-', 'text-')}
                                `}
                            />
                        </div>
                    );
                })}

                <button
                    onClick={handleAdd}
                    className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 font-medium hover:border-slate-300 hover:text-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Project Category
                </button>

                <div className="space-y-2">
                    <div className="flex justify-between items-center p-4 rounded-lg border bg-slate-50 border-slate-200">
                        <div className="space-y-1">
                            <span className="text-sm text-slate-500 font-medium">Total Allocation</span>
                            <div className="text-xs text-slate-400">
                                {totalProjectHours.toFixed(1)}h ({((totalProjectHours / workingHours) * 100).toFixed(1)}% projects) + {meetingHours.toFixed(1)}h ({((meetingHours / workingHours) * 100).toFixed(1)}% meetings) / {workingHours}h (total working hours)
                            </div>
                        </div>
                        <span className={`text-2xl font-bold ${isOverAllocated ? 'text-red-700' : 'text-green-600'}`}>
                            {totalAllocation.toFixed(1)}%
                        </span>
                    </div>
                    {isOverAllocated && (
                        <p className="text-sm text-red-600 text-center">
                            ⚠️ Over-allocated: You've allocated more than your available working hours.
                        </p>
                    )}
                    {totalAllocation < 80 && totalAllocation > 0 && (
                        <p className="text-sm text-amber-600 text-center">
                            💡 Under-utilized: Consider allocating more time to projects.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
