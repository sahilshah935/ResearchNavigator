import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Plus, Folder, X, Edit2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Folder {
  id: string;
  name: string;
  description: string;
}

export function TaggedPages() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolder, setNewFolder] = useState({ name: '', description: '' });
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFolders();
    }
  }, [user]);

  const fetchFolders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFolders(data || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to load folders');
    }
  };

  const handleCreateFolder = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('folders')
        .insert([
          {
            user_id: user.id,
            name: newFolder.name,
            description: newFolder.description,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setFolders([data, ...folders]);
      setIsCreating(false);
      setNewFolder({ name: '', description: '' });
      toast.success('Folder created successfully');
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const handleUpdateFolder = async (id: string) => {
    if (!user) return;

    try {
      const folderToUpdate = folders.find(f => f.id === id);
      if (!folderToUpdate) return;

      const { error } = await supabase
        .from('folders')
        .update({
          name: folderToUpdate.name,
          description: folderToUpdate.description,
        })
        .eq('id', id);

      if (error) throw error;

      setEditingFolder(null);
      toast.success('Folder updated successfully');
    } catch (error) {
      console.error('Error updating folder:', error);
      toast.error('Failed to update folder');
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFolders(folders.filter(f => f.id !== id));
      toast.success('Folder deleted successfully');
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tagged Pages</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>New Folder</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <Folder className="h-6 w-6 text-green-600 dark:text-green-400" />
                    {editingFolder === folder.id ? (
                      <input
                        type="text"
                        value={folder.name}
                        onChange={(e) => setFolders(folders.map(f => 
                          f.id === folder.id ? { ...f, name: e.target.value } : f
                        ))}
                        className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                      />
                    ) : (
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{folder.name}</h3>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {editingFolder === folder.id ? (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUpdateFolder(folder.id)}
                        className="text-green-600 dark:text-green-400"
                      >
                        <Save className="h-5 w-5" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditingFolder(folder.id)}
                        className="text-gray-600 dark:text-gray-400"
                      >
                        <Edit2 className="h-5 w-5" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteFolder(folder.id)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
                {editingFolder === folder.id ? (
                  <textarea
                    value={folder.description}
                    onChange={(e) => setFolders(folders.map(f => 
                      f.id === folder.id ? { ...f, description: e.target.value } : f
                    ))}
                    className="w-full bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">{folder.description}</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Create Folder Modal */}
        <AnimatePresence>
          {isCreating && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setIsCreating(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 flex items-center justify-center z-50"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create New Folder</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Folder Name
                      </label>
                      <input
                        type="text"
                        value={newFolder.name}
                        onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={newFolder.description}
                        onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setIsCreating(false)}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateFolder}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}