'use client';

import { useState, useEffect } from 'react';
import { Download, Save, Trash, Plus, Printer, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function InvoiceGenerator() {
  // Invoice information states
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Información del negocio
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessTaxId, setBusinessTaxId] = useState('');
  
  // Información del cliente
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  
  // Invoice items
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0, amount: 0 }]);
  
  // Totals
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Notes and terms
  const [notes, setNotes] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Payment due in 30 days');
  
  // Saved templates
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState('');
  
  // Display state
  const [previewMode, setPreviewMode] = useState(false);
  
  // Load saved templates on startup
  useEffect(() => {
    const savedTemplates = localStorage.getItem('invoiceTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
    
    // Set current date as default
    const today = new Date().toISOString().split('T')[0];
    setInvoiceDate(today);
    
    // Set default due date (30 days later)
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    setDueDate(thirtyDaysLater.toISOString().split('T')[0]);
    
    // Generate default invoice number
    setInvoiceNumber(`INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
  }, []);
  
  // Calculate subtotal, taxes and total when items or tax rate change
  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setSubtotal(newSubtotal);
    
    const newTaxAmount = newSubtotal * (taxRate / 100);
    setTaxAmount(newTaxAmount);
    
    setTotal(newSubtotal + newTaxAmount);
  }, [items, taxRate]);
  
  // Update item amount when quantity or price changes
  const updateItemAmount = (index, quantity, price) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    newItems[index].price = price;
    newItems[index].amount = quantity * price;
    setItems(newItems);
  };
  
  // Add a new item
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0, amount: 0 }]);
  };
  
  // Remove an item
  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  
  // Save as template
  const saveAsTemplate = () => {
    if (!businessName) {
      alert('Please enter at least the business name to save the template');
      return;
    }
    
    const templateName = prompt('Template name:');
    if (!templateName) return;
    
    const template = {
      name: templateName,
      businessName,
      businessAddress,
      businessPhone,
      businessEmail,
      businessTaxId,
      paymentTerms,
      taxRate,
      notes
    };
    
    const newTemplates = [...templates, template];
    setTemplates(newTemplates);
    setCurrentTemplate(templateName);
    
    // Save to localStorage
    localStorage.setItem('invoiceTemplates', JSON.stringify(newTemplates));
    
    alert('Template saved successfully');
  };
  
  // Load a template
  const loadTemplate = (templateName) => {
    const template = templates.find(t => t.name === templateName);
    if (!template) return;
    
    setBusinessName(template.businessName || '');
    setBusinessAddress(template.businessAddress || '');
    setBusinessPhone(template.businessPhone || '');
    setBusinessEmail(template.businessEmail || '');
    setBusinessTaxId(template.businessTaxId || '');
    setPaymentTerms(template.paymentTerms || 'Payment due in 30 days');
    setTaxRate(template.taxRate || 0);
    setNotes(template.notes || '');
    setCurrentTemplate(templateName);
  };
  
  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Style configuration
    const primaryColor = '#FF8C42';
    doc.setDrawColor(primaryColor);
    doc.setFillColor(primaryColor);
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(primaryColor);
    doc.text('Invoice', 105, 20, { align: 'center' });
    
    // Business information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(businessName, 20, 40);
    doc.setFontSize(10);
    doc.text(businessAddress, 20, 45);
    doc.text(`Phone: ${businessPhone}`, 20, 50);
    doc.text(`Email: ${businessEmail}`, 20, 55);
    doc.text(`Tax ID: ${businessTaxId}`, 20, 60);
    
    // Invoice information
    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoiceNumber}`, 150, 40);
    doc.text(`Date: ${invoiceDate}`, 150, 45);
    doc.text(`Due date: ${dueDate}`, 150, 50);
    
    // Client information
    doc.setFontSize(11);
    doc.text('Bill to:', 20, 75);
    doc.setFontSize(10);
    doc.text(clientName, 20, 80);
    doc.text(clientAddress, 20, 85);
    doc.text(`Phone: ${clientPhone}`, 20, 90);
    doc.text(`Email: ${clientEmail}`, 20, 95);
    
    // Items table
    const tableColumn = ['Description', 'Quantity', 'Price', 'Amount'];
    const tableRows = [];
    
    items.forEach(item => {
      const itemData = [
        item.description,
        item.quantity,
        `${item.price.toFixed(2)} €`,
        `${(item.quantity * item.price).toFixed(2)} €`
      ];
      tableRows.push(itemData);
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 105,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: primaryColor },
      margin: { left: 20, right: 20 }
    });
    
    // Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text('Subtotal:', 140, finalY);
    doc.text(`${subtotal.toFixed(2)} €`, 170, finalY, { align: 'right' });
    
    doc.text(`Tax (${taxRate}%):`, 140, finalY + 5);
    doc.text(`${taxAmount.toFixed(2)} €`, 170, finalY + 5, { align: 'right' });
    
    doc.setFontSize(11);
    doc.text('Total:', 140, finalY + 12);
    doc.text(`${total.toFixed(2)} €`, 170, finalY + 12, { align: 'right' });
    
    // Terms and conditions
    doc.setFontSize(10);
    doc.text('Terms and conditions:', 20, finalY + 25);
    doc.text(`Payment terms: ${paymentTerms}`, 20, finalY + 30);
    
    if (notes) {
      doc.text('Notes:', 20, finalY + 40);
      doc.text(notes, 20, finalY + 45);
    }
    
    // Save PDF
    doc.save(`Invoice-${invoiceNumber}.pdf`);
  };
  
  // Print invoice
  const printInvoice = () => {
    setPreviewMode(true);
    setTimeout(() => {
      window.print();
      setPreviewMode(false);
    }, 100);
  };
  
  // Clear form
  const clearForm = () => {
    if (!confirm('Are you sure you want to clear the form? All unsaved data will be lost.')) {
      return;
    }
    
    setClientName('');
    setClientAddress('');
    setClientEmail('');
    setClientPhone('');
    setItems([{ description: '', quantity: 1, price: 0, amount: 0 }]);
    setNotes('');
    
    // Keep business information and template
    // Generate new invoice number
    setInvoiceNumber(`INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
    
    // Update dates
    const today = new Date().toISOString().split('T')[0];
    setInvoiceDate(today);
    
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    setDueDate(thirtyDaysLater.toISOString().split('T')[0]);
  };
  
  return (
    <div className={`invoice-generator ${previewMode ? 'print-mode' : ''}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-6 print:hidden">
        <button 
          onClick={generatePDF} 
          className="flex items-center gap-1 bg-[#FF8C42] hover:bg-[#E67539] text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Download size={16} />
          Download PDF
        </button>
        
        <button 
          onClick={printInvoice} 
          className="flex items-center gap-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Printer size={16} />
          Print
        </button>
        
        <button 
          onClick={saveAsTemplate} 
          className="flex items-center gap-1 bg-[#10B981] hover:bg-[#059669] text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Save size={16} />
          Save as Template
        </button>
        
        <button 
          onClick={clearForm} 
          className="flex items-center gap-1 bg-[#EF4444] hover:bg-[#DC2626] text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Trash size={16} />
          Clear
        </button>
        
        {templates.length > 0 && (
          <select 
            value={currentTemplate} 
            onChange={(e) => loadTemplate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select template</option>
            {templates.map((template, index) => (
              <option key={index} value={template.name}>{template.name}</option>
            ))}
          </select>
        )}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 print:shadow-none print:border-none">
        {/* Invoice header */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-[#FF8C42] flex items-center">
              <FileText className="mr-2" size={24} />
              Invoice
            </h2>
            <div className="mt-4 space-y-1">
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <input 
                  type="text" 
                  value={invoiceNumber} 
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 print:border-none"
                />
              </div>
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                <input 
                  type="date" 
                  value={invoiceDate} 
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 print:border-none"
                />
              </div>
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)}
                  className="border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 print:border-none"
                />
              </div>
            </div>
          </div>
          
          {/* Business information */}
          <div className="bg-gray-50 p-4 rounded-md print:bg-transparent">
            <h3 className="font-medium text-gray-700 mb-2">Business Information</h3>
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Business Name" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 bg-transparent print:border-none"
              />
              <textarea 
                placeholder="Address" 
                value={businessAddress} 
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 bg-transparent resize-none print:border-none"
                rows="2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Phone" 
                  value={businessPhone} 
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 bg-transparent print:border-none"
                />
                <input 
                  type="text" 
                  placeholder="Tax ID" 
                  value={businessTaxId} 
                  onChange={(e) => setBusinessTaxId(e.target.value)}
                  className="border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 bg-transparent print:border-none"
                />
              </div>
              <input 
                type="email" 
                placeholder="Email" 
                value={businessEmail} 
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 bg-transparent print:border-none"
              />
            </div>
          </div>
        </div>
        
        {/* Client information */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-700 mb-2 border-b pb-2">Bill to</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <input 
                type="text" 
                placeholder="Client Name" 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 print:border-none"
              />
              <textarea 
                placeholder="Client Address" 
                value={clientAddress} 
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 mt-2 resize-none print:border-none"
                rows="2"
              />
            </div>
            <div>
              <input 
                type="email" 
                placeholder="Client Email" 
                value={clientEmail} 
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 print:border-none"
              />
              <input 
                type="text" 
                placeholder="Client Phone" 
                value={clientPhone} 
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 mt-2 print:border-none"
              />
            </div>
          </div>
        </div>
        
        {/* Items table */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-700 mb-2 border-b pb-2">Invoice Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full mt-3">
              <thead>
                <tr className="bg-gray-50 print:bg-transparent">
                  <th className="text-left py-2 px-2 text-sm font-medium text-gray-600">Description</th>
                  <th className="text-right py-2 px-2 text-sm font-medium text-gray-600 w-24">Quantity</th>
                  <th className="text-right py-2 px-2 text-sm font-medium text-gray-600 w-32">Price (€)</th>
                  <th className="text-right py-2 px-2 text-sm font-medium text-gray-600 w-32">Amount (€)</th>
                  <th className="w-10 print:hidden"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-2">
                      <input 
                        type="text" 
                        placeholder="Item description" 
                        value={item.description} 
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].description = e.target.value;
                          setItems(newItems);
                        }}
                        className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-1 py-1 print:border-none"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => {
                          const quantity = parseInt(e.target.value) || 0;
                          updateItemAmount(index, quantity, item.price);
                        }}
                        className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-1 py-1 text-right print:border-none"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        value={item.price} 
                        onChange={(e) => {
                          const price = parseFloat(e.target.value) || 0;
                          updateItemAmount(index, item.quantity, price);
                        }}
                        className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-1 py-1 text-right print:border-none"
                      />
                    </td>
                    <td className="py-2 px-2 text-right">
                      {(item.quantity * item.price).toFixed(2)}
                    </td>
                    <td className="py-2 px-2 print:hidden">
                      {items.length > 1 && (
                        <button 
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove item"
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button 
            onClick={addItem}
            className="flex items-center gap-1 text-[#3B82F6] hover:text-[#2563EB] mt-3 text-sm font-medium print:hidden"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
        
        {/* Totals */}
        <div className="flex flex-col items-end mb-8">
          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Tax:</span>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={taxRate} 
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-12 border-b border-gray-300 focus:border-[#FF8C42] outline-none px-1 py-0 text-right print:border-none"
                />
                <span className="ml-1">%</span>
              </div>
              <span>{taxAmount.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>
        
        {/* Terms and conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Terms and Conditions</h3>
            <input 
              type="text" 
              value={paymentTerms} 
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 print:border-none"
            />
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Notes</h3>
            <textarea 
              placeholder="Additional notes for the client..." 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 resize-none print:border-none"
              rows="3"
            />
          </div>
        </div>
      </div>
      
      {/* Estilos para impresión */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-mode, .print-mode * {
            visibility: visible;
          }
          .print-mode {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-mode input, .print-mode textarea, .print-mode select {
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}