'use client';

import { Trash2, Users, DollarSign, ArrowRight } from 'lucide-react';

export default function GroupList({ groups, expenses, onSelectGroup, onDeleteGroup }) {
  // Calculate total expenses for each group
  const calculateGroupTotal = (groupId) => {
    return expenses
      .filter(expense => expense.groupId === groupId)
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  };

  // Count participants in each group
  const countParticipants = (group) => {
    return group.participants.length;
  };

  return (
    <div className="space-y-3">
      {groups.map(group => (
        <div 
          key={group.id}
          className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-[#2D3748]">{group.name}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteGroup(group.id);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Delete group"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              <span>{countParticipants(group)} participants</span>
            </div>
            <div className="flex items-center">
              <DollarSign size={16} className="mr-1" />
              <span>${calculateGroupTotal(group.id).toFixed(2)} total</span>
            </div>
            <div>
              <span>Created: {new Date(group.date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <button
            onClick={() => onSelectGroup(group.id)}
            className="w-full mt-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-[#2563EB] flex items-center justify-center gap-1 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ))}
    </div>
  );
} 