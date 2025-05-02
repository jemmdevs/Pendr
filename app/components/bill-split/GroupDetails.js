'use client';

import { useState } from 'react';
import { Plus, Trash2, DollarSign, Calendar, Users, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

export default function GroupDetails({ group, expenses, onAddExpense, onDeleteExpense }) {
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [expandedExpenseId, setExpandedExpenseId] = useState(null);

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  // Toggle expense details
  const toggleExpenseDetails = (expenseId) => {
    if (expandedExpenseId === expenseId) {
      setExpandedExpenseId(null);
    } else {
      setExpandedExpenseId(expenseId);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0.00';
    return parseFloat(amount).toFixed(2);
  };

  return (
    <div>
      {/* Group summary */}
      <div className="mb-6 p-4 bg-[#F0F9FF] border border-[#93C5FD] rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[#2D3748] font-medium">Total expenses:</span>
            <span className="ml-2 text-xl font-bold text-[#2563EB]">${totalExpenses.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[#2D3748] font-medium mr-2">Participants:</span>
            <span className="text-gray-600">{group.participants.length}</span>
          </div>
        </div>
      </div>

      {/* Add expense button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddExpenseForm(true)}
          className="bg-[#2563EB] text-white px-4 py-2 rounded-md hover:bg-[#1D4ED8] transition-colors flex items-center gap-1"
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* Add expense form */}
      {showAddExpenseForm && (
        <ExpenseForm
          group={group}
          onSubmit={(expenseData) => {
            onAddExpense(expenseData);
            setShowAddExpenseForm(false);
          }}
          onCancel={() => setShowAddExpenseForm(false)}
        />
      )}

      {/* Expenses list */}
      <div>
        <h3 className="text-lg font-medium text-[#2D3748] mb-4">Expenses</h3>
        
        {expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.map(expense => (
              <div key={expense.id} className="bg-white border border-gray-200 rounded-md">
                {/* Expense header */}
                <div 
                  className="p-4 flex justify-between items-start cursor-pointer"
                  onClick={() => toggleExpenseDetails(expense.id)}
                >
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium text-[#2D3748]">{expense.description}</h4>
                      <button className="ml-2 text-gray-400">
                        {expandedExpenseId === expense.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </div>
                    <div className="mt-1 space-y-1 text-sm">
                      <div className="flex items-center text-gray-600">
                        <DollarSign size={14} className="mr-1" />
                        <span>${parseFloat(expense.amount).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar size={14} className="mr-1" />
                        <span>{new Date(expense.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users size={14} className="mr-1" />
                        <span>Paid by: {expense.paidBy}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteExpense(expense.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {/* Expense details */}
                {expandedExpenseId === expense.id && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Split Details
                      </h5>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-md divide-y divide-gray-200">
                        <div className="px-3 py-2 text-xs text-gray-500 grid grid-cols-2">
                          <span>Participant</span>
                          <span className="text-right">Amount</span>
                        </div>
                        
                        {expense.splitAmong.map(person => {
                          // Calculate amount based on split type
                          let amount;
                          if (expense.splitType === 'custom' && expense.splitDetails) {
                            amount = formatCurrency(expense.splitDetails[person]);
                          } else {
                            // Default to equal split
                            amount = formatCurrency(expense.amount / expense.splitAmong.length);
                          }
                          
                          return (
                            <div key={person} className="px-3 py-2 text-sm grid grid-cols-2">
                              <span className="text-gray-800">{person}</span>
                              <span className="text-right text-gray-800">${amount}</span>
                            </div>
                          );
                        })}
                        
                        <div className="px-3 py-2 text-sm font-medium grid grid-cols-2 bg-gray-50">
                          <span className="text-gray-700">Total</span>
                          <span className="text-right text-gray-900">${formatCurrency(expense.amount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md border border-dashed border-gray-300">
            No expenses yet. Add your first expense!
          </div>
        )}
      </div>
    </div>
  );
} 