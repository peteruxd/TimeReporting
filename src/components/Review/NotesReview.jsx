import React from 'react';
import { Trash2, PenLine, GripVertical } from 'lucide-react';

export default function NotesReview({ notes, onChange }) {
    const handleDelete = (id) => {
        onChange(notes.filter(n => n.id !== id));
    };

    return (
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Notes & Friction</h3>
            <div className="space-y-4">
                {notes.map((note) => (
                    <div key={note.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg group">
                        <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
                        <div className="flex-1">
                            <input
                                type="text"
                                defaultValue={note.text}
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
        </section>
    );
}
