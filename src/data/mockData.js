export const MOCK_USER = {
    id: "u1",
    name: "Alex Designer",
    email: "alex@example.com",
    avatar: "https://ui.avatars.com/api/?name=Alex+Designer&background=2563eb&color=fff"
};

const generatePastWeeks = () => {
    const weeks = [];
    const baseDate = new Date("2025-12-25"); // Start from week 52 backwards

    for (let i = 0; i < 11; i++) { // Generate 11 past weeks to make 12 total with draft
        const start = new Date(baseDate);
        start.setDate(baseDate.getDate() - (i * 7));
        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        const weekNum = 52 - i;
        const id = `w-2025-${weekNum.toString().padStart(2, '0')}`;

        // Randomize meeting hours between 5 and 25
        const meetingHours = Math.floor(Math.random() * 20) + 5;

        weeks.push({
            id,
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
            status: "submitted",
            confidence: ["High", "Medium"][Math.floor(Math.random() * 2)],
            summary: `Weekly report for Week ${weekNum}`,
            projects: [
                { name: "Time Reporting App", allocation: 40, color: "bg-blue-500" },
                { name: "Design System", allocation: 60, color: "bg-purple-500" }
            ],
            meetings: { totalDuration: meetingHours }
        });
    }
    return weeks;
};

const PAST_WEEKS = generatePastWeeks();

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
