import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Layout } from '../components/Layout';
import type { AdvancedSearchParams } from '../types';
import axios from 'axios';

export function Home() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedParams, setAdvancedParams] = useState<AdvancedSearchParams>({
    paperId: '',
    paperName: '',
    paperAuthor: '',
    paperTopic: '',
    paperYear: '',
    publicationType: 'journal',
    field: '',
    keywords: [],
  });
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate advanced search inputs
  const validateAdvancedSearch = (): boolean => {
    if (
      advancedParams.paperId.trim() === '' &&
      advancedParams.paperName.trim() === '' &&
      advancedParams.paperAuthor.trim() === '' &&
      advancedParams.paperTopic.trim() === '' &&
      advancedParams.paperYear.trim() === '' &&
      advancedParams.field.trim() === '' &&
      advancedParams.keywords.length === 0
    ) {
      setError('Please fill in at least one advanced search field.');
      return false;
    }
    return true;
  };

  const fetchPapers = async () => {
    setLoading(true);
    setError('');

    // Validate advanced search if enabled
    if (showAdvanced && !validateAdvancedSearch()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://api.semanticscholar.org/graph/v1/paper/search', {
        params: {
          query: searchQuery,
          limit: 10,
          fields: 'title,authors,year,url,abstract',
          ...advancedParams,
        },
      });
      setPapers(response.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      if (searchQuery) {
        fetchPapers();
      }
    }, 500);

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
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
              >
                Advanced Search
                {showAdvanced ? (
                  <ChevronUp className="inline-block ml-2" />
                ) : (
                  <ChevronDown className="inline-block ml-2" />
                )}
              </button>
            </div>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Paper ID</label>
                  <input
                    type="text"
                    placeholder="Paper ID"
                    value={advancedParams.paperId}
                    onChange={(e) =>
                      setAdvancedParams({ ...advancedParams, paperId: e.target.value })
                    }
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Paper Name</label>
                  <input
                    type="text"
                    placeholder="Paper Name"
                    value={advancedParams.paperName}
                    onChange={(e) =>
                      setAdvancedParams({ ...advancedParams, paperName: e.target.value })
                    }
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                  <input
                    type="text"
                    placeholder="Author"
                    value={advancedParams.paperAuthor}
                    onChange={(e) =>
                      setAdvancedParams({ ...advancedParams, paperAuthor: e.target.value })
                    }
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Topic</label>
                  <input
                    type="text"
                    placeholder="Topic"
                    value={advancedParams.paperTopic}
                    onChange={(e) =>
                      setAdvancedParams({ ...advancedParams, paperTopic: e.target.value })
                    }
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                  <input
                    type="number"
                    placeholder="Year"
                    value={advancedParams.paperYear}
                    onChange={(e) =>
                      setAdvancedParams({ ...advancedParams, paperYear: e.target.value })
                    }
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Publication Type</label>
                  <select
                    value={advancedParams.publicationType}
                    onChange={(e) =>
                      setAdvancedParams({
                        ...advancedParams,
                        publicationType: e.target.value as 'journal' | 'conference',
                      })
                    }
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="journal">Journal</option>
                    <option value="conference">Conference</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Field</label>
                  <input
                    type="text"
                    placeholder="Field"
                    value={advancedParams.field}
                    onChange={(e) =>
                      setAdvancedParams({ ...advancedParams, field: e.target.value })
                    }
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Keywords</label>
                  <input
                    type="text"
                    placeholder="Keywords (comma-separated)"
                    value={advancedParams.keywords.join(', ')}
                    onChange={(e) =>
                      setAdvancedParams({
                        ...advancedParams,
                        keywords: e.target.value.split(',').map((k) => k.trim()),
                      })
                    }
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {showAdvanced && (
              <button
                onClick={() =>
                  setAdvancedParams({
                    paperId: '',
                    paperName: '',
                    paperAuthor: '',
                    paperTopic: '',
                    paperYear: '',
                    publicationType: 'journal',
                    field: '',
                    keywords: [],
                  })
                }
                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Advanced Search
              </button>
            )}

            <button
              onClick={fetchPapers}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Search className="inline-block mr-2" />
              Search
            </button>

            {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}
            {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
            <ul className="space-y-4">
              {papers.map((paper, index) => (
                <li key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 font-bold"
                  >
                    {paper.title}
                  </a>
                  <p className="text-gray-600 dark:text-gray-300">
                    {paper.authors?.map((author) => author.name).join(', ')} - {paper.year}
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