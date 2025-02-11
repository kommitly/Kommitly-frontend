import React, { createContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../utils/Api'; // Adjust the import path as needed

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const fetchedProfile = await fetchUserProfile();
        setProfile(fetchedProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    loadProfile();
  }, []);

  const addGoal = (newGoal) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      goals: [...prevProfile.goals, newGoal],
    }));
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, addGoal }}>
      {children}
    </ProfileContext.Provider>
  );
};