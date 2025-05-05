'use client';

import { useState, useEffect } from 'react';
import { Calculator as CalcIcon, RotateCcw, Save, Clock, ArrowDownUp, ArrowLeft, DollarSign } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function Calculator() {
  // Estados para la calculadora
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(null);
  const [formula, setFormula] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState('standard'); // standard, scientific, converter, currency
  const [lastOperation, setLastOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  
  // Estados para conversión de monedas
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [currencyAmount, setCurrencyAmount] = useState('1');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});
  const [currencies, setCurrencies] = useState([]);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [currencyError, setCurrencyError] = useState('');
  
  // Unidades para conversión
  const [fromUnit, setFromUnit] = useState('cm');
  const [toUnit, setToUnit] = useState('inch');
  const [fromValue, setFromValue] = useState('0');
  const [toValue, setToValue] = useState('0');
  
  // Constantes de conversión
  const conversionFactors = {
    // Longitud
    'cm_inch': 0.393701,
    'inch_cm': 2.54,
    'm_feet': 3.28084,
    'feet_m': 0.3048,
    'km_mile': 0.621371,
    'mile_km': 1.60934,
    
    // Peso
    'kg_lb': 2.20462,
    'lb_kg': 0.453592,
    'g_oz': 0.035274,
    'oz_g': 28.3495,
    
    // Temperatura
    'celsius_fahrenheit': (c) => (c * 9/5) + 32,
    'fahrenheit_celsius': (f) => (f - 32) * 5/9,
    'celsius_kelvin': (c) => c + 273.15,
    'kelvin_celsius': (k) => k - 273.15,
    
    // Volumen
    'liter_gallon': 0.264172,
    'gallon_liter': 3.78541,
    'ml_oz_fluid': 0.033814,
    'oz_fluid_ml': 29.5735,
  };
  
  // Unidades disponibles para conversión
  const units = {
    length: ['mm', 'cm', 'm', 'km', 'inch', 'feet', 'yard', 'mile'],
    weight: ['mg', 'g', 'kg', 'ton', 'oz', 'lb', 'stone'],
    temperature: ['celsius', 'fahrenheit', 'kelvin'],
    volume: ['ml', 'liter', 'oz_fluid', 'gallon'],
    area: ['mm2', 'cm2', 'm2', 'km2', 'inch2', 'feet2', 'acre'],
  };
  
  // Efecto para cargar tipos de cambio cuando se selecciona el modo de moneda
  useEffect(() => {
    if (mode === 'currency') {
      fetchExchangeRates();
    }
  }, [mode, fromCurrency]);
  
  // Función para obtener tipos de cambio
  const fetchExchangeRates = async () => {
    if (!fromCurrency) return;
    
    setIsLoadingRates(true);
    setCurrencyError('');
    
    try {
      // Usando la API gratuita de ExchangeRate-API
      const response = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      
      if (response.data && response.data.rates) {
        setExchangeRates(response.data.rates);
        
        // Extraer las monedas disponibles
        const availableCurrencies = Object.keys(response.data.rates);
        setCurrencies(availableCurrencies);
        
        // Convertir el monto actual
        convertCurrency(currencyAmount, fromCurrency, toCurrency, response.data.rates);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      setCurrencyError('Error al obtener tipos de cambio. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setIsLoadingRates(false);
    }
  };
  
  // Función para convertir moneda
  const convertCurrency = (amount, from, to, rates = exchangeRates) => {
    if (!amount || isNaN(amount) || !rates || Object.keys(rates).length === 0) {
      setConvertedAmount('');
      return;
    }
    
    const numAmount = parseFloat(amount);
    
    if (from === to) {
      setConvertedAmount(numAmount.toFixed(2));
      return;
    }
    
    if (rates[to]) {
      const result = numAmount * rates[to];
      setConvertedAmount(result.toFixed(2));
    } else {
      setConvertedAmount('N/A');
    }
  };
  
  // Manejadores para la conversión de monedas
  const handleCurrencyAmountChange = (value) => {
    setCurrencyAmount(value);
    convertCurrency(value, fromCurrency, toCurrency);
  };
  
  const handleFromCurrencyChange = (currency) => {
    setFromCurrency(currency);
    // La actualización de tipos de cambio se maneja en el useEffect
  };
  
  const handleToCurrencyChange = (currency) => {
    setToCurrency(currency);
    convertCurrency(currencyAmount, fromCurrency, currency);
  };
  
  const switchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    // La actualización de tipos de cambio se maneja en el useEffect
  };
  
  // Funciones para la calculadora estándar
  const clearDisplay = () => {
    setDisplay('0');
    setFormula('');
    setWaitingForOperand(false);
  };
  
  const clearEntry = () => {
    setDisplay('0');
    setWaitingForOperand(false);
  };
  
  const toggleSign = () => {
    setDisplay(prev => 
      prev.charAt(0) === '-' ? prev.slice(1) : '-' + prev
    );
  };
  
  const addDecimalPoint = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };
  
  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };
  
  const performOperation = (operator) => {
    const inputValue = parseFloat(display);
    
    if (formula === '') {
      setFormula(`${inputValue} ${operator} `);
      setDisplay(inputValue.toString());
      setWaitingForOperand(true);
      return;
    }
    
    let result;
    const lastValue = parseFloat(formula.split(' ')[0]);
    const lastOperator = formula.split(' ')[1];
    
    switch (lastOperator) {
      case '+':
        result = lastValue + inputValue;
        break;
      case '-':
        result = lastValue - inputValue;
        break;
      case '×':
        result = lastValue * inputValue;
        break;
      case '÷':
        result = lastValue / inputValue;
        break;
      case '^':
        result = Math.pow(lastValue, inputValue);
        break;
      default:
        result = inputValue;
    }
    
    // Actualizar historial
    if (operator === '=') {
      setHistory(prev => [
        ...prev, 
        { formula: `${formula}${inputValue} = ${result}`, result }
      ]);
      setFormula('');
    } else {
      setFormula(`${result} ${operator} `);
    }
    
    setDisplay(result.toString());
    setWaitingForOperand(true);
    setLastOperation({ operator: lastOperator, value: inputValue });
  };
  
  // Funciones para la calculadora científica
  const calculateSquareRoot = () => {
    const inputValue = parseFloat(display);
    const result = Math.sqrt(inputValue);
    setDisplay(result.toString());
    setHistory(prev => [
      ...prev, 
      { formula: `√(${inputValue}) = ${result}`, result }
    ]);
  };
  
  const calculatePower = (power) => {
    const inputValue = parseFloat(display);
    const result = Math.pow(inputValue, power);
    setDisplay(result.toString());
    setHistory(prev => [
      ...prev, 
      { formula: `${inputValue}^${power} = ${result}`, result }
    ]);
  };
  
  const calculateTrigFunction = (func) => {
    const inputValue = parseFloat(display);
    let result;
    
    switch (func) {
      case 'sin':
        result = Math.sin(inputValue * (Math.PI / 180)); // Convertir a radianes
        break;
      case 'cos':
        result = Math.cos(inputValue * (Math.PI / 180));
        break;
      case 'tan':
        result = Math.tan(inputValue * (Math.PI / 180));
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      default:
        result = inputValue;
    }
    
    setDisplay(result.toString());
    setHistory(prev => [
      ...prev, 
      { formula: `${func}(${inputValue}) = ${result}`, result }
    ]);
  };
  
  // Funciones para la memoria
  const memoryStore = () => {
    setMemory(parseFloat(display));
  };
  
  const memoryRecall = () => {
    if (memory !== null) {
      setDisplay(memory.toString());
    }
  };
  
  const memoryClear = () => {
    setMemory(null);
  };
  
  const memoryAdd = () => {
    if (memory !== null) {
      setMemory(memory + parseFloat(display));
    } else {
      setMemory(parseFloat(display));
    }
  };
  
  const memorySubtract = () => {
    if (memory !== null) {
      setMemory(memory - parseFloat(display));
    } else {
      setMemory(-parseFloat(display));
    }
  };
  
  // Funciones para el conversor de unidades
  const handleFromValueChange = (value) => {
    setFromValue(value);
    convertValue(value, fromUnit, toUnit);
  };
  
  const handleFromUnitChange = (unit) => {
    setFromUnit(unit);
    convertValue(fromValue, unit, toUnit);
  };
  
  const handleToUnitChange = (unit) => {
    setToUnit(unit);
    convertValue(fromValue, fromUnit, unit);
  };
  
  const convertValue = (value, from, to) => {
    if (value === '' || isNaN(parseFloat(value))) {
      setToValue('');
      return;
    }
    
    const numValue = parseFloat(value);
    const conversionKey = `${from}_${to}`;
    
    if (from === to) {
      setToValue(value);
      return;
    }
    
    let result;
    if (typeof conversionFactors[conversionKey] === 'function') {
      result = conversionFactors[conversionKey](numValue);
    } else if (conversionFactors[conversionKey]) {
      result = numValue * conversionFactors[conversionKey];
    } else {
      // Intentar conversión inversa
      const inverseKey = `${to}_${from}`;
      if (typeof conversionFactors[inverseKey] === 'function') {
        // Para funciones como temperatura que no son lineales
        result = 'No disponible';
      } else if (conversionFactors[inverseKey]) {
        result = numValue / conversionFactors[inverseKey];
      } else {
        result = 'No disponible';
      }
    }
    
    if (typeof result === 'number') {
      setToValue(result.toFixed(6));
    } else {
      setToValue(result);
    }
  };
  
  // Renderizado de la calculadora
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Pestañas de modo */}
      <div className="flex border-b border-gray-200">
        <button 
          className={`flex-1 py-3 font-medium ${mode === 'standard' ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-gray-600'}`}
          onClick={() => setMode('standard')}
        >
          Standard
        </button>
        <button 
          className={`flex-1 py-3 font-medium ${mode === 'scientific' ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-gray-600'}`}
          onClick={() => setMode('scientific')}
        >
          Scientific
        </button>
        <button 
          className={`flex-1 py-3 font-medium ${mode === 'converter' ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-gray-600'}`}
          onClick={() => setMode('converter')}
        >
          Converter
        </button>
        <button 
          className={`flex-1 py-3 font-medium ${mode === 'currency' ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-gray-600'}`}
          onClick={() => setMode('currency')}
        >
          Currency
        </button>
      </div>
      
      <div className="p-4">
        {/* Botón para volver a la página principal */}
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-[#FF8C42] text-white rounded-md hover:bg-[#E67539] transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
        {/* Pantalla de la calculadora */}
        {mode !== 'converter' && (
          <div className="mb-4">
            {formula && (
              <div className="text-right text-gray-600 text-sm h-6 mb-1">
                {formula}
              </div>
            )}
            <div className="bg-gray-100 p-4 rounded-md">
              <div className="text-right text-3xl font-medium text-gray-800 break-all">
                {display}
              </div>
              {memory !== null && (
                <div className="text-right text-xs text-gray-500 mt-1">
                  M: {memory}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Conversor de monedas */}
        {mode === 'currency' && (
          <div className="mb-4">
            {currencyError && (
              <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
                {currencyError}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">From:</label>
                <div className="flex items-center mb-2">
                  <div className="bg-[#FF8C42] p-2 rounded-l-md">
                    <DollarSign size={20} className="text-white" />
                  </div>
                  <input
                    type="text"
                    value={currencyAmount}
                    onChange={(e) => handleCurrencyAmountChange(e.target.value)}
                    className="flex-1 p-3 border-y border-r border-gray-300 rounded-r-md bg-white text-gray-800"
                  />
                </div>
                <select 
                  value={fromCurrency}
                  onChange={(e) => handleFromCurrencyChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800"
                >
                  {currencies.length > 0 ? (
                    currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))
                  ) : (
                    <option value="USD">USD</option>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">To:</label>
                <div className="flex items-center mb-2">
                  <div className="bg-[#2563EB] p-2 rounded-l-md">
                    <DollarSign size={20} className="text-white" />
                  </div>
                  <input
                    type="text"
                    value={convertedAmount}
                    readOnly
                    className="flex-1 p-3 border-y border-r border-gray-300 rounded-r-md bg-gray-100 text-gray-800"
                  />
                </div>
                <select 
                  value={toCurrency}
                  onChange={(e) => handleToCurrencyChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800"
                >
                  {currencies.length > 0 ? (
                    currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))
                  ) : (
                    <option value="EUR">EUR</option>
                  )}
                </select>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <button 
                className="flex items-center px-4 py-2 bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8]"
                onClick={switchCurrencies}
                disabled={isLoadingRates}
              >
                <ArrowDownUp size={16} className="mr-2" />
                Switch
              </button>
            </div>
            
            {isLoadingRates && (
              <div className="text-center mt-4 text-gray-600">
                Cargando tipos de cambio...
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-500 text-center">
              Datos proporcionados por Exchange Rate API
            </div>
          </div>
        )}
        
        {/* Conversor de unidades */}
        {mode === 'converter' && (
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">From:</label>
                <input
                  type="text"
                  value={fromValue}
                  onChange={(e) => handleFromValueChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md mb-2 bg-white text-gray-800"
                />
                <select 
                  value={fromUnit}
                  onChange={(e) => handleFromUnitChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800"
                >
                  <optgroup label="Length">
                    {units.length.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Weight">
                    {units.weight.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Temperature">
                    {units.temperature.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Volume">
                    {units.volume.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">To:</label>
                <input
                  type="text"
                  value={toValue}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-md mb-2 bg-gray-100 text-gray-800"
                />
                <select 
                  value={toUnit}
                  onChange={(e) => handleToUnitChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800"
                >
                  <optgroup label="Length">
                    {units.length.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Weight">
                    {units.weight.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Temperature">
                    {units.temperature.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Volume">
                    {units.volume.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <button 
                className="flex items-center px-4 py-2 bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8]"
                onClick={() => {
                  const temp = fromUnit;
                  setFromUnit(toUnit);
                  setToUnit(temp);
                  convertValue(fromValue, toUnit, fromUnit);
                }}
              >
                <ArrowDownUp size={16} className="mr-2" />
                Switch
              </button>
            </div>
          </div>
        )}
        
        {/* Botones de la calculadora estándar y científica */}
        {mode !== 'converter' && (
          <div className="grid grid-cols-4 gap-2">
            {/* Botones de memoria */}
            <div className="col-span-4 grid grid-cols-5 gap-2 mb-2">
              <button 
                className="p-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={memoryClear}
              >
                MC
              </button>
              <button 
                className="p-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={memoryRecall}
              >
                MR
              </button>
              <button 
                className="p-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={memoryAdd}
              >
                M+
              </button>
              <button 
                className="p-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={memorySubtract}
              >
                M-
              </button>
              <button 
                className="p-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={memoryStore}
              >
                MS
              </button>
            </div>
            
            {/* Botones científicos */}
            {mode === 'scientific' && (
              <div className="col-span-4 grid grid-cols-4 gap-2 mb-2">
                <button 
                  className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => calculateTrigFunction('sin')}
                >
                  sin
                </button>
                <button 
                  className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => calculateTrigFunction('cos')}
                >
                  cos
                </button>
                <button 
                  className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => calculateTrigFunction('tan')}
                >
                  tan
                </button>
                <button 
                  className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => calculatePower(2)}
                >
                  x²
                </button>
                <button 
                  className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => calculateTrigFunction('log')}
                >
                  log
                </button>
                <button 
                  className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => calculateTrigFunction('ln')}
                >
                  ln
                </button>
                <button 
                  className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={calculateSquareRoot}
                >
                  √
                </button>
                <button 
                  className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => calculatePower(3)}
                >
                  x³
                </button>
              </div>
            )}
            
            {/* Botones de control */}
            <button 
              className="p-3 bg-red-100 text-red-700 rounded hover:bg-red-200"
              onClick={clearDisplay}
            >
              C
            </button>
            <button 
              className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={clearEntry}
            >
              CE
            </button>
            <button 
              className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => setDisplay(display.slice(0, -1) || '0')}
            >
              ⌫
            </button>
            <button 
              className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => performOperation('÷')}
            >
              ÷
            </button>
            
            {/* Dígitos y operaciones */}
            <button 
              className="p-3 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100"
              onClick={() => inputDigit('7')}
            >
              7
            </button>
            <button 
              className="p-3 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100"
              onClick={() => inputDigit('8')}
            >
              8
            </button>
            <button 
              className="p-3 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100"
              onClick={() => inputDigit('9')}
            >
              9
            </button>
            <button 
              className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => performOperation('×')}
            >
              ×
            </button>
            
            <button 
              className="p-3 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100"
              onClick={() => inputDigit('4')}
            >
              4
            </button>
            <button 
              className="p-3 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100"
              onClick={() => inputDigit('5')}
            >
              5
            </button>
            <button 
              className="p-3 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100"
              onClick={() => inputDigit('6')}
            >
              6
            </button>
            <button 
              className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => performOperation('-')}
            >
              -
            </button>
            
            <button 
              className="p-3 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100"
              onClick={() => inputDigit('1')}
            >
              1
            </button>
            <button 
              className="p-3 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100"
              onClick={() => inputDigit('2')}
            >
              2
            </button>
            <button 
              className="p-3 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100"
              onClick={() => inputDigit('3')}
            >
              3
            </button>
            <button 
              className="p-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => performOperation('+')}
            >
              +
            </button>
            
            <button 
              className="p-3 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100"
              onClick={toggleSign}
            >
              ±
            </button>
            <button 
              className="p-3 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100"
              onClick={() => inputDigit('0')}
            >
              0
            </button>
            <button 
              className="p-3 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100"
              onClick={addDecimalPoint}
            >
              .
            </button>
            <button 
              className="p-3 bg-[#2563EB] text-white rounded hover:bg-[#1D4ED8]"
              onClick={() => performOperation('=')}
            >
              =
            </button>
          </div>
        )}
        
        {/* Historial */}
        {mode !== 'converter' && (
          <div className="mt-4">
            <button 
              className="flex items-center text-sm text-gray-600 hover:text-[#2563EB]"
              onClick={() => setShowHistory(!showHistory)}
            >
              <Clock size={16} className="mr-1" />
              {showHistory ? 'Hide history' : 'Show history'}
            </button>
            
            {showHistory && history.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-md max-h-40 overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {history.map((item, index) => (
                    <li 
                      key={index} 
                      className="p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setDisplay(item.result.toString())}
                    >
                      <div className="text-sm text-gray-600">{item.formula}</div>
                      <div className="text-right font-medium">{item.result}</div>
                    </li>
                  ))}
                </ul>
                <div className="p-2 border-t border-gray-200">
                  <button 
                    className="text-sm text-red-600 hover:text-red-800"
                    onClick={() => setHistory([])}
                  >
                    Clear history
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}