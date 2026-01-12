import React from 'react';
import { Lightbulb, Check } from 'lucide-react';

export default function ReconciliationHint({ meetings, allocations, onApplySuggestion }) {
    // Mock logic: Check if "Design-Engineering" meetings > 10% of time and no allocation for "Project 2" (or whatever)
    // For demo, we just hardcode the hint conditions to match the prompt story.

    const showHint = true; // Hardcoded for demo state

    if (!showHint) return null;

    return (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-4 shadow-sm animate-fade-in">
            <div className="bg-white p-2 rounded-full shadow-sm mt-1">
                <Lightbulb className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-indigo-900 text-sm">Review Suggestion</h4>
                <p className="text-indigo-800 text-sm mt-1 leading-relaxed">
                    You spent significant time (6h) in <b>Design–Engineering</b> meetings.
                    Would you like to increase your allocation for <b>Design System</b> to reflect this?
                </p>
                <div className="mt-3 flex items-center gap-3">
                    <button
                        onClick={onApplySuggestion}
                        className="flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Check className="w-3 h-3 mr-1.5" />
                        Apply Update
                    </button>
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2">
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
