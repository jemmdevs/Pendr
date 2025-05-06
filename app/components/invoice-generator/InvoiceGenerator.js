'use client';

import { useState, useEffect } from 'react';
import { Download, Save, Trash, Plus, Printer, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function InvoiceGenerator() {
  // Estados para la información de la factura
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
  
  // Elementos de la factura
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0, amount: 0 }]);
  
  // Totales
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Notas y términos
  const [notes, setNotes] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Pago a 30 días');
  
  // Plantillas guardadas
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState('');
  
  // Estado de visualización
  const [previewMode, setPreviewMode] = useState(false);
  
  // Cargar plantillas guardadas al iniciar
  useEffect(() => {
    const savedTemplates = localStorage.getItem('invoiceTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
    
    // Establecer fecha actual por defecto
    const today = new Date().toISOString().split('T')[0];
    setInvoiceDate(today);
    
    // Establecer fecha de vencimiento por defecto (30 días después)
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    setDueDate(thirtyDaysLater.toISOString().split('T')[0]);
    
    // Generar número de factura por defecto
    setInvoiceNumber(`INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
  }, []);
  
  // Calcular subtotal, impuestos y total cuando cambian los items o la tasa de impuestos
  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setSubtotal(newSubtotal);
    
    const newTaxAmount = newSubtotal * (taxRate / 100);
    setTaxAmount(newTaxAmount);
    
    setTotal(newSubtotal + newTaxAmount);
  }, [items, taxRate]);
  
  // Actualizar el monto de un item cuando cambia la cantidad o el precio
  const updateItemAmount = (index, quantity, price) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    newItems[index].price = price;
    newItems[index].amount = quantity * price;
    setItems(newItems);
  };
  
  // Agregar un nuevo item
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0, amount: 0 }]);
  };
  
  // Eliminar un item
  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  
  // Guardar como plantilla
  const saveAsTemplate = () => {
    if (!businessName) {
      alert('Por favor, ingrese al menos el nombre del negocio para guardar la plantilla');
      return;
    }
    
    const templateName = prompt('Nombre de la plantilla:');
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
    
    // Guardar en localStorage
    localStorage.setItem('invoiceTemplates', JSON.stringify(newTemplates));
    
    alert('Plantilla guardada correctamente');
  };
  
  // Cargar una plantilla
  const loadTemplate = (templateName) => {
    const template = templates.find(t => t.name === templateName);
    if (!template) return;
    
    setBusinessName(template.businessName || '');
    setBusinessAddress(template.businessAddress || '');
    setBusinessPhone(template.businessPhone || '');
    setBusinessEmail(template.businessEmail || '');
    setBusinessTaxId(template.businessTaxId || '');
    setPaymentTerms(template.paymentTerms || 'Pago a 30 días');
    setTaxRate(template.taxRate || 0);
    setNotes(template.notes || '');
    setCurrentTemplate(templateName);
  };
  
  // Generar PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Configuración de estilos
    const primaryColor = '#FF8C42';
    doc.setDrawColor(primaryColor);
    doc.setFillColor(primaryColor);
    
    // Título
    doc.setFontSize(24);
    doc.setTextColor(primaryColor);
    doc.text('FACTURA', 105, 20, { align: 'center' });
    
    // Información del negocio
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(businessName, 20, 40);
    doc.setFontSize(10);
    doc.text(businessAddress, 20, 45);
    doc.text(`Tel: ${businessPhone}`, 20, 50);
    doc.text(`Email: ${businessEmail}`, 20, 55);
    doc.text(`NIF/CIF: ${businessTaxId}`, 20, 60);
    
    // Información de la factura
    doc.setFontSize(10);
    doc.text(`Factura #: ${invoiceNumber}`, 150, 40);
    doc.text(`Fecha: ${invoiceDate}`, 150, 45);
    doc.text(`Vencimiento: ${dueDate}`, 150, 50);
    
    // Información del cliente
    doc.setFontSize(11);
    doc.text('Facturar a:', 20, 75);
    doc.setFontSize(10);
    doc.text(clientName, 20, 80);
    doc.text(clientAddress, 20, 85);
    doc.text(`Tel: ${clientPhone}`, 20, 90);
    doc.text(`Email: ${clientEmail}`, 20, 95);
    
    // Tabla de items
    const tableColumn = ['Descripción', 'Cantidad', 'Precio', 'Importe'];
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
    
    // Totales
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text('Subtotal:', 140, finalY);
    doc.text(`${subtotal.toFixed(2)} €`, 170, finalY, { align: 'right' });
    
    doc.text(`IVA (${taxRate}%):`, 140, finalY + 5);
    doc.text(`${taxAmount.toFixed(2)} €`, 170, finalY + 5, { align: 'right' });
    
    doc.setFontSize(11);
    doc.text('Total:', 140, finalY + 12);
    doc.text(`${total.toFixed(2)} €`, 170, finalY + 12, { align: 'right' });
    
    // Términos y notas
    doc.setFontSize(10);
    doc.text('Términos de pago:', 20, finalY + 25);
    doc.text(paymentTerms, 20, finalY + 30);
    
    if (notes) {
      doc.text('Notas:', 20, finalY + 40);
      doc.text(notes, 20, finalY + 45);
    }
    
    // Guardar PDF
    doc.save(`Factura_${invoiceNumber}.pdf`);
  };
  
  // Imprimir factura
  const printInvoice = () => {
    setPreviewMode(true);
    setTimeout(() => {
      window.print();
      setPreviewMode(false);
    }, 100);
  };
  
  // Limpiar formulario
  const clearForm = () => {
    if (!confirm('¿Está seguro de que desea limpiar el formulario? Se perderán todos los datos no guardados.')) {
      return;
    }
    
    setClientName('');
    setClientAddress('');
    setClientEmail('');
    setClientPhone('');
    setItems([{ description: '', quantity: 1, price: 0, amount: 0 }]);
    setNotes('');
    
    // Mantener la información del negocio y la plantilla
    // Generar nuevo número de factura
    setInvoiceNumber(`INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
    
    // Actualizar fechas
    const today = new Date().toISOString().split('T')[0];
    setInvoiceDate(today);
    
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    setDueDate(thirtyDaysLater.toISOString().split('T')[0]);
  };
  
  return (
    <div className={`invoice-generator ${previewMode ? 'print-mode' : ''}`}>
      {/* Barra de herramientas */}
      <div className="flex flex-wrap gap-2 mb-6 print:hidden">
        <button 
          onClick={generatePDF} 
          className="flex items-center gap-1 bg-[#FF8C42] hover:bg-[#E67539] text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Download size={16} />
          Descargar PDF
        </button>
        
        <button 
          onClick={printInvoice} 
          className="flex items-center gap-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Printer size={16} />
          Imprimir
        </button>
        
        <button 
          onClick={saveAsTemplate} 
          className="flex items-center gap-1 bg-[#10B981] hover:bg-[#059669] text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Save size={16} />
          Guardar plantilla
        </button>
        
        <button 
          onClick={clearForm} 
          className="flex items-center gap-1 bg-[#EF4444] hover:bg-[#DC2626] text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Trash size={16} />
          Limpiar
        </button>
        
        {templates.length > 0 && (
          <select 
            value={currentTemplate} 
            onChange={(e) => loadTemplate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Seleccionar plantilla</option>
            {templates.map((template, index) => (
              <option key={index} value={template.name}>{template.name}</option>
            ))}
          </select>
        )}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 print:shadow-none print:border-none">
        {/* Encabezado de la factura */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-[#FF8C42] flex items-center">
              <FileText className="mr-2" size={24} />
              FACTURA
            </h2>
            <div className="mt-4 space-y-1">
              <div className="flex items-center">
                <label className="w-32 text-sm font-medium text-gray-600">Nº de Factura:</label>
                <input 
                  type="text" 
                  value={invoiceNumber} 
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 print:border-none"
                />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm font-medium text-gray-600">Fecha:</label>
                <input 
                  type="date" 
                  value={invoiceDate} 
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 print:border-none"
                />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm font-medium text-gray-600">Vencimiento:</label>
                <input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)}
                  className="border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 print:border-none"
                />
              </div>
            </div>
          </div>
          
          {/* Información del negocio */}
          <div className="bg-gray-50 p-4 rounded-md print:bg-transparent">
            <h3 className="font-medium text-gray-700 mb-2">Información del negocio</h3>
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Nombre del negocio" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 bg-transparent print:border-none"
              />
              <textarea 
                placeholder="Dirección" 
                value={businessAddress} 
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 bg-transparent resize-none print:border-none"
                rows="2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Teléfono" 
                  value={businessPhone} 
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 bg-transparent print:border-none"
                />
                <input 
                  type="text" 
                  placeholder="NIF/CIF" 
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
        
        {/* Información del cliente */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-700 mb-2 border-b pb-2">Facturar a</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <input 
                type="text" 
                placeholder="Nombre del cliente" 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 print:border-none"
              />
              <textarea 
                placeholder="Dirección del cliente" 
                value={clientAddress} 
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 mt-2 resize-none print:border-none"
                rows="2"
              />
            </div>
            <div>
              <input 
                type="email" 
                placeholder="Email del cliente" 
                value={clientEmail} 
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 print:border-none"
              />
              <input 
                type="text" 
                placeholder="Teléfono del cliente" 
                value={clientPhone} 
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 mt-2 print:border-none"
              />
            </div>
          </div>
        </div>
        
        {/* Tabla de items */}
        <div className="mb-8">
          <h3 className="font-medium text-gray-700 mb-2 border-b pb-2">Detalles de la factura</h3>
          <div className="overflow-x-auto">
            <table className="w-full mt-3">
              <thead>
                <tr className="bg-gray-50 print:bg-transparent">
                  <th className="text-left py-2 px-2 text-sm font-medium text-gray-600">Descripción</th>
                  <th className="text-right py-2 px-2 text-sm font-medium text-gray-600 w-24">Cantidad</th>
                  <th className="text-right py-2 px-2 text-sm font-medium text-gray-600 w-32">Precio (€)</th>
                  <th className="text-right py-2 px-2 text-sm font-medium text-gray-600 w-32">Importe (€)</th>
                  <th className="w-10 print:hidden"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-2">
                      <input 
                        type="text" 
                        placeholder="Descripción del item" 
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
                          title="Eliminar item"
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
            Agregar item
          </button>
        </div>
        
        {/* Totales */}
        <div className="flex flex-col items-end mb-8">
          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">IVA:</span>
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
        
        {/* Términos y notas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Términos de pago</h3>
            <input 
              type="text" 
              value={paymentTerms} 
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-[#FF8C42] outline-none px-2 py-1 print:border-none"
            />
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Notas</h3>
            <textarea 
              placeholder="Notas adicionales para el cliente" 
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