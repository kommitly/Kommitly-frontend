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
    const token = localStorage.getItem("token"); // Check if token exists
    if (!token) return; // No token, exit early
    
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
