'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Calendar, User, Users, X } from 'lucide-react';

export default function ExpenseForm({ group, onSubmit, onCancel }) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  // Always use equal split
  const [splitType] = useState('equal');
  const [customAmounts, setCustomAmounts] = useState({});
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [errors, setErrors] = useState({});
  const [multiplePayers, setMultiplePayers] = useState(false);
  const [payerDetails, setPayerDetails] = useState({});

  // Initialize custom amounts when participants change
  useEffect(() => {
    const newCustomAmounts = {};
    group.participants.forEach(participant => {
      newCustomAmounts[participant.name] = selectedParticipants.includes(participant.name) 
        ? customAmounts[participant.name] || '0'
        : '0';
    });
    setCustomAmounts(newCustomAmounts);
  }, [group.participants, selectedParticipants, customAmounts]);

  // Update split amounts when total amount changes and equal split is selected
  useEffect(() => {
    if (splitType === 'equal' && totalAmount && selectedParticipants.length > 0) {
      const equalAmount = (parseFloat(totalAmount) / selectedParticipants.length).toFixed(2);
      const newCustomAmounts = {};
      
      selectedParticipants.forEach(name => {
        newCustomAmounts[name] = equalAmount;
      });
      
      group.participants.forEach(participant => {
        if (!selectedParticipants.includes(participant.name)) {
          newCustomAmounts[participant.name] = '0';
        }
      });
      
      setCustomAmounts(newCustomAmounts);
    }
  }, [totalAmount, selectedParticipants, splitType, group.participants]);
  
  // No longer need to calculate custom amounts as we only use equal split
  
  // Calculate total of payer amounts
  const calculatePayersTotal = () => {
    return Object.values(payerDetails)
      .filter(amount => amount !== '')
      .reduce((sum, amount) => sum + parseFloat(amount || 0), 0);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!totalAmount || isNaN(parseFloat(totalAmount)) || parseFloat(totalAmount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    // Validar pagadores
    if (multiplePayers) {
      const payersTotal = calculatePayersTotal();
      const total = parseFloat(totalAmount);
      
      if (Math.abs(payersTotal - total) > 0.01) {
        newErrors.multiplePayers = `The sum of individual payments (${payersTotal.toFixed(2)}) must equal the total (${total.toFixed(2)})`;
      }
      
      // Verify that at least one person has paid something
      const hasAtLeastOnePayer = Object.values(payerDetails).some(amount => parseFloat(amount || 0) > 0);
      if (!hasAtLeastOnePayer) {
        newErrors.multiplePayers = 'At least one person must have paid something';
      }
      
      // Validar montos individuales
      Object.entries(payerDetails).forEach(([name, amount]) => {
        if (amount === '' || isNaN(parseFloat(amount))) {
          newErrors[`payer_${name}`] = `Amount for ${name} is invalid`;
        }
      });
    } else {
      if (!paidBy) {
        newErrors.paidBy = 'Paid by is required';
      }
    }
    
    if (selectedParticipants.length === 0) {
      newErrors.participants = 'At least one participant must be selected';
    }
    
    // Always using equal split - no custom amount validation needed
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Prepare the expense data
    
    // Process payer details if there are multiple payers
    const processedPayerDetails = {};
    if (multiplePayers) {
      Object.entries(payerDetails).forEach(([name, amount]) => {
        const parsedAmount = parseFloat(amount || 0);
        if (parsedAmount > 0) {
          processedPayerDetails[name] = parsedAmount;
        }
      });
    }
    
    const expenseData = {
      description: description.trim(),
      amount: parseFloat(totalAmount),
      paidBy: multiplePayers ? '' : paidBy, // If there are multiple payers, there's no main payer
      splitAmong: selectedParticipants,
      splitType: 'equal', // Always use equal split
      splitDetails: null, // No custom split details needed
      multiplePayers,
      payerDetails: multiplePayers ? processedPayerDetails : null
    };
    
    // Submit the expense data
    onSubmit(expenseData);
    
    // Reset form
    setDescription('');
    setTotalAmount('');
    setPaidBy('');
    setSplitType('equal');
    setSelectedParticipants([]);
    setCustomAmounts({});
    setMultiplePayers(false);
    setPayerDetails({});
    setErrors({});
  };

  // Toggle participant selection
  const toggleParticipant = (participantName) => {
    setSelectedParticipants(prev => {
      if (prev.includes(participantName)) {
        return prev.filter(name => name !== participantName);
      } else {
        return [...prev, participantName];
      }
    });
  };
  
  // No longer need to handle custom amount changes as we only use equal split

  // Check if a participant is selected
  const isParticipantSelected = (participantName) => {
    return selectedParticipants.includes(participantName);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    return parseFloat(amount).toFixed(2);
  };

  return (
    <div className="mb-8 p-4 border border-[#E2E8F0] rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-[#2D3748]">Add New Expense</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          title="Cancel"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Description field */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            placeholder="What was this expense for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-gray-900`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>
        
        {/* Total amount field */}
        <div className="mb-4">
          <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Total Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={16} className="text-gray-500" />
            </div>
            <input
              type="number"
              id="totalAmount"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className={`w-full pl-10 px-3 py-2 border ${
                errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-gray-900`}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>
        
        {/* Paid by field */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700">
              Paid by
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="multiple-payers"
                checked={multiplePayers}
                onChange={() => {
                  setMultiplePayers(!multiplePayers);
                  // Inicializar los detalles de pagadores si se activa
                  if (!multiplePayers) {
                    const newPayerDetails = {};
                    group.participants.forEach(participant => {
                      newPayerDetails[participant.name] = '';
                    });
                    setPayerDetails(newPayerDetails);
                  }
                }}
                className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-gray-300 rounded"
              />
              <label
                htmlFor="multiple-payers"
                className="ml-2 block text-sm text-gray-700"
              >
                Multiple payers
              </label>
            </div>
          </div>
          
          {!multiplePayers ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-gray-500" />
              </div>
              <select
                id="paidBy"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className={`w-full pl-10 px-3 py-2 border ${
                  errors.paidBy ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-gray-900`}
              >
                <option value="">Select who paid</option>
                {group.participants.map(participant => (
                  <option key={participant.id} value={participant.name}>
                    {participant.name}
                  </option>
                ))}
              </select>
              {errors.paidBy && (
                <p className="mt-1 text-sm text-red-600">{errors.paidBy}</p>
              )}
            </div>
          ) : (
            <div className="mt-2 border border-gray-300 rounded-md divide-y divide-gray-300">
              <div className="p-3 bg-gray-50 flex justify-between">
                <span className="text-sm font-medium text-gray-700">Participant</span>
                <span className="text-sm font-medium text-gray-700">Amount paid</span>
              </div>
              
              {group.participants.map(participant => (
                <div key={participant.id} className="p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-800">{participant.name}</span>
                  <div className="relative w-32">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={14} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*(\.[0-9]+)?"
                      placeholder="0.00"
                      value={payerDetails[participant.name] || ''}
                      onChange={(e) => {
                        // Validar que solo se ingresen números y un punto decimal
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setPayerDetails(prev => ({
                            ...prev,
                            [participant.name]: value
                          }));
                        }
                      }}
                      className={`w-full pl-8 px-3 py-1 border ${
                        errors[`payer_${participant.name}`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-[#2563EB] text-gray-900 text-right`}
                    />
                  </div>
                </div>
              ))}
              
              <div className="p-3 bg-gray-50 flex justify-between items-center font-medium">
                <span className="text-sm text-gray-700">Total</span>
                <span className={`text-sm pr-4 ${
                  totalAmount && Math.abs(calculatePayersTotal() - parseFloat(totalAmount)) > 0.01
                  ? 'text-red-600'
                  : 'text-gray-900'
                }`}>
                  ${formatCurrency(calculatePayersTotal())} / ${formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          )}
          {errors.multiplePayers && (
            <p className="mt-1 text-sm text-red-600">{errors.multiplePayers}</p>
          )}
        </div>
        
        {/* Split among field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Split among
          </label>
          <div className={`p-3 border ${
            errors.participants ? 'border-red-300 bg-red-50' : 'border-gray-300'
          } rounded-md`}>
            <div className="flex items-center mb-2">
              <Users size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Select who&apos;s splitting this expense</span>
            </div>
            
            {group.participants.length > 0 ? (
              <div className="space-y-2">
                {group.participants.map(participant => (
                  <div key={participant.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`participant-${participant.id}`}
                      checked={isParticipantSelected(participant.name)}
                      onChange={() => toggleParticipant(participant.name)}
                      className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`participant-${participant.id}`}
                      className="ml-2 block text-sm text-gray-800"
                    >
                      {participant.name}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 italic">
                No participants yet. Add participants in the People tab first.
              </p>
            )}
          </div>
          {errors.participants && (
            <p className="mt-1 text-sm text-red-600">{errors.participants}</p>
          )}
        </div>
        
        {/* Split type is always equal - no selection needed */}
        
        {/* Equal split is always used - no custom amounts needed */}
        
        {/* Action buttons */}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#2563EB] text-white px-4 py-2 rounded-md hover:bg-[#1D4ED8] transition-colors"
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
}