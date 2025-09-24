import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  dob: string | null;
  currently_pursuing: string;
  interests: string[];
  phone: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  description: string;
}

export interface SearchHistory {
  id: string;
  user_id: string;
  query: string;
  filters: Record<string, any>;
}

export const createProfile = async (userId: string, userData: Partial<Profile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: userId,
          name: userData.name,
          dob: userData.dob,
          currently_pursuing: userData.currently_pursuing,
          interests: userData.interests || [],
          phone: userData.phone,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const createFolder = async (userId: string, name: string, description: string) => {
  try {
    const { data, error } = await supabase
      .from('folders')
      .insert([
        {
          user_id: userId,
          name,
          description,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

export const getFolders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
};

export const updateFolder = async (folderId: string, updates: Partial<Folder>) => {
  try {
    const { data, error } = await supabase
      .from('folders')
      .update(updates)
      .eq('id', folderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating folder:', error);
    throw error;
  }
};

export const deleteFolder = async (folderId: string) => {
  try {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};

export const addSearchHistory = async (userId: string, query: string, filters: Record<string, any>) => {
  try {
    const { data, error } = await supabase
      .from('search_history')
      .insert([
        {
          user_id: userId,
          query,
          filters,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding search history:', error);
    throw error;
  }
};

export const getSearchHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching search history:', error);
    throw error;
  }
};