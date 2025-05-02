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
    
    // Inicializar los totales para todos los participantes
    const totalPaid = {};
    const shares = {};
    
    group.participants.forEach(participant => {
      totalPaid[participant.name] = 0;
      shares[participant.name] = 0;
    });
    
    // Procesar cada gasto
    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount);
      const paidBy = expense.paidBy;
      
      // Registrar quién pagó este gasto
      if (totalPaid[paidBy] !== undefined) {
        // Si hay un solo pagador, registrar el monto completo
        totalPaid[paidBy] += amount;
      }
      
      // Si hay múltiples pagadores con montos diferentes
      if (expense.multiplePayers && expense.payerDetails) {
        // Restar el monto del pagador principal para evitar duplicación
        if (totalPaid[paidBy] !== undefined) {
          totalPaid[paidBy] -= amount;
        }
        
        // Registrar los montos individuales para cada pagador
        Object.entries(expense.payerDetails).forEach(([person, payAmount]) => {
          if (totalPaid[person] !== undefined) {
            totalPaid[person] += parseFloat(payAmount || 0);
          }
        });
      }
      
      // Calcular cómo se divide este gasto entre los participantes
      if (expense.splitType === 'custom' && expense.splitDetails) {
        // División personalizada
        expense.splitAmong.forEach(person => {
          if (shares[person] !== undefined) {
            const customAmount = parseFloat(expense.splitDetails[person] || 0);
            shares[person] += customAmount;
          }
        });
      } else {
        // División equitativa
        const splitCount = expense.splitAmong.length;
        if (splitCount > 0) {
          const shareAmount = amount / splitCount;
          expense.splitAmong.forEach(person => {
            if (shares[person] !== undefined) {
              shares[person] += shareAmount;
            }
          });
        }
      }
    });
    
    // Verificar que la suma de las partes sea igual al total de gastos
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const totalShares = Object.values(shares).reduce((sum, share) => sum + share, 0);
    
    if (Math.abs(totalShares - totalExpenses) > 0.01) {
      console.log('Advertencia: La suma de las partes no coincide con el total de gastos');
      console.log('Total de gastos:', totalExpenses.toFixed(2));
      console.log('Suma de partes:', totalShares.toFixed(2));
    }
    
    // Calcular el balance neto para cada persona (pagado - parte)
    const balances = {};
    group.participants.forEach(participant => {
      const name = participant.name;
      balances[name] = (totalPaid[name] || 0) - (shares[name] || 0);
    });
    
    // Identificar acreedores (balance positivo) y deudores (balance negativo)
    const creditors = Object.keys(balances)
      .filter(person => balances[person] > 0.01) // Usar un pequeño umbral para evitar problemas de punto flotante
      .sort((a, b) => balances[b] - balances[a]);
      
    const debtors = Object.keys(balances)
      .filter(person => balances[person] < -0.01) // Usar un pequeño umbral para evitar problemas de punto flotante
      .sort((a, b) => balances[a] - balances[b]); // Ordenar de mayor deuda a menor deuda
    
    // Calcular las transacciones de liquidación
    const transactions = [];
    const remainingBalances = { ...balances };
    
    // Para cada deudor, determinar a quién debe pagar
    debtors.forEach(debtor => {
      let amountToPayTotal = -remainingBalances[debtor]; // Convertir el balance negativo a positivo
      
      creditors.forEach(creditor => {
        if (amountToPayTotal > 0.01 && remainingBalances[creditor] > 0.01) {
          // El monto a pagar es el mínimo entre lo que debe el deudor y lo que se le debe al acreedor
          const amountToPay = Math.min(amountToPayTotal, remainingBalances[creditor]);
          
          if (amountToPay > 0.01) { // Ignorar montos muy pequeños
            transactions.push({
              from: debtor,
              to: creditor,
              amount: parseFloat(amountToPay.toFixed(2)) // Redondear a 2 decimales
            });
            
            // Actualizar los balances restantes
            amountToPayTotal -= amountToPay;
            remainingBalances[creditor] -= amountToPay;
            remainingBalances[debtor] += amountToPay; // Esto debería acercarse a cero
          }
        }
      });
    });
    
    // Registrar información de depuración
    console.log('Pagos totales:', totalPaid);
    console.log('Partes totales:', shares);
    console.log('Balances:', balances);
    console.log('Transacciones de liquidación:', transactions);
    
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
                  let paid = 0;
                  
                  // Sumar gastos donde esta persona es el pagador principal
                  expenses.forEach(expense => {
                    if (expense.paidBy === participant.name && !expense.multiplePayers) {
                      paid += parseFloat(expense.amount);
                    }
                    
                    // Sumar pagos cuando hay múltiples pagadores
                    if (expense.multiplePayers && expense.payerDetails && expense.payerDetails[participant.name]) {
                      paid += parseFloat(expense.payerDetails[participant.name]);
                    }
                  });
                  
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