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
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Notes</h3>

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
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                        Happiness Index (1-10)
                    </label>
                    <div className="overflow-x-auto pb-2 pt-2">
                        <div className="flex justify-center gap-2 min-w-max px-2 py-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                                const isSelected = happinessScore === num;
                                let bgColor = 'bg-slate-100 hover:bg-slate-200';
                                let textColor = 'text-slate-600';

                                if (isSelected) {
                                    if (num <= 3) {
                                        bgColor = 'bg-red-500';
                                        textColor = 'text-white';
                                    } else if (num <= 6) {
                                        bgColor = 'bg-orange-500';
                                        textColor = 'text-white';
                                    } else if (num <= 8) {
                                        bgColor = 'bg-yellow-500';
                                        textColor = 'text-white';
                                    } else {
                                        bgColor = 'bg-green-500';
                                        textColor = 'text-white';
                                    }
                                }

                                return (
                                    <button
                                        key={num}
                                        onClick={() => onChange({ happinessScore: num })}
                                        className={`w-10 h-10 rounded-lg font-semibold transition-all flex-shrink-0 ${bgColor} ${textColor} ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                                            }`}
                                    >
                                        {num}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 px-2">
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
