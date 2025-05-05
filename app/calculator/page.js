'use client';

import Calculator from '../components/calculator/Calculator';

export default function CalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#2D3748] mb-6">Advanced Calculator</h1>
      <p className="text-gray-600 mb-8">
        A powerful calculator with scientific functions, unit conversion and memory.
      </p>
      
      <Calculator />
    </div>
  );
}