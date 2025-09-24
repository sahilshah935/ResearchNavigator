import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { User, Mail, Phone, BookOpen, Tag, Calendar, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Select from 'react-select';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  name: string;
  phone: string;
  dob: string | null;
  currently_pursuing: string;
  interests: string[];
}

const defaultProfile: Omit<Profile, 'id'> = {
  name: '',
  phone: '',
  dob: null,
  currently_pursuing: '',
  interests: [],
};

export function Settings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const createProfile = async () => {
    if (!user) return null;

    try {
      const newProfile = {
        user_id: user.id,
        ...defaultProfile
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
      return null;
    }
  };

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // No profile found, create a new one
        const newProfile = await createProfile();
        if (newProfile) {
          setProfile(newProfile);
          setIsEditing(true); // Automatically enable editing for new profiles
          toast.success('New profile created! Please fill in your details.');
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile || !user) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          phone: profile.phone,
          currently_pursuing: profile.currently_pursuing,
          interests: profile.interests,
          dob: profile.dob,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const interestOptions = [
    { value: 'AI', label: 'Artificial Intelligence' },
    { value: 'ML', label: 'Machine Learning' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Robotics', label: 'Robotics' },
    { value: 'Computer Vision', label: 'Computer Vision' },
    { value: 'NLP', label: 'Natural Language Processing' },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-red-500 dark:text-red-400 mb-4">Failed to load profile</p>
          <button
            onClick={fetchProfile}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? (
                <>
                  <Save className="h-5 w-5" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </>
              ) : (
                <>
                  <User className="h-5 w-5" />
                  <span>Edit Profile</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={profile.dob || ''}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currently Pursuing
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={profile.currently_pursuing}
                  onChange={(e) => setProfile({ ...profile, currently_pursuing: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Research Interests
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 text-gray-400" />
                <Select
                  isMulti
                  isDisabled={!isEditing}
                  value={profile.interests.map(interest => ({ value: interest, label: interest }))}
                  onChange={(selected) => setProfile({
                    ...profile,
                    interests: selected.map(option => option.value)
                  })}
                  options={interestOptions}
                  className="pl-8"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: !isEditing ? 'rgba(107, 114, 128, 0.1)' : 'white',
                    }),
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}