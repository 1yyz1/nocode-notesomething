import React, { useState } from 'react';
import { Timer } from 'lucide-react';
import AddCountdownForm from '../components/AddCountdownForm';
import CountdownItem from '../components/CountdownItem';
import CountdownStats from '../components/CountdownStats';
import useLocalStorage from '../hooks/useLocalStorage';

const Index = () => {
  const [countdowns, setCountdowns] = useLocalStorage('countdowns', []);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleAddCountdown = (newCountdown) => {
    setCountdowns(prev => [...prev, newCountdown]);
  };

  const handleUpdateCountdown = (updatedCountdown) => {
    setCountdowns(prev => 
      prev.map(item => 
        item.id === updatedCountdown.id ? updatedCountdown : item
      )
    );
    setEditingItem(null);
  };

  const handleDeleteCountdown = (id) => {
    if (window.confirm('确定要删除这个倒计时项目吗？')) {
      setCountdowns(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleClearExpired = () => {
    if (window.confirm('确定要清空所有已到达的倒计时项目吗？')) {
      setCountdowns(prev => prev.filter(item => new Date(item.targetDate) > new Date()));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有倒计时项目吗？此操作不可恢复！')) {
      setCountdowns([]);
    }
  };

  const handleEditCountdown = (item) => {
    setEditingItem(item);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  // 筛选逻辑
  const getFilteredCountdowns = () => {
    let filtered = [...countdowns];
    
    switch (filter) {
      case 'active':
        filtered = filtered.filter(item => new Date(item.targetDate) > new Date());
        break;
      case 'expired':
        filtered = filtered.filter(item => new Date(item.targetDate) <= new Date());
        break;
      case 'high':
        filtered = filtered.filter(item => item.priority === 'high');
        break;
      case 'medium':
        filtered = filtered.filter(item => item.priority === 'medium');
        break;
      case 'low':
        filtered = filtered.filter(item => item.priority === 'low');
        break;
      default:
        // 'all' - 显示所有
        break;
    }
    
    return filtered;
  };

  // 排序逻辑：已过期的排在最后，未过期的按时间升序排列
  const getSortedCountdowns = () => {
    const filtered = getFilteredCountdowns();
    
    return filtered.sort((a, b) => {
      const aExpired = new Date(a.targetDate) <= new Date();
      const bExpired = new Date(b.targetDate) <= new Date();
      
      // 如果a已过期而b没有，b排在前面
      if (aExpired && !bExpired) return 1;
      // 如果b已过期而a没有，a排在前面
      if (!aExpired && bExpired) return -1;
      
      // 如果都过期或都没过期，按时间排序
      return new Date(a.targetDate) - new Date(b.targetDate);
    });
  };

  const sortedCountdowns = getSortedCountdowns();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Timer className="h-12 w-12 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">记点啥呢？</h1>
          </div>
        </div>

        {/* 添加倒计时表单 */}
        <AddCountdownForm 
          onAdd={handleAddCountdown} 
          editingItem={editingItem}
          onUpdate={handleUpdateCountdown}
          onCancelEdit={handleCancelEdit}
        />

        {/* 统计信息和操作按钮 */}
        {countdowns.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <CountdownStats 
              countdowns={countdowns} 
              filter={filter}
              onFilterChange={setFilter}
            />
            <div className="flex gap-2">
              <button
                onClick={handleClearExpired}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                清空已到达
              </button>
              <button
                onClick={handleClearAll}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                全部清空
              </button>
            </div>
          </div>
        )}

        {/* 倒计时列表 */}
        <div className="space-y-3">
          {sortedCountdowns.length === 0 ? (
            <div className="text-center py-12">
              <Timer className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">
                {countdowns.length === 0 ? '还没有倒计时项目' : '没有符合条件的倒计时项目'}
              </h3>
              <p className="text-gray-400">
                {countdowns.length === 0 ? '添加你的第一个倒计时项目开始吧！' : '尝试调整筛选条件'}
              </p>
            </div>
          ) : (
            sortedCountdowns.map((item) => (
              <CountdownItem
                key={item.id}
                item={item}
                onDelete={handleDeleteCountdown}
                onEdit={handleEditCountdown}
              />
            ))
          )}
        </div>

        {/* 页脚 */}
        <div className="text-center mt-12 text-gray-500">
          <p>数据保存在本地浏览器中，刷新页面不会丢失</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
