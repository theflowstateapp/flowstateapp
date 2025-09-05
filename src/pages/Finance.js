import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const Finance = () => {
  const [financeData, setFinanceData] = useState({
    income: 8500,
    expenses: 4200,
    savings: 4300,
    investments: 25000,
    budget: {
      food: 800,
      transportation: 400,
      entertainment: 300,
      utilities: 500,
      shopping: 600,
      health: 200
    },
    transactions: [
      { id: 1, type: 'expense', category: 'Food', amount: 45, date: '2024-05-07', description: 'Grocery shopping' },
      { id: 2, type: 'income', category: 'Salary', amount: 8500, date: '2024-05-01', description: 'Monthly salary' },
      { id: 3, type: 'expense', category: 'Transportation', amount: 120, date: '2024-05-06', description: 'Gas station' },
      { id: 4, type: 'expense', category: 'Entertainment', amount: 85, date: '2024-05-05', description: 'Movie tickets' },
      { id: 5, type: 'expense', category: 'Shopping', amount: 150, date: '2024-05-04', description: 'Clothing store' }
    ],
    goals: [
      { id: 1, title: 'Emergency Fund', target: 10000, current: 8000, deadline: '2024-12-31' },
      { id: 2, title: 'Vacation Fund', target: 5000, current: 3200, deadline: '2024-08-15' },
      { id: 3, title: 'New Car', target: 25000, current: 15000, deadline: '2025-06-30' }
    ]
  });

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [filter, setFilter] = useState('all');

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    category: 'Food',
    amount: '',
    description: ''
  });

  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    deadline: ''
  });

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTransaction.amount || !newTransaction.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      date: new Date().toISOString().split('T')[0]
    };

    setFinanceData(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions],
      income: transaction.type === 'income' ? prev.income + transaction.amount : prev.income,
      expenses: transaction.type === 'expense' ? prev.expenses + transaction.amount : prev.expenses,
      savings: prev.income - prev.expenses
    }));

    setNewTransaction({
      type: 'expense',
      category: 'Food',
      amount: '',
      description: ''
    });
    setShowAddTransaction(false);
    toast.success('Transaction added successfully!');
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    const goal = {
      id: Date.now(),
      ...newGoal,
      target: parseFloat(newGoal.target),
      current: 0
    };

    setFinanceData(prev => ({
      ...prev,
      goals: [...prev.goals, goal]
    }));

    setNewGoal({
      title: '',
      target: '',
      deadline: ''
    });
    setShowAddGoal(false);
    toast.success('Financial goal added successfully!');
  };



  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Food': return '🍽️';
      case 'Transportation': return '🚗';
      case 'Entertainment': return '🎬';
      case 'Utilities': return '⚡';
      case 'Shopping': return '🛍️';
      case 'Health': return '🏥';
      case 'Salary': return '💰';
      default: return '💳';
    }
  };

  const filteredTransactions = financeData.transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'income') return transaction.type === 'income';
    if (filter === 'expense') return transaction.type === 'expense';
    return true;
  });

  const MetricCard = ({ title, value, change, icon: Icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="metric-card bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {change && (
          <div className="flex items-center space-x-1">
            {change >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-success-600" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-danger-600" />
            )}
            <span className={`text-sm font-medium ${change >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          ${value.toLocaleString()}
        </p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );

  const GoalCard = ({ goal }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{goal.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Target: ${goal.target.toLocaleString()}</span>
            <span>Current: ${goal.current.toLocaleString()}</span>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{Math.round((goal.current / goal.target) * 100)}%</span>
        </div>
        <div className="progress-bar w-full bg-gray-200 rounded-full h-2">
          <div 
            className="progress-fill bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Due: {new Date(goal.deadline).toLocaleDateString()}
        </div>
        <div className="text-sm font-medium text-gray-900">
          ${(goal.target - goal.current).toLocaleString()} left
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance & Budget</h1>
          <p className="text-gray-600 mt-1">Track your income, expenses, and financial goals</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddGoal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Target size={20} />
            <span>Add Goal</span>
          </button>
          <button
            onClick={() => setShowAddTransaction(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Monthly Income"
          value={financeData.income}
          change={12.5}
          icon={TrendingUp}
          color="bg-success-500"
          subtitle="This month"
        />
        <MetricCard
          title="Monthly Expenses"
          value={financeData.expenses}
          change={-5.2}
          icon={TrendingDown}
          color="bg-danger-500"
          subtitle="This month"
        />
        <MetricCard
          title="Total Savings"
          value={financeData.savings}
          change={8.7}
          icon={PiggyBank}
          color="bg-primary-500"
          subtitle="This month"
        />
        <MetricCard
          title="Investments"
          value={financeData.investments}
          change={15.3}
          icon={Wallet}
          color="bg-warning-500"
          subtitle="Total portfolio"
        />
      </div>

      {/* Budget Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(financeData.budget).map(([category, amount]) => (
            <div key={category} className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">{getCategoryIcon(category)}</span>
              </div>
              <p className="text-sm font-medium text-gray-900">${amount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 capitalize">{category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Goals */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Financial Goals</h2>
          <button
            onClick={() => setShowAddGoal(true)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Add Goal
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financeData.goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>
        </div>
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                  <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Transaction</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                  className="input-field"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="input-field"
                >
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health">Health</option>
                  <option value="Salary">Salary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  className="input-field"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="input-field"
                  placeholder="Enter description"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTransaction(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Financial Goal</h2>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Emergency Fund"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  className="input-field"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Add Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
