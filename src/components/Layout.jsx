import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PenTool, LogOut, History, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../services/db';

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = db.getUser();

    const handleLogout = () => {
        navigate('/');
    };

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Review Entry', icon: PenTool, path: '/entry/current' },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 bg-white border-r border-slate-200">
                <div className="flex items-center h-16 flex-shrink-0 px-6 bg-white border-b border-slate-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">T</div>
                    <span className="text-lg font-bold text-slate-900 tracking-tight">TimeReport</span>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
                    <nav className="mt-2 flex-1 px-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={cn(
                                        isActive
                                            ? "bg-slate-100 text-blue-600"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                                        "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all"
                                    )}
                                >
                                    <item.icon className={cn(
                                        isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500",
                                        "mr-3 flex-shrink-0 h-5 w-5"
                                    )} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex-shrink-0 flex border-t border-slate-200 p-4">
                    <div className="flex items-center w-full">
                        <div>
                            <img className="inline-block h-9 w-9 rounded-full" src={user?.avatar} alt="" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                            <p className="text-xs font-medium text-slate-500 cursor-pointer hover:text-red-500" onClick={handleLogout}>Sign out</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 md:pl-64 h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto focus:outline-none bg-slate-50/50">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
