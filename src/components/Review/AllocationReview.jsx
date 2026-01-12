import React from 'react';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';

import ReconciliationHint from './ReconciliationHint';

export default function AllocationReview({ allocations, onChange, meetings }) {
    const total = allocations.reduce((sum, item) => sum + item.percentage, 0);
    const isValid = total === 100;

    const handleSliderChange = (id, newValue) => {
        const value = Math.max(0, Math.min(100, parseInt(newValue) || 0));
        const diff = value - allocations.find(p => p.id === id).percentage;

        if (diff === 0) return;

        let newAllocations = allocations.map(p => ({ ...p }));
        const targetProject = newAllocations.find(p => p.id === id);
        targetProject.percentage = value;

        const others = newAllocations.filter(p => p.id !== id);
        const totalOthers = others.reduce((sum, p) => sum + p.percentage, 0);

        if (totalOthers > 0) {
            others.forEach(p => {
                const ratio = p.percentage / totalOthers;
                p.percentage = Math.max(0, Math.round(p.percentage - (diff * ratio)));
            });

            // Fix rounding errors to ensure 100%
            const newTotal = newAllocations.reduce((sum, p) => sum + p.percentage, 0);
            if (newTotal !== 100) {
                const remainder = 100 - newTotal;
                const largestOther = others.reduce((prev, curr) => (prev.percentage > curr.percentage) ? prev : curr, others[0]);
                if (largestOther) {
                    largestOther.percentage += remainder;
                } else {
                    targetProject.percentage += remainder;
                }
            }
        } else {
            if (diff < 0 && others.length > 0) {
                others[0].percentage += (100 - (value));
            }
        }
        onChange(newAllocations);
    };

    const handleNameChange = (id, newName) => {
        onChange(allocations.map(p => p.id === id ? { ...p, name: newName } : p));
    };

    const handleDelete = (id) => {
        const toDelete = allocations.find(p => p.id === id);
        const others = allocations.filter(p => p.id !== id);

        if (others.length === 0) {
            onChange([]);
            return;
        }

        const totalOthers = others.reduce((sum, p) => sum + p.percentage, 0);
        let newAllocations = others.map(p => ({ ...p }));

        if (toDelete.percentage > 0 && totalOthers > 0) {
            newAllocations.forEach(p => {
                const share = p.percentage / totalOthers;
                p.percentage += Math.round(toDelete.percentage * share);
            });

            const newTotal = newAllocations.reduce((sum, p) => sum + p.percentage, 0);
            if (newTotal !== 100) {
                newAllocations[0].percentage += (100 - newTotal);
            }
        } else if (toDelete.percentage > 0 && totalOthers === 0) {
            newAllocations[0].percentage += toDelete.percentage;
        }

        onChange(newAllocations);
    };

    const handleAdd = () => {
        const id = `p-${Date.now()}`;
        onChange([...allocations, { id, name: "New Project", percentage: 0, color: "bg-slate-400" }]);
    };

    const COLOR_MAP = {
        'bg-blue-500': '#3b82f6',
        'bg-purple-500': '#a855f7',
        'bg-green-500': '#22c55e',
        'bg-slate-400': '#94a3b8',
        'bg-indigo-500': '#6366f1',
        'bg-red-500': '#ef4444',
    };


    const handleSuggestionApply = () => {
        // Demo logic: just boost "Project 2" (or "Design System" if exists)
        // This is a placeholder for real logic
        const newAllocations = allocations.map(p => ({ ...p }));
        if (newAllocations.length > 1) {
            // For demo, just modify the second project
            newAllocations[1].percentage += 10;
            // Naive normalization for demo
            const total = newAllocations.reduce((sum, p) => sum + p.percentage, 0);
            if (total !== 100) {
                newAllocations[0].percentage -= 10;
            }
        }
        onChange(newAllocations);
    };

    return (
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Work Allocation</h3>

            {meetings && (
                <ReconciliationHint
                    meetings={meetings}
                    allocations={allocations}
                    onApplySuggestion={handleSuggestionApply}
                />
            )}

            <div className="mt-8 space-y-8">
                {allocations.map((project) => {
                    const colorHex = COLOR_MAP[project.color] || '#cbd5e1';
                    const backgroundStyle = `linear-gradient(to right, ${colorHex} 0%, ${colorHex} ${project.percentage}%, #e2e8f0 ${project.percentage}%, #e2e8f0 100%)`;

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
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Estimated</span>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={project.percentage}
                                            onChange={(e) => handleSliderChange(project.id, e.target.value)}
                                            className="w-16 text-right font-semibold text-slate-900 border-b border-slate-300 focus:border-blue-500 focus:outline-none bg-transparent"
                                        />
                                        <span className="absolute right-0 top-0 text-slate-400 pointer-events-none">%</span>
                                    </div>
                                </div>
                            </div>

                            <input
                                id={`slider-${project.id}`}
                                type="range"
                                min="0"
                                max="100"
                                value={project.percentage}
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

                <div className={`flex justify-between items-center p-4 rounded-lg border ${isValid ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-200'
                    }`}>
                    <span className="text-sm text-slate-500 font-medium">Total Allocation</span>
                    <span className={`text-lg font-bold ${isValid ? 'text-slate-900' : 'text-red-600'}`}>
                        {total}%
                    </span>
                </div>
                {!isValid && (
                    <p className="text-sm text-red-600 text-center">
                        Total must equal 100%. Please adjust the sliders.
                    </p>
                )}
            </div>
        </section>
    );
}
