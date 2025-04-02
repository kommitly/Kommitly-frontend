import React, { createContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../utils/Api'; // Adjust the import path as needed

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    user: null,
    goals: [],
    tasks: [],
    ai_goals: [],
    ai_tasks: []
  });

  const loadProfile = async () => {
    try {
      const fetchedProfile = await fetchUserProfile();
      setProfile(fetchedProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loadProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
