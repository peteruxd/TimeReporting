export const MOCK_USER = {
    id: "u1",
    name: "Alex Designer",
    email: "alex@example.com",
    avatar: "https://ui.avatars.com/api/?name=Alex+Designer&background=2563eb&color=fff"
};

const PAST_WEEKS = [
    {
        id: "w-2025-52",
        startDate: "2025-12-25",
        endDate: "2025-12-31",
        status: "submitted",
        confidence: "High",
        summary: "End of year wrap up, focus on Q1 planning.",
        projects: [
            { name: "Time Reporting App", allocation: 40, color: "bg-blue-500" },
            { name: "Design System", allocation: 60, color: "bg-purple-500" }
        ],
        meetings: { totalDuration: 12.0 } // 40 - 12 = 28 Focus Hours
    },
    {
        id: "w-2025-51",
        startDate: "2025-12-18",
        endDate: "2025-12-24",
        status: "submitted",
        confidence: "Medium",
        summary: "Heavy meeting week, mostly interviewing.",
        projects: [
            { name: "Recruiting", allocation: 50, color: "bg-green-500" },
            { name: "Time Reporting App", allocation: 30, color: "bg-blue-500" },
            { name: "Admin", allocation: 20, color: "bg-slate-400" }
        ],
        meetings: { totalDuration: 22.5 } // 40 - 22.5 = 17.5 Focus Hours
    },
    {
        id: "w-2025-50",
        startDate: "2025-12-11",
        endDate: "2025-12-17",
        status: "submitted",
        confidence: "High",
        summary: "Heads down coding week.",
        projects: [
            { name: "Time Reporting App", allocation: 80, color: "bg-blue-500" },
            { name: "Admin", allocation: 20, color: "bg-slate-400" }
        ],
        meetings: { totalDuration: 8.0 } // 40 - 8 = 32 Focus Hours
    }
];

export const DRAFT_WEEK = {
    id: "w-2026-01",
    startDate: "2026-01-01",
    endDate: "2026-01-07",
    status: "draft",
    confidence: "Medium",
    aiNote: "Estimated from reflection and calendar",
    narrative: {
        text: "I spent most of the week deep diving into the new Time Reporting project. I feels like Project 2 took longer than expected because of the complexity in the reviews. Also had a lot of design syncs.",
        signals: [
            "Worked across 3 projects",
            "Project 2 (Design System) took longer than expected",
            "Heavy design sync load"
        ],
        autoNotes: [
            { id: "n1", text: "TBs not definitive for Thursday", type: "friction" },
            { id: "n2", text: "Mentioned blocking on API", type: "friction" }
        ]
    },
    allocations: [
        { id: "p1", name: "Time Reporting App", percentage: 40, color: "bg-blue-500", isOverrun: false },
        { id: "p2", name: "Design System", percentage: 40, color: "bg-purple-500", isOverrun: true, warning: "Took longer than expected" },
        { id: "p3", name: "Internal Infra", percentage: 20, color: "bg-indigo-500", isOverrun: false }
    ],
    meetings: {
        totalDuration: 14.5, // hours
        categories: {
            "Operational": 2.5,
            "Product-Design": 5.0,
            "Design-Engineering": 6.0,
            "Design-Internal": 1.0,
            "External": 0.0
        },
        events: [
            { id: "m1", title: "Weekly Sync", duration: 1.0, category: "Operational", date: "Jan 1" },
            { id: "m2", title: "Design Review: Flows", duration: 2.0, category: "Product-Design", date: "Jan 2" },
            { id: "m3", title: "Eng Handover", duration: 1.5, category: "Design-Engineering", date: "Jan 3" },
            { id: "m4", title: "Team Retro", duration: 1.0, category: "Design-Internal", date: "Jan 5" },
            { id: "m5", title: "1:1 with Manager", duration: 0.5, category: "Operational", date: "Jan 2" }
        ]
    }
};

export const INITIAL_DB_STATE = {
    user: MOCK_USER,
    entries: [DRAFT_WEEK, ...PAST_WEEKS]
};
