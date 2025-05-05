'use client';

import { useState, useEffect } from 'react';
import { Lock, Check, X, AlertTriangle, Info, ArrowLeft, Shield, Save } from 'lucide-react';
import Link from 'next/link';

export default function PasswordChecker() {
  // Estados para el verificador de contraseñas
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0); // 0-100
  const [feedback, setFeedback] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Criterios de seguridad
  const criteria = [
    { id: 'length', label: 'At least 8 characters', met: false },
    { id: 'uppercase', label: 'Contains uppercase letters', met: false },
    { id: 'lowercase', label: 'Contains lowercase letters', met: false },
    { id: 'numbers', label: 'Contains numbers', met: false },
    { id: 'special', label: 'Contains special characters', met: false },
    { id: 'noCommon', label: 'Not a common password', met: false },
  ];
  
  // Lista de contraseñas comunes
  const commonPasswords = [
    'password', '123456', 'qwerty', 'admin', 'welcome',
    'password123', '12345678', '111111', '1234567890', 'abc123',
    'letmein', 'monkey', 'dragon', 'baseball', 'football',
    'superman', 'trustno1', 'sunshine', 'iloveyou', 'princess'
  ];
  
  // Evaluar la contraseña cuando cambia
  useEffect(() => {
    evaluatePassword(password);
  }, [password]);
  
  // Función para evaluar la seguridad de la contraseña
  const evaluatePassword = (pass) => {
    if (!pass) {
      setStrength(0);
      setFeedback([]);
      setSuggestions([]);
      return;
    }
    
    // Verificar criterios
    const meetsLength = pass.length >= 8;
    const meetsUppercase = /[A-Z]/.test(pass);
    const meetsLowercase = /[a-z]/.test(pass);
    const meetsNumbers = /[0-9]/.test(pass);
    const meetsSpecial = /[^A-Za-z0-9]/.test(pass);
    const isCommon = commonPasswords.includes(pass.toLowerCase());
    
    // Actualizar estado de los criterios
    const updatedCriteria = [
      { id: 'length', label: 'At least 8 characters', met: meetsLength },
      { id: 'uppercase', label: 'Contains uppercase letters', met: meetsUppercase },
      { id: 'lowercase', label: 'Contains lowercase letters', met: meetsLowercase },
      { id: 'numbers', label: 'Contains numbers', met: meetsNumbers },
      { id: 'special', label: 'Contains special characters', met: meetsSpecial },
      { id: 'noCommon', label: 'Not a common password', met: !isCommon },
    ];
    
    // Calcular puntuación
    let score = 0;
    if (meetsLength) score += 20;
    if (meetsUppercase) score += 15;
    if (meetsLowercase) score += 15;
    if (meetsNumbers) score += 15;
    if (meetsSpecial) score += 20;
    if (!isCommon) score += 15;
    
    // Penalización por contraseñas cortas
    if (pass.length < 6) score = Math.max(score - 20, 0);
    
    // Bonificación por longitud extra
    if (pass.length > 12) score = Math.min(score + 10, 100);
    if (pass.length > 16) score = Math.min(score + 10, 100);
    
    // Penalización por patrones repetitivos
    if (/(.+)\1{2,}/.test(pass)) score = Math.max(score - 15, 0);
    
    // Penalización por secuencias comunes
    if (/(?:abc|bcd|cde|def|efg|123|234|345|456|567|678|789)/.test(pass.toLowerCase())) {
      score = Math.max(score - 10, 0);
    }
    
    // Generar feedback
    const newFeedback = [];
    const newSuggestions = [];
    
    if (score < 50) {
      newFeedback.push('Your password is weak');
    } else if (score < 80) {
      newFeedback.push('Your password is moderate');
    } else {
      newFeedback.push('Your password is strong');
    }
    
    // Sugerencias basadas en criterios no cumplidos
    if (!meetsLength) {
      newSuggestions.push('Make your password longer (at least 8 characters)');
    }
    if (!meetsUppercase) {
      newSuggestions.push('Add uppercase letters (A-Z)');
    }
    if (!meetsLowercase) {
      newSuggestions.push('Add lowercase letters (a-z)');
    }
    if (!meetsNumbers) {
      newSuggestions.push('Add numbers (0-9)');
    }
    if (!meetsSpecial) {
      newSuggestions.push('Add special characters (!@#$%^&*)');
    }
    if (isCommon) {
      newSuggestions.push('Avoid common passwords');
    }
    if (/(.+)\1{2,}/.test(pass)) {
      newSuggestions.push('Avoid repeating patterns');
    }
    if (/(?:abc|bcd|cde|def|efg|123|234|345|456|567|678|789)/.test(pass.toLowerCase())) {
      newSuggestions.push('Avoid sequential characters');
    }
    
    setStrength(score);
    setFeedback(newFeedback);
    setSuggestions(newSuggestions);
  };
  
  // Función para guardar la contraseña en el historial
  const savePassword = () => {
    if (password && !passwordHistory.includes(password)) {
      const newHistory = [{ password, strength, date: new Date() }, ...passwordHistory];
      setPasswordHistory(newHistory.slice(0, 10)); // Mantener solo las últimas 10 contraseñas
      setPassword('');
    }
  };
  
  // Función para generar una contraseña segura
  const generatePassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\\:;?><,./-=';
    let newPassword = '';
    
    // Asegurar que la contraseña tenga al menos un carácter de cada tipo
    newPassword += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    newPassword += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    newPassword += '0123456789'[Math.floor(Math.random() * 10)];
    newPassword += '!@#$%^&*()_+~`|}{[]\\:;?><,./-='[Math.floor(Math.random() * 32)];
    
    // Completar el resto de la contraseña
    for (let i = 4; i < length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Mezclar los caracteres
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');
    
    setPassword(newPassword);
  };
  
  // Función para copiar la contraseña al portapapeles
  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password)
        .then(() => {
          alert('Password copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };
  
  // Determinar el color del indicador de fuerza
  const getStrengthColor = () => {
    if (strength < 50) return 'bg-red-500';
    if (strength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Determinar el texto de fuerza
  const getStrengthText = () => {
    if (strength < 50) return 'Weak';
    if (strength < 80) return 'Moderate';
    return 'Strong';
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Botón para volver a la página principal */}
      <div className="p-4">
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-[#FF8C42] text-white rounded-md hover:bg-[#E67539] transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
        
        {/* Título y descripción */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#2D3748] mb-2 flex items-center">
            <Shield size={24} className="mr-2 text-[#FF8C42]" />
            Password Strength Checker
          </h2>
          <p className="text-gray-600">
            Check how secure your password is and get suggestions to improve it.
          </p>
        </div>
        
        {/* Campo de contraseña */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
              placeholder="Type your password here"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        
        {/* Indicador de fuerza */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Password Strength</span>
            <span className="text-sm font-medium">{getStrengthText()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getStrengthColor()}`} 
              style={{ width: `${strength}%` }}
            ></div>
          </div>
        </div>
        
        {/* Criterios */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-[#2D3748] mb-3">Password Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {criteria.map((criterion) => (
              <div key={criterion.id} className="flex items-center">
                {criterion.met ? (
                  <Check size={16} className="text-green-500 mr-2" />
                ) : (
                  <X size={16} className="text-red-500 mr-2" />
                )}
                <span className={criterion.met ? 'text-green-700' : 'text-gray-600'}>
                  {criterion.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Feedback y sugerencias */}
        {password && (
          <div className="mb-6">
            {feedback.length > 0 && (
              <div className="p-3 mb-3 rounded-md bg-blue-50 border border-blue-200">
                <div className="flex items-start">
                  <Info size={18} className="text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Feedback</h4>
                    <ul className="mt-1 text-blue-700">
                      {feedback.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {suggestions.length > 0 && (
              <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200">
                <div className="flex items-start">
                  <AlertTriangle size={18} className="text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Suggestions</h4>
                    <ul className="mt-1 text-yellow-700">
                      {suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={generatePassword}
            className="px-4 py-2 bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-colors flex items-center"
          >
            <Lock size={16} className="mr-2" />
            Generate Strong Password
          </button>
          
          <button
            onClick={copyToClipboard}
            disabled={!password}
            className={`px-4 py-2 rounded-md flex items-center ${password ? 'bg-[#4ADE80] text-white hover:bg-[#22C55E]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'} transition-colors`}
          >
            Copy to Clipboard
          </button>
          
          <button
            onClick={savePassword}
            disabled={!password}
            className={`px-4 py-2 rounded-md flex items-center ${password ? 'bg-[#FF8C42] text-white hover:bg-[#E67539]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'} transition-colors`}
          >
            <Save size={16} className="mr-2" />
            Save Password
          </button>
        </div>
        
        {/* Historial de contraseñas */}
        {passwordHistory.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-[#2D3748]">Password History</h3>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-[#2563EB] hover:text-[#1D4ED8] flex items-center"
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
            </div>
            
            {showHistory && (
              <div className="border border-gray-200 rounded-md overflow-hidden">
                {passwordHistory.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-3 flex justify-between items-center border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.password}</div>
                      <div className="text-sm text-gray-500">
                        {item.date.toLocaleString()}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span 
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${item.strength < 50 ? 'bg-red-100 text-red-800' : item.strength < 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                      >
                        {item.strength < 50 ? 'Weak' : item.strength < 80 ? 'Moderate' : 'Strong'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Consejos de seguridad */}
        <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="text-lg font-medium text-[#2D3748] mb-3">Password Security Tips</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <Check size={16} className="text-green-500 mr-2 mt-1" />
              Use a unique password for each account
            </li>
            <li className="flex items-start">
              <Check size={16} className="text-green-500 mr-2 mt-1" />
              Consider using a password manager
            </li>
            <li className="flex items-start">
              <Check size={16} className="text-green-500 mr-2 mt-1" />
              Change your passwords regularly
            </li>
            <li className="flex items-start">
              <Check size={16} className="text-green-500 mr-2 mt-1" />
              Enable two-factor authentication when available
            </li>
            <li className="flex items-start">
              <Check size={16} className="text-green-500 mr-2 mt-1" />
              Avoid using personal information in your passwords
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}