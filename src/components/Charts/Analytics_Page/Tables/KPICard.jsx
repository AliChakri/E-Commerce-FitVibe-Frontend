
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import React from 'react'

const KPICard = ({ title, value, change, trend, icon: Icon, color }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon color='white' className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className={`flex items-center text-sm font-medium ${
          trend === 'up' ? 'text-emerald-600' : 'text-red-500'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );

export default KPICard