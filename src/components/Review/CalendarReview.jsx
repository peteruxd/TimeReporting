import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronRight, XCircle, RefreshCw, Edit2, Trash2, Plus, Check, X } from 'lucide-react';

export default function CalendarReview({ meetings, onChange }) {
    const [expandedGroups, setExpandedGroups] = useState({});
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingHours, setEditingHours] = useState(null);
    const [tempCategoryName, setTempCategoryName] = useState('');
    const [tempHours, setTempHours] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryHours, setNewCategoryHours] = useState('');

    const toggleGroup = (category) => {
        setExpandedGroups(prev => ({ ...prev, [category]: !prev[category] }));
    };

    // Group events by category
    const eventsByCategory = meetings.events.reduce((acc, event) => {
        const cat = event.category || 'Unclassified';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(event);
        return acc;
    }, {});

    const categories = Object.keys(meetings.categories);

    // Update category hours
    const updateCategoryHours = (oldCategory, newHours) => {
        const hours = parseFloat(newHours);
        if (isNaN(hours) || hours < 0) return;

        const newCategories = { ...meetings.categories, [oldCategory]: hours };
        const newTotalDuration = Object.values(newCategories).reduce((sum, h) => sum + h, 0);

        onChange({
            ...meetings,
            categories: newCategories,
            totalDuration: newTotalDuration
        });
        setEditingHours(null);
    };

    // Rename category
    const renameCategory = (oldName, newName) => {
        if (!newName.trim() || newName === oldName) {
            setEditingCategory(null);
            return;
        }

        // Update categories object
        const newCategories = { ...meetings.categories };
        newCategories[newName] = newCategories[oldName];
        delete newCategories[oldName];

        // Update events that reference this category
        const newEvents = meetings.events.map(event =>
            event.category === oldName ? { ...event, category: newName } : event
        );

        onChange({
            ...meetings,
            categories: newCategories,
            events: newEvents
        });
        setEditingCategory(null);
    };

    // Delete category
    const deleteCategory = (categoryName) => {
        if (!confirm(`Delete category "${categoryName}"? Associated events will be marked as Unclassified.`)) {
            return;
        }

        const newCategories = { ...meetings.categories };
        delete newCategories[categoryName];

        // Update events - set to Unclassified
        const newEvents = meetings.events.map(event =>
            event.category === categoryName ? { ...event, category: 'Unclassified' } : event
        );

        const newTotalDuration = Object.values(newCategories).reduce((sum, h) => sum + h, 0);

        onChange({
            ...meetings,
            categories: newCategories,
            events: newEvents,
            totalDuration: newTotalDuration
        });
    };

    // Add new category
    const addCategory = () => {
        if (!newCategoryName.trim()) return;

        const hours = parseFloat(newCategoryHours) || 0;
        if (hours < 0) return;

        const newCategories = { ...meetings.categories, [newCategoryName.trim()]: hours };
        const newTotalDuration = Object.values(newCategories).reduce((sum, h) => sum + h, 0);

        onChange({
            ...meetings,
            categories: newCategories,
            totalDuration: newTotalDuration
        });

        setIsAddingCategory(false);
        setNewCategoryName('');
        setNewCategoryHours('');
    };

    // Calculate hours for summary
    const workingHours = 40;
    const meetingHours = meetings.totalDuration || 0;
    const focusHours = Math.max(0, workingHours - meetingHours);

    const handleFetchCalendar = () => {
        // TODO: Implement Google Calendar API integration
        alert('Calendar fetch functionality will be implemented here. This will connect to Google Calendar API to fetch meeting data.');
    };

    return (
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Calendar Review</h3>
                <button
                    onClick={handleFetchCalendar}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    Fetch from Calendar
                </button>
            </div>
            <div className="space-y-6">
                {/* Summary Header */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                        <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Working Hours</span>
                        <span className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            {workingHours.toFixed(1)}h
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Meeting Hours</span>
                        <span className="text-xl font-bold text-slate-900">
                            {meetingHours.toFixed(1)}h
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Focus Hours</span>
                        <span className="text-xl font-bold text-green-600">
                            {focusHours.toFixed(1)}h
                        </span>
                    </div>
                </div>

                {/* Detailed List */}
                <div className="space-y-4">
                    {categories.map((category) => {
                        const categoryEvents = eventsByCategory[category] || [];
                        if (categoryEvents.length === 0) return null;
                        const isExpanded = expandedGroups[category];

                        return (
                            <div key={category} className="border border-slate-200 rounded-lg overflow-hidden group/category">
                                <div className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
                                    <button
                                        onClick={() => toggleGroup(category)}
                                        className="flex items-center gap-3 flex-1"
                                    >
                                        {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}

                                        {editingCategory === category ? (
                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="text"
                                                    value={tempCategoryName}
                                                    onChange={(e) => setTempCategoryName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') renameCategory(category, tempCategoryName);
                                                        if (e.key === 'Escape') setEditingCategory(null);
                                                    }}
                                                    className="px-2 py-1 border border-blue-500 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => renameCategory(category, tempCategoryName)}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingCategory(null)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="font-medium text-slate-900">{category}</span>
                                        )}

                                        {editingHours === category ? (
                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    value={tempHours}
                                                    onChange={(e) => setTempHours(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') updateCategoryHours(category, tempHours);
                                                        if (e.key === 'Escape') setEditingHours(null);
                                                    }}
                                                    className="w-16 px-2 py-0.5 border border-blue-500 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    autoFocus
                                                />
                                                <span className="text-xs">h</span>
                                                <button
                                                    onClick={() => updateCategoryHours(category, tempHours)}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                >
                                                    <Check className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingHours(null)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span
                                                className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full cursor-pointer hover:bg-slate-200"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingHours(category);
                                                    setTempHours(meetings.categories[category].toString());
                                                }}
                                            >
                                                {meetings.categories[category].toFixed(1)}h
                                            </span>
                                        )}
                                    </button>

                                    <div className="flex items-center gap-2 opacity-0 group-hover/category:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingCategory(category);
                                                setTempCategoryName(category);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50"
                                            title="Rename category"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(category)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                                            title="Delete category"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="bg-slate-50/50 border-t border-slate-200 divide-y divide-slate-100">
                                        {categoryEvents.map(event => (
                                            <div key={event.id} className="p-4 pl-12 flex items-center justify-between group">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{event.title}</p>
                                                    <p className="text-xs text-slate-500">{event.date} • {event.duration}h</p>
                                                </div>

                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50" title="Reclassify">
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50" title="Exclude">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Add Category Button */}
                    {isAddingCategory ? (
                        <div className="border border-blue-500 rounded-lg p-4 bg-blue-50/50">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Category name"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') addCategory();
                                        if (e.key === 'Escape') {
                                            setIsAddingCategory(false);
                                            setNewCategoryName('');
                                            setNewCategoryHours('');
                                        }
                                    }}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="Hours"
                                    value={newCategoryHours}
                                    onChange={(e) => setNewCategoryHours(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') addCategory();
                                        if (e.key === 'Escape') {
                                            setIsAddingCategory(false);
                                            setNewCategoryName('');
                                            setNewCategoryHours('');
                                        }
                                    }}
                                    className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={addCategory}
                                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    title="Add"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        setIsAddingCategory(false);
                                        setNewCategoryName('');
                                        setNewCategoryHours('');
                                    }}
                                    className="p-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                                    title="Cancel"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAddingCategory(true)}
                            className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Add Category</span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
