import React, { useState } from 'react';
import { Timer } from 'lucide-react';
import AddCountdownForm from '../components/AddCountdownForm';
import CountdownItem from '../components/CountdownItem';
import CountdownStats from '../components/CountdownStats';
import useLocalStorage from '../hooks/useLocalStorage';
import DarkModeToggle from '../components/DarkModeToggle';
import ToastContainer from '../components/ToastContainer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Index = () => {
  const [countdowns, setCountdowns] = useLocalStorage('countdowns', []);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [toasts, setToasts] = useState([]);
  const [isClearExpiredDialogOpen, setIsClearExpiredDialogOpen] = useState(false);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleAddCountdown = (newCountdown) => {
    setCountdowns(prev => [...prev, newCountdown]);
    addToast('倒计时添加成功！', 'success');
  };

  const handleUpdateCountdown = (updatedCountdown) => {
    setCountdowns(prev => 
      prev.map(item => 
        item.id === updatedCountdown.id ? updatedCountdown : item
      )
    );
    setEditingItem(null);
    addToast('倒计时更新成功！', 'success');
  };

  const handleDeleteCountdown = (id) => {
    setCountdowns(prev => prev.filter(item => item.id !== id));
    addToast('倒计时已删除', 'success');
  };

  const handleClearExpired = () => {
    const expiredCount = countdowns.filter(item => new Date(item.targetDate) <= new Date()).length;
    if (expiredCount === 0) {
      addToast('没有已过期的倒计时项目', 'info');
      return;
    }
    
    setIsClearExpiredDialogOpen(true);
  };

  const confirmClearExpired = () => {
    const expiredCount = countdowns.filter(item => new Date(item.targetDate) <= new Date()).length;
    setCountdowns(prev => prev.filter(item => new Date(item.targetDate) > new Date()));
    addToast(`已清空 ${expiredCount} 个已过期的倒计时项目`, 'success');
    setIsClearExpiredDialogOpen(false);
  };

  const handleClearAll = () => {
    if (countdowns.length === 0) {
      addToast('没有可清空的倒计时项目', 'info');
      return;
    }
    
    setIsClearAllDialogOpen(true);
  };

  const confirmClearAll = () => {
    setCountdowns([]);
    addToast('已清空所有倒计时项目', 'success');
    setIsClearAllDialogOpen(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 transition-colors">
      <div className="max-w-4xl mx-auto px-4">
        {/* 页面标题和深色模式切换 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Timer className="h-12 w-12 text-blue-500 dark:text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">记点啥呢？</h1>
          </div>
          <DarkModeToggle />
        </div>

        {/* 添加倒计时表单 */}
        <AddCountdownForm 
          onAdd={handleAddCountdown} 
          editingItem={editingItem}
          onUpdate={handleUpdateCountdown}
          onCancelEdit={handleCancelEdit}
          addToast={addToast}
        />

        {/* 统计信息和操作按钮 */}
        {countdowns.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <CountdownStats 
              countdowns={countdowns} 
              filter={filter}
              onFilterChange={setFilter}
            />
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <button
                onClick={handleClearExpired}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full md:w-auto"
              >
                清空已过期
              </button>
              <button
                onClick={handleClearAll}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full md:w-auto"
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
              <Timer className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">
                {countdowns.length === 0 ? '还没有倒计时项目' : '没有符合条件的倒计时项目'}
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
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
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>数据保存在本地浏览器中，刷新页面不会丢失</p>
        </div>
      </div>

      {/* 消息提醒容器 */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* 确认删除弹窗 */}
      <AlertDialog open={isClearExpiredDialogOpen} onOpenChange={setIsClearExpiredDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认清空已过期项目</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将删除所有已过期的倒计时项目，且无法撤销。您确定要继续吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearExpired}>确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认清空所有项目</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将删除所有倒计时项目，且无法撤销。您确定要继续吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearAll}>确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
