import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";

import { fetchDashboardStats } from "../utils/Api"; // adjust path if needed

const DashboardStatsContext = createContext();
export const useDashboardStats = () => useContext(DashboardStatsContext);

export const DashboardStatsProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchDashboardStats();
      setStats(data);

    } catch (err) {
      console.error("Error loading dashboard stats:", err);
      setError(err);

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <DashboardStatsContext.Provider
      value={{
        stats,
        loading,
        error,
        reloadStats: loadStats
      }}
    >
      {children}
    </DashboardStatsContext.Provider>
  );
};
