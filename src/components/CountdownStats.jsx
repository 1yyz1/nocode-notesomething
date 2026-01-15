import React from 'react';
import { CheckCircle, Clock, BarChart3, Filter } from 'lucide-react';

const CountdownStats = ({ countdowns, filter, onFilterChange }) => {
  const activeCount = countdowns.filter(item => new Date(item.targetDate) > new Date()).length;
  const expiredCount = countdowns.length - activeCount;

  // 优先级统计
  const highPriorityCount = countdowns.filter(item => item.priority === 'high').length;
  const mediumPriorityCount = countdowns.filter(item => item.priority === 'medium').length;
  const lowPriorityCount = countdowns.filter(item => item.priority === 'low').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{countdowns.length}</div>
          <div className="text-xs text-gray-600">总项目数</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-6 w-6 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          <div className="text-xs text-gray-600">进行中</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-6 w-6 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-500">{expiredCount}</div>
          <div className="text-xs text-gray-600">已过期</div>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium text-gray-800">筛选</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => onFilterChange('active')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'active' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            进行中
          </button>
          <button
            onClick={() => onFilterChange('expired')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'expired' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            已过期
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          <button
            onClick={() => onFilterChange('high')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'high' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            高优先级
          </button>
          <button
            onClick={() => onFilterChange('medium')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'medium' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            中优先级
          </button>
          <button
            onClick={() => onFilterChange('low')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'low' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            低优先级
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountdownStats;
