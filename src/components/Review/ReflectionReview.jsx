import React, { useState } from 'react';

export default function ReflectionReview({
    verbatim,
    signals,
    onChange,
    onAnalyze
}) {
    // Local loading state for the analyze button if handled internally or passed from parent
    // The parent has `isAnalyzing` state. We can accept `isAnalyzing` as a prop.
    return (
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Your Reflection</h3>
                    <p className="text-sm text-slate-500 mt-1">Add freeform notes. AI will extract signals and adjust allocations.</p>
                </div>
                {onAnalyze && (
                    <AnalyzeButton
                        onClick={onAnalyze.onClick}
                        disabled={onAnalyze.disabled}
                        isAnalyzing={onAnalyze.isAnalyzing}
                    />
                )}
            </div>
            <textarea
                className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-900 mb-6"
                placeholder="What went well? What was challenging?"
                value={verbatim || ''}
                onChange={(e) => onChange(e.target.value)}
            />

            {/* AI Synthesis Result */}
            {(signals && signals.length > 0) && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-purple-900 mb-3">
                        <span className="bg-purple-200 p-1 rounded">
                            <svg className="w-3 h-3 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </span>
                        AI Synthesis
                    </h4>
                    <ul className="space-y-2">
                        {signals.map((signal, idx) => (
                            <li key={idx} className="flex items-start text-sm text-purple-900/80">
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 mt-1.5 shrink-0" />
                                {signal}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}

function AnalyzeButton({ onClick, disabled, isAnalyzing }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold rounded-full shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isAnalyzing ? (
                <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                </>
            ) : (
                <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Analyze with AI
                </>
            )}
        </button>
    );
}
