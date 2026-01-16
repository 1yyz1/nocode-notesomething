import { Edit3, Plus, Calendar, Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const AddCountdownForm = ({ onAdd, editingItem, onUpdate, onCancelEdit, addToast }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('00:00');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      const targetDate = new Date(editingItem.targetDate);
      setDate(targetDate.toISOString().split('T')[0]);
      setTime(targetDate.toTimeString().slice(0, 5));
      setPriority(editingItem.priority || 'medium');
    } else {
      resetForm();
    }
  }, [editingItem]);

  const resetForm = () => {
    setTitle('');
    setDate('');
    setTime('00:00');
    setPriority('medium');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      addToast('还没输记什么呢？', 'error');
      return;
    }
    
    if (!date) {
      addToast('哪一天呢？', 'error');
      return;
    }

    const targetDate = new Date(`${date}T${time}`);
    
    if (targetDate <= new Date()) {
      addToast('目标时间必须晚于当前时间', 'error');
      return;
    }

    if (editingItem) {
      onUpdate({
        ...editingItem,
        title: title.trim(),
        targetDate: targetDate.toISOString(),
        priority
      });
      onCancelEdit();
    } else {
      const newCountdown = {
        id: Date.now(),
        title: title.trim(),
        targetDate: targetDate.toISOString(),
        priority,
        createdAt: new Date().toISOString()
      };
      onAdd(newCountdown);
    }
    
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        {editingItem ? (
          <>
            <Edit3 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            编辑倒计时
          </>
        ) : (
          <>
            <Plus className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            添加新倒计时
          </>
        )}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            记啥？
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="要记点什么呢？"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              哪天？
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              哪个点？
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            优先级
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="high"
                checked={priority === 'high'}
                onChange={(e) => setPriority(e.target.value)}
                className="mr-2"
              />
              <span className="text-red-500">高</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="medium"
                checked={priority === 'medium'}
                onChange={(e) => setPriority(e.target.value)}
                className="mr-2"
              />
              <span className="text-yellow-500">中</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="low"
                checked={priority === 'low'}
                onChange={(e) => setPriority(e.target.value)}
                className="mr-2"
              />
              <span className="text-green-500">低</span>
            </label>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {editingItem ? '更新' : '就它了'}
          </button>
          
          {editingItem && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              取消
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddCountdownForm;
