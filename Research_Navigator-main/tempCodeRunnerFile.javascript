import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Layout } from '../components/Layout';
import axios from 'axios';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPapers = async () => {
      if (!searchQuery.trim()) {
        setPapers([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.semanticscholar.org/graph/v1/paper/search`,
          {
            params: {
              query: searchQuery,
              limit: 5,
              fields: 'title,authors,year,url,abstract',
            },
          }
        );
        setPapers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching research papers:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(fetchPapers, 500); // Debounce API call by 500ms
    return () => clearTimeout(debounceFetch);
  }, [searchQuery]);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="What paper do you want?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}

            <ul className="space-y-4">
              {papers.map((paper) => (
                <li key={paper.url} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 font-bold"
                  >
                    {paper.title}
                  </a>
                  <p className="text-gray-600 dark:text-gray-300">
                    {paper.authors.map((author) => author.name).join(', ')} - {paper.year}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">{paper.abstract}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}