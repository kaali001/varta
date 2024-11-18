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
    const interval = setInterval(fetchUserCount, 1000); 

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <span className="text-gray-700 text-sm font-medium">
      Active User -{" "}
      <span className="text-pink-500 font-bold">
        {userCount !== null ? userCount : "0"}
      </span>
    </span>
  );
};
