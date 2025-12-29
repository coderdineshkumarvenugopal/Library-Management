import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAnalyticsStats, useAnalyticsTrends, useTopUsers, useRecentActivity } from '../hooks/useLibrary';
import { motion } from 'framer-motion';
import { FaBook, FaUsers, FaArrowUp, FaArrowDown, FaHistory, FaTrophy } from 'react-icons/fa';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

const AnalyticsDashboard: React.FC = () => {
    const { data: stats } = useAnalyticsStats();
    const { data: trends } = useAnalyticsTrends();
    const { data: topUsers } = useTopUsers();
    const { data: activity } = useRecentActivity();

    const pieData = stats?.genreDistribution
        ? Object.entries(stats.genreDistribution).map(([name, value]) => ({ name, value }))
        : [];

    return (
        <div className="space-y-8 p-6 bg-gray-950 min-h-screen text-white">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Library Insights
                    </h1>
                    <p className="text-gray-400 mt-2">Real-time system health and user engagement</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center gap-3">
                        <div className="bg-blue-500/20 p-2 rounded-lg"><FaBook className="text-blue-400" /></div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Books</p>
                            <p className="text-xl font-bold">{stats?.totalBooks || 0}</p>
                        </div>
                    </div>
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center gap-3">
                        <div className="bg-purple-500/20 p-2 rounded-lg"><FaUsers className="text-purple-400" /></div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Users</p>
                            <p className="text-xl font-bold">{stats?.totalUsers || 0}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            Activity Trends
                        </h2>
                        <div className="flex gap-4 text-xs">
                            <span className="flex items-center gap-1 text-blue-400"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Borrows</span>
                            <span className="flex items-center gap-1 text-purple-400"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Returns</span>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends}>
                                <defs>
                                    <linearGradient id="colorBorrows" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="borrows" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorBorrows)" />
                                <Area type="monotone" dataKey="returns" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorReturns)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Genre Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl"
                >
                    <h2 className="text-xl font-bold mb-8">Genre Distribution</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Users */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FaTrophy className="text-yellow-500" /> Leaderboard
                    </h2>
                    <div className="space-y-4">
                        {topUsers?.map((u, i) => (
                            <div key={u.userId} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-sm">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold">{u.userName}</p>
                                        <p className="text-xs text-gray-500">User ID: #{u.userId}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-blue-400">{u.borrowCount}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Borrows</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl max-h-[500px] overflow-hidden flex flex-col"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FaHistory className="text-indigo-400" /> System Activity
                    </h2>
                    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                        {activity?.map((act, i) => (
                            <div key={act.id + i} className="relative pl-8 border-l-2 border-white/10 pb-2 last:pb-0">
                                <div className={`absolute -left-[9px] top-0 p-1 rounded-full ${act.type === 'BORROW' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-purple-500 shadow-[0_0_10px_#8b5cf6]'}`}>
                                    {act.type === 'BORROW' ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-bold text-white">{act.userName}</span>
                                            <span className="text-gray-400"> {act.type === 'BORROW' ? 'borrowed' : 'returned'} </span>
                                            <span className="font-medium text-blue-400">{act.bookTitle}</span>
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-1">
                                            {new Date(act.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
