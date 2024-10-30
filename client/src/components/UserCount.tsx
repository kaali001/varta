// src/components/UserCount.tsx
import React, { useEffect, useState } from 'react';
import config from "../config";

export const UserCount: React.FC = () => {
  const [userCount, setUserCount] = useState<number | null>(null);

  const fetchUserCount = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/user-count`);
      if (response.ok) {
        const data = await response.json();
        setUserCount(data.userCount);
      } else {
        console.error("Failed to fetch user count");
      }
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  useEffect(() => {
    fetchUserCount();
    const interval = setInterval(fetchUserCount, 1000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <>
    <h3 className="text-lg font-semibold text-gray-700 inline-block">User Count : <p className="text-lg font-bold text-blue-500 inline-block">
    {userCount !== null ? userCount : "0"}
    </p></h3>
    </>
);
};
