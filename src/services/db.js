import { INITIAL_DB_STATE } from "../data/mockData";

const DB_KEY = "timereporting_db_v2";

export const db = {
    init: () => {
        if (!localStorage.getItem(DB_KEY)) {
            localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DB_STATE));
        }
    },

    getAll: () => {
        db.init();
        const data = JSON.parse(localStorage.getItem(DB_KEY));
        // Simple migration check: 
        // 1. if entries have 'projects' instead of 'allocations'
        // 2. if entries have 'meetings' but missing 'categories'
        if (data.entries.some(e => (e.projects && !e.allocations) || (e.meetings && !e.meetings.categories))) {
            console.log("Detected stale data schema. Resetting DB...");
            localStorage.removeItem(DB_KEY);
            db.init();
            return JSON.parse(localStorage.getItem(DB_KEY));
        }
        return data;
    },

    getUser: () => {
        const data = db.getAll();
        return data.user;
    },

    getEntries: () => {
        const data = db.getAll();
        return data.entries;
    },

    getEntry: (id) => {
        const entries = db.getEntries();
        return entries.find(e => e.id === id);
    },

    saveEntry: (updatedEntry) => {
        const data = db.getAll();
        const index = data.entries.findIndex(e => e.id === updatedEntry.id);
        if (index !== -1) {
            data.entries[index] = updatedEntry;
            localStorage.setItem(DB_KEY, JSON.stringify(data));
            return updatedEntry;
        }
        return null;
    },

    submitEntry: (id) => {
        const entry = db.getEntry(id);
        if (entry) {
            entry.status = "submitted";
            return db.saveEntry(entry);
        }
        return null;
    },

    reset: () => {
        localStorage.removeItem(DB_KEY);
        db.init();
    }
};
