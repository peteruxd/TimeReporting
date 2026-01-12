import React, { useState } from 'react';

export default function ReviewFooter({ status, confidence, onSubmit, onSaveDraft }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 md:pl-64 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500 font-medium hidden sm:block">Confidence:</span>
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        {['Low', 'Medium', 'High'].map((level) => (
                            <button
                                key={level}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${confidence === level
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={onSaveDraft}
                        className="flex-1 sm:flex-none px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={status === 'submitted'}
                        className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'submitted' ? 'Submitted' : 'Submit Entry'}
                    </button>
                </div>

            </div>
        </div>
    );
}
