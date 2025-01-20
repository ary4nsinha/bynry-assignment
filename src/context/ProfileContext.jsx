import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { mockProfiles, mockAPI } from "../constants/mockData";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mockAPI.getProfiles();
      setProfiles(data);
      setError(null);
      return data;
    } catch (error) {
      setError(`Failed to fetch profiles: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addProfile = useCallback(async (profile) => {
    setLoading(true);
    try {
      const addedProfile = await mockAPI.addProfile(profile);
      setError(null);
      return addedProfile;
    } catch (error) {
      setError(`Failed to add profile: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (id, updates) => {
    setLoading(true);
    try {
      const updatedProfile = await mockAPI.updateProfile(id, updates);
      setProfiles((prev) =>
        prev.map((profile) => (profile.id === id ? updatedProfile : profile))
      );
      setError(null);
      return updatedProfile;
    } catch (error) {
      setError(`Failed to update profile: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProfile = useCallback(async (id) => {
    setLoading(true);
    try {
      await mockAPI.deleteProfile(id);
      setProfiles((prev) => prev.filter((profile) => profile.id !== id));
      setError(null);
    } catch (error) {
      setError(`Failed to delete profile: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    profiles,
    loading,
    error,
    getAllProfiles,
    addProfile,
    updateProfile,
    deleteProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfiles must be used within a ProfileProvider");
  }
  return context;
};

export default ProfileContext;
