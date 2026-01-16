import React, { useState, useEffect } from 'react';
import { Trash2, Clock, Edit3 } from 'lucide-react';

const CountdownItem = ({ item, onDelete, onEdit }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const target = new Date(item.targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      expired: false
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [item.targetDate]);

  const isExpired = timeLeft.expired;

  // 优先级颜色映射
  const priorityColors = {
    high: 'border-red-500',
    medium: 'border-yellow-500',
    low: 'border-green-500'
  };

  const priorityLabels = {
    high: '高',
    medium: '中',
    low: '低'
  };

  const priorityTextColors = {
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-green-500'
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-3 border-l-4 ${
      isExpired ? 'border-gray-400 opacity-60' : priorityColors[item.priority] || 'border-blue-500'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Clock className={`h-4 w-4 ${isExpired ? 'text-gray-400' : 'text-blue-500 dark:text-blue-400'}`} />
          <h3 className={`text-base font-semibold ${isExpired ? 'text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
            {item.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityTextColors[item.priority] || 'text-blue-500'} bg-gray-100 dark:bg-gray-700`}>
            {priorityLabels[item.priority] || '中'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1 rounded-full transition-colors"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded-full transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        目标时间: {new Date(item.targetDate).toLocaleString('zh-CN')}
      </div>
      
      {isExpired ? (
        <div className="text-gray-500 dark:text-gray-400 font-medium">已过期</div>
      ) : (
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-1">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{timeLeft.days}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">天</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-1">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{timeLeft.hours}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">时</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-1">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{timeLeft.minutes}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">分</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-1">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{timeLeft.seconds}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">秒</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownItem;
