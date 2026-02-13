'use client';

import { useState } from 'react';

interface QueryFormProps {
  onSubmit: (productName: string) => void;
  loading: boolean;
}

export default function QueryForm({ onSubmit, loading }: QueryFormProps) {
  const [productName, setProductName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productName.trim()) {
      onSubmit(productName.trim());
    }
  };

  const exampleProducts = [
    'A2 Milk Full Cream 2L',
    'Tamiya panel line accent color Black',
    'Coca Cola 1.25L',
    'Nutella 400g',
  ];

  const handleExampleClick = (example: string) => {
    setProductName(example);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Enter Product Name
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="product-name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., A2 Milk Full Cream 2L"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !productName.trim()}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Example products */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Example Products:
        </p>
        <div className="flex flex-wrap gap-2">
          {exampleProducts.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={loading}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
