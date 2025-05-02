'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Plus, Trash2, Edit, Users, DollarSign, Receipt, ArrowRight, ArrowDown, Check, X, Save, UserPlus, Calculator } from 'lucide-react';
import GroupList from './GroupList';
import ExpenseForm from './ExpenseForm';
import GroupDetails from './GroupDetails';
import SettlementView from './SettlementView';

export default function BillSplit() {
  const { isSignedIn, user } = useUser();
  const [groups, setGroups] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [activeTab, setActiveTab] = useState('groups'); // 'groups', 'expenses', 'people', 'settlement'
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const userId = isSignedIn && user ? user.id : 'anonymous';
        
        const savedGroups = localStorage.getItem(`billsplit-groups-${userId}`);
        const savedExpenses = localStorage.getItem(`billsplit-expenses-${userId}`);
        
        if (savedGroups) {
          setGroups(JSON.parse(savedGroups));
        }
        
        if (savedExpenses) {
          setExpenses(JSON.parse(savedExpenses));
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading bill split data:', error);
        setErrorMessage('Failed to load your saved data. Please try again.');
        setIsLoaded(true);
      }
    };

    if (typeof isSignedIn !== 'undefined') {
      loadData();
    }
  }, [isSignedIn, user]);

  // Save data to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof isSignedIn !== 'undefined') {
      try {
        const userId = isSignedIn && user ? user.id : 'anonymous';
        
        localStorage.setItem(`billsplit-groups-${userId}`, JSON.stringify(groups));
        localStorage.setItem(`billsplit-expenses-${userId}`, JSON.stringify(expenses));
      } catch (error) {
        console.error('Error saving bill split data:', error);
        setErrorMessage('Failed to save your data. Please try again.');
      }
    }
  }, [groups, expenses, isLoaded, isSignedIn, user]);

  // Add a new group
  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: Date.now().toString(),
        name: newGroupName.trim(),
        date: new Date().toISOString(),
        participants: []
      };
      
      setGroups(prevGroups => [...prevGroups, newGroup]);
      setNewGroupName('');
      setShowAddGroupForm(false);
    }
  };

  // Delete a group
  const handleDeleteGroup = (groupId) => {
    setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
    
    // Also delete all expenses related to this group
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.groupId !== groupId));
    
    // If the deleted group was selected, reset selection
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
      setActiveTab('groups');
    }
  };

  // Select a group
  const handleSelectGroup = (groupId) => {
    setSelectedGroupId(groupId);
    setActiveTab('expenses');
  };

  // Add a new expense
  const handleAddExpense = (expenseData) => {
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData,
      date: new Date().toISOString(),
      groupId: selectedGroupId
    };
    
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
  };

  // Delete an expense
  const handleDeleteExpense = (expenseId) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== expenseId));
  };

  // Add a participant to a group
  const handleAddParticipant = (groupId, participantName) => {
    if (participantName.trim()) {
      setGroups(prevGroups => 
        prevGroups.map(group => 
          group.id === groupId
            ? {
                ...group,
                participants: [
                  ...group.participants,
                  {
                    id: Date.now().toString(),
                    name: participantName.trim()
                  }
                ]
              }
            : group
        )
      );
    }
  };

  // Remove a participant from a group
  const handleRemoveParticipant = (groupId, participantId) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId
          ? {
              ...group,
              participants: group.participants.filter(p => p.id !== participantId)
            }
          : group
      )
    );
  };

  // Get the selected group
  const selectedGroup = groups.find(group => group.id === selectedGroupId);
  
  // Get expenses for the selected group
  const groupExpenses = expenses.filter(expense => expense.groupId === selectedGroupId);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Error message */}
      {errorMessage && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
          {errorMessage}
          <button 
            onClick={() => setErrorMessage('')}
            className="ml-2 text-red-800 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {selectedGroupId ? (
        // Group details view
        <div>
          {/* Navigation tabs */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === 'expenses'
                  ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Receipt size={16} className="inline mr-1" />
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('people')}
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === 'people'
                  ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users size={16} className="inline mr-1" />
              People
            </button>
            <button
              onClick={() => setActiveTab('settlement')}
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === 'settlement'
                  ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calculator size={16} className="inline mr-1" />
              Settlement
            </button>
            <button
              onClick={() => {
                setSelectedGroupId(null);
                setActiveTab('groups');
              }}
              className="ml-auto px-4 py-2 text-[#2563EB] font-medium whitespace-nowrap"
            >
              Back to Groups
            </button>
          </div>
          
          {/* Group header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#2D3748]">
              {selectedGroup.name}
            </h2>
            <p className="text-sm text-gray-500">
              Created: {new Date(selectedGroup.date).toLocaleDateString()}
            </p>
          </div>
          
          {/* Content based on active tab */}
          {activeTab === 'expenses' && (
            <GroupDetails 
              group={selectedGroup}
              expenses={groupExpenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}
          
          {activeTab === 'people' && (
            <div>
              <h3 className="text-lg font-medium text-[#2D3748] mb-4">Participants</h3>
              {selectedGroup.participants.length > 0 ? (
                <div className="space-y-2 mb-6">
                  {selectedGroup.participants.map(participant => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border rounded-md bg-white">
                      <span className="text-gray-800">{participant.name}</span>
                      <button
                        onClick={() => handleRemoveParticipant(selectedGroup.id, participant.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic mb-6">No participants yet. Add someone to get started!</p>
              )}
              
              {/* Add participant form */}
              <div className="mt-4">
                <h3 className="text-lg font-medium text-[#2D3748] mb-2">Add New Participant</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Participant name..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-gray-900"
                    id="newParticipantName"
                  />
                  <button
                    onClick={() => {
                      const name = document.getElementById('newParticipantName').value;
                      handleAddParticipant(selectedGroup.id, name);
                      document.getElementById('newParticipantName').value = '';
                    }}
                    className="bg-[#2563EB] text-white px-4 py-2 rounded-md hover:bg-[#1D4ED8] transition-colors flex items-center gap-1"
                  >
                    <UserPlus size={18} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settlement' && (
            <SettlementView
              group={selectedGroup}
              expenses={groupExpenses}
            />
          )}
        </div>
      ) : (
        // Groups list view
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#2D3748]">Your Groups</h2>
            <button
              onClick={() => setShowAddGroupForm(true)}
              className="bg-[#2563EB] text-white px-4 py-2 rounded-md hover:bg-[#1D4ED8] transition-colors flex items-center gap-1"
            >
              <Plus size={18} />
              New Group
            </button>
          </div>
          
          {/* Add Group Form */}
          {showAddGroupForm && (
            <div className="mb-6 p-4 border border-[#E2E8F0] rounded-md bg-white">
              <h3 className="text-lg font-medium text-[#2D3748] mb-3">Create New Group</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Group name (e.g., NYC Trip, Dinner at Joe's)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-gray-900"
                />
                <button
                  onClick={handleAddGroup}
                  className="bg-[#2563EB] text-white px-4 py-2 rounded-md hover:bg-[#1D4ED8] transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowAddGroupForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {/* Groups List */}
          <GroupList
            groups={groups}
            expenses={expenses}
            onSelectGroup={handleSelectGroup}
            onDeleteGroup={handleDeleteGroup}
          />
          
          {/* Empty state */}
          {groups.length === 0 && (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <Users size={48} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-[#2D3748] mb-2">No groups yet</h3>
              <p className="text-gray-500 mb-4">Create your first group to start tracking expenses</p>
              <button
                onClick={() => setShowAddGroupForm(true)}
                className="bg-[#2563EB] text-white px-4 py-2 rounded-md hover:bg-[#1D4ED8] transition-colors inline-flex items-center gap-1"
              >
                <Plus size={18} />
                Create Group
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 