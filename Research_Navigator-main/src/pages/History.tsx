import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Search, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface SearchHistoryItem {
  id: string;
  query: string;
  filters: any;
  created_at: string;
}

export function History() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    }
  }, [user]);

  const fetchSearchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSearchHistory(data || []);
    } catch (error) {
      toast.error('Error fetching search history');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Search History</h1>
        </div>

        <div className="space-y-6">
          {searchHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.query}</h3>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(item.created_at)}
                </div>
              </div>

              {item.filters && Object.keys(item.filters).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Applied Filters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(item.filters).map(([key, value]) => (
                      <span
                        key={key}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                      >
                        {key}: {value as string}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {searchHistory.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No search history yet</p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}