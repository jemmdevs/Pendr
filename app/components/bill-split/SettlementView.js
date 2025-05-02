'use client';

import { useState, useEffect } from 'react';
import { Users, ArrowRight, Calculator } from 'lucide-react';

export default function SettlementView({ group, expenses }) {
  const [settlements, setSettlements] = useState([]);
  const [totalOwed, setTotalOwed] = useState({});

  // Calculate settlements based on expenses
  useEffect(() => {
    // Skip if no participants or expenses
    if (!group.participants.length || !expenses.length) {
      setSettlements([]);
      setTotalOwed({});
      return;
    }
    
    // Calculate how much each person paid in total
    const totalPaid = {};
    group.participants.forEach(participant => {
      totalPaid[participant.name] = 0;
    });
    
    // Add up all expenses paid by each person
    expenses.forEach(expense => {
      if (totalPaid[expense.paidBy] !== undefined) {
        totalPaid[expense.paidBy] += parseFloat(expense.amount);
      }
    });
    
    // Calculate how much each person should have paid (their share)
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const shares = {};
    
    // First, calculate expenses per participant based on split
    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount);
      
      if (expense.splitType === 'custom' && expense.splitDetails) {
        // Use custom amounts for each participant
        expense.splitAmong.forEach(person => {
          if (!shares[person]) {
            shares[person] = 0;
          }
          
          const customAmount = parseFloat(expense.splitDetails[person] || 0);
          shares[person] += customAmount;
        });
      } else {
        // Fall back to equal split
        const splitCount = expense.splitAmong.length;
        
        if (splitCount > 0) {
          const shareAmount = amount / splitCount;
          
          expense.splitAmong.forEach(person => {
            if (!shares[person]) {
              shares[person] = 0;
            }
            shares[person] += shareAmount;
          });
        }
      }
    });
    
    // Calculate net balance (paid - share)
    const balances = {};
    Object.keys(shares).forEach(person => {
      balances[person] = (totalPaid[person] || 0) - (shares[person] || 0);
    });
    
    // People who paid more than their share (positive balance) should receive money
    // People who paid less than their share (negative balance) should pay money
    const creditors = Object.keys(balances)
      .filter(person => balances[person] > 0)
      .sort((a, b) => balances[b] - balances[a]);
      
    const debtors = Object.keys(balances)
      .filter(person => balances[person] < 0)
      .sort((a, b) => balances[a] - balances[b]);
    
    // Calculate the settlement transactions
    const transactions = [];
    
    // Copy balances to keep track of remaining amounts
    const remainingBalances = { ...balances };
    
    // For each debtor, figure out who they should pay
    debtors.forEach(debtor => {
      let amountToPayTotal = -remainingBalances[debtor]; // Convert negative to positive
      
      // Keep attempting to settle while the debtor still owes money
      creditors.forEach(creditor => {
        if (amountToPayTotal > 0 && remainingBalances[creditor] > 0) {
          // The amount to pay this creditor is the minimum of what the debtor owes
          // and what the creditor is owed
          const amountToPay = Math.min(amountToPayTotal, remainingBalances[creditor]);
          
          if (amountToPay > 0.01) { // Ignore very small amounts due to floating point
            transactions.push({
              from: debtor,
              to: creditor,
              amount: parseFloat(amountToPay.toFixed(2)) // Round to 2 decimal places
            });
            
            // Update remaining balances
            amountToPayTotal -= amountToPay;
            remainingBalances[creditor] -= amountToPay;
          }
        }
      });
    });
    
    // Set the calculated settlements
    setSettlements(transactions);
    setTotalOwed(shares);
  }, [group, expenses]);

  return (
    <div>
      <div className="mb-6 p-4 bg-[#F0F9FF] border border-[#93C5FD] rounded-md">
        <h3 className="text-lg font-medium text-[#2D3748] mb-2 flex items-center">
          <Calculator size={18} className="mr-2 text-[#2563EB]" />
          Settlement Summary
        </h3>
        
        {group.participants.length === 0 ? (
          <p className="text-gray-700 italic">Add participants before calculating settlements.</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-700 italic">Add expenses before calculating settlements.</p>
        ) : settlements.length === 0 ? (
          <p className="text-gray-700">All expenses are already settled!</p>
        ) : (
          <p className="text-gray-700">
            Based on the expenses recorded, here&apos;s how to settle the balance.
          </p>
        )}
      </div>

      {/* Settlement transactions */}
      {settlements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-[#2D3748] mb-4">Who Pays Whom</h3>
          
          <div className="space-y-3">
            {settlements.map((transaction, index) => (
              <div key={index} className="p-4 bg-white border border-gray-200 rounded-md flex items-center">
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{transaction.from}</span>
                </div>
                <div className="flex items-center mx-2">
                  <span className="text-gray-700 mx-2">pays</span>
                  <span className="font-bold text-[#2563EB]">${transaction.amount.toFixed(2)}</span>
                  <span className="text-gray-700 mx-2">to</span>
                </div>
                <div className="flex-1 text-right">
                  <span className="font-medium text-gray-800">{transaction.to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participant expense breakdown */}
      {group.participants.length > 0 && expenses.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-[#2D3748] mb-4">Expense Breakdown</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 border text-left text-sm font-medium text-gray-700">Person</th>
                  <th className="px-4 py-2 border text-right text-sm font-medium text-gray-700">Total Paid</th>
                  <th className="px-4 py-2 border text-right text-sm font-medium text-gray-700">Total Share</th>
                  <th className="px-4 py-2 border text-right text-sm font-medium text-gray-700">Net Balance</th>
                </tr>
              </thead>
              <tbody>
                {group.participants.map(participant => {
                  // Calculate total paid by this participant
                  const paid = expenses
                    .filter(e => e.paidBy === participant.name)
                    .reduce((sum, e) => sum + parseFloat(e.amount), 0);
                  
                  // Get their share of expenses
                  const share = totalOwed[participant.name] || 0;
                  
                  // Calculate net balance
                  const balance = paid - share;
                  
                  return (
                    <tr key={participant.id} className="border hover:bg-gray-50">
                      <td className="px-4 py-3 border text-sm text-gray-800">
                        {participant.name}
                      </td>
                      <td className="px-4 py-3 border text-right text-sm text-gray-800 font-medium">
                        ${paid.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 border text-right text-sm text-gray-800 font-medium">
                        ${share.toFixed(2)}
                      </td>
                      <td className={`px-4 py-3 border text-right text-sm font-medium ${
                        balance > 0 
                          ? 'text-green-600' 
                          : balance < 0 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                      }`}>
                        {balance > 0 
                          ? `+$${balance.toFixed(2)}` 
                          : balance < 0 
                            ? `-$${Math.abs(balance).toFixed(2)}`
                            : '$0.00'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            <p>
              <span className="inline-block w-4 h-4 bg-green-100 border border-green-600 rounded-full mr-1"></span>
              <span className="text-green-600 font-medium">Positive balance</span>: This person paid more than their share and should receive money.
            </p>
            <p>
              <span className="inline-block w-4 h-4 bg-red-100 border border-red-600 rounded-full mr-1"></span>
              <span className="text-red-600 font-medium">Negative balance</span>: This person paid less than their share and should pay money.
            </p>
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {(group.participants.length === 0 || expenses.length === 0) && (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <Users size={48} className="mx-auto text-gray-400 mb-3" />
          {group.participants.length === 0 ? (
            <div>
              <h3 className="text-lg font-medium text-[#2D3748] mb-2">No participants yet</h3>
              <p className="text-gray-500">Add participants in the People tab to get started</p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-[#2D3748] mb-2">No expenses yet</h3>
              <p className="text-gray-500">Add expenses in the Expenses tab to calculate settlements</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}