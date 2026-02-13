'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PriceData } from '@/types';
import QueryForm from '@/components/QueryForm';
import ResultsDisplay from '@/components/ResultsDisplay';

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PriceData | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleQuery = async (productName: string) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_name: productName }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        if (response.status === 401) {
          router.push('/login');
        } else {
          setError(data.error || 'Query failed');
        }
      }
    } catch (err) {
      setError('Network error, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleDownload = async (format: 'csv' | 'json') => {
    if (!result) return;

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: result, format }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `price-data-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Download failed');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Download failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Price Comparison
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time Australian retail price tracker
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Query Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <QueryForm onSubmit={handleQuery} loading={loading} />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900">
                    Querying prices...
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Scraping data and analyzing with AI, please wait
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Query Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <ResultsDisplay data={result} onDownload={handleDownload} />
          )}
        </div>
      </main>
    </div>
  );
}
