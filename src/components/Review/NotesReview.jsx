import React from 'react';
import { Trash2, PenLine, GripVertical } from 'lucide-react';

export default function NotesReview({ notes, wentWell, couldBeBetter, happinessScore, onChange }) {
    const handleDelete = (id) => {
        onChange({ autoNotes: notes.filter(n => n.id !== id) });
    };

    const handleNoteTextChange = (id, newText) => {
        onChange({
            autoNotes: notes.map(n => n.id === id ? { ...n, text: newText } : n)
        });
    };

    return (
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Notes & Friction</h3>

            <div className="space-y-6">
                {/* Reflection Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            What went well this week?
                        </label>
                        <textarea
                            value={wentWell || ''}
                            onChange={(e) => onChange({ wentWell: e.target.value })}
                            className="w-full h-32 p-3 text-sm text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Highlights, achievements, good vibes..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            What could have been better?
                        </label>
                        <textarea
                            value={couldBeBetter || ''}
                            onChange={(e) => onChange({ couldBeBetter: e.target.value })}
                            className="w-full h-32 p-3 text-sm text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Blockers, distractions, room for improvement..."
                        />
                    </div>
                </div>

                {/* Happiness Index */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                        Happiness Index (1-10)
                    </label>
                    <div className="flex items-center justify-center gap-5 overflow-x-auto p-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
                            // Determine color classes based on score
                            let colorClasses = '';
                            if (score <= 3) { // 1-3: Red
                                colorClasses = happinessScore === score
                                    ? 'bg-red-200 text-red-900 border-red-400 ring-2 ring-red-400 ring-offset-2'
                                    : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
                            } else if (score <= 6) { // 4-6: Orange
                                colorClasses = happinessScore === score
                                    ? 'bg-orange-200 text-orange-900 border-orange-400 ring-2 ring-orange-400 ring-offset-2'
                                    : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
                            } else if (score <= 8) { // 7-8: Yellow
                                colorClasses = happinessScore === score
                                    ? 'bg-yellow-200 text-yellow-900 border-yellow-400 ring-2 ring-yellow-400 ring-offset-2'
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
                            } else { // 9-10: Green
                                colorClasses = happinessScore === score
                                    ? 'bg-green-200 text-green-900 border-green-400 ring-2 ring-green-400 ring-offset-2'
                                    : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
                            }

                            return (
                                <button
                                    key={score}
                                    onClick={() => onChange({ happinessScore: score })}
                                    className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-bold border transition-all ${colorClasses}
                                        ${happinessScore === score ? 'scale-110 shadow-sm' : ''}
                                    `}
                                >
                                    {score}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
                        <span>Rough week</span>
                        <span>Best week ever</span>
                    </div>
                </div>

                {/* Existing Auto Notes */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-slate-700">Auto-detected Friction</h4>
                    {notes.map((note) => (
                        <div key={note.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg group">
                            <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    defaultValue={note.text}
                                    onChange={(e) => handleNoteTextChange(note.id, e.target.value)}
                                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-700 focus:text-slate-900 p-0"
                                />
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded">
                                    <PenLine className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button className="text-sm text-blue-600 font-medium hover:text-blue-700 pl-8">
                        + Add note manually
                    </button>
                </div>
            </div>
        </section>
    );
}
