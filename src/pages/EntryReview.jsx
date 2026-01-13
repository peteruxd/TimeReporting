import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import WeekHeader from '../components/Review/WeekHeader';

import CalendarReview from '../components/Review/CalendarReview';
import ReflectionReview from '../components/Review/ReflectionReview';
import AllocationReview from '../components/Review/AllocationReview';
import NotesReview from '../components/Review/NotesReview';
import ReviewFooter from '../components/Review/ReviewFooter';

export default function EntryReview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const data = db.getEntry(id);
        if (data) {
            setEntry(data);
        }
        setLoading(false);
    }, [id]);

    const handleUpdate = (updatedFields) => {
        setEntry(prev => {
            const newEntry = { ...prev, ...updatedFields };
            // Auto-save to DB demo
            db.saveEntry(newEntry);
            return newEntry;
        });
        setHasChanges(true);
    };

    const handleSubmit = () => {
        db.submitEntry(entry.id);
        setHasChanges(false);
        navigate('/dashboard');
    };

    const handleAnalyzeReflection = () => {
        if (!entry.verbatim) return;
        setIsAnalyzing(true);
        // ... (rest of function is unchanged, but implicit handleUpdate will trigger dirty state)
        // Mock AI Delay
        setTimeout(() => {
            const text = entry.verbatim.toLowerCase();
            let newAllocations = [...entry.allocations];
            let didUpdate = false;

            // Simple Keyword Heuristics for Demo
            let newSignals = [];

            if (text.includes("design system")) {
                // Boost Design System if exists
                const target = newAllocations.find(p => p.name === "Design System");
                if (target) {
                    target.percentage += 10;
                    didUpdate = true;
                    newSignals.push("Detected focus on Design System");
                }
            } else if (text.includes("recruiting")) {
                // Add Recruiting if doesn't exist
                if (!newAllocations.find(p => p.name === "Recruiting")) {
                    newAllocations.push({ id: `p-${Date.now()}`, name: "Recruiting", percentage: 20, color: "bg-green-500" });
                    didUpdate = true;
                    newSignals.push("Added new project: Recruiting");
                }
            } else {
                // Generic "AI" adjustment
                didUpdate = true;
                // Just shuffle slightly
                newAllocations[0].percentage += 5;
                newSignals.push("Adjusted allocations based on reflection");
            }

            // Update signals
            handleUpdate({
                narrative: { ...entry.narrative, signals: newSignals }
            });


            if (didUpdate) {
                // Normalize to 100
                const total = newAllocations.reduce((sum, p) => sum + p.percentage, 0);
                if (total !== 100) {
                    const normalizeFactor = 100 / total;
                    newAllocations.forEach(p => p.percentage = Math.round(p.percentage * normalizeFactor));
                    // Fix rounding
                    const finalTotal = newAllocations.reduce((sum, p) => sum + p.percentage, 0);
                    if (finalTotal !== 100) {
                        newAllocations[0].percentage += (100 - finalTotal);
                    }
                }
                handleUpdate({ allocations: newAllocations });
            }

            setIsAnalyzing(false);
        }, 1500);
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!entry) return <div className="p-8 text-center">Entry not found</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <WeekHeader
                entry={entry}
                onDateChange={(date) => {
                    console.log("Date changed to:", date);
                    // In a real app, this would trigger a fetch for the week containing this date
                    // For demo, we just alert
                    alert(`Demo: Switched to week containing ${date}`);
                }}
            />



            <CalendarReview
                meetings={entry.meetings}
                onChange={(newMeetings) => handleUpdate({ meetings: newMeetings })}
            />

            <ReflectionReview
                verbatim={entry.verbatim}
                signals={entry.narrative?.signals}
                onChange={(text) => handleUpdate({ verbatim: text })}
                onAnalyze={{
                    onClick: handleAnalyzeReflection,
                    disabled: isAnalyzing || !entry.verbatim,
                    isAnalyzing: isAnalyzing
                }}
            />

            <AllocationReview
                allocations={entry.allocations}
                meetings={entry.meetings}
                onChange={(newAllocations) => handleUpdate({ allocations: newAllocations })}
            />

            <NotesReview
                notes={entry.narrative.autoNotes}
                wentWell={entry.narrative.wentWell}
                couldBeBetter={entry.narrative.couldBeBetter}
                happinessScore={entry.narrative.happinessScore}
                onChange={(updates) => {
                    // updates can contain: autoNotes, wentWell, couldBeBetter, happinessScore
                    handleUpdate({
                        narrative: {
                            ...entry.narrative,
                            ...updates
                        }
                    });
                }}
            />

            <ReviewFooter
                status={entry.status}
                confidence={entry.confidence}
                hasChanges={hasChanges}
                onSubmit={handleSubmit}
                onSaveDraft={() => navigate('/dashboard')}
            />
        </div>
    );
}
