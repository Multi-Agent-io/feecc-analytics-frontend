

import { useState, useCallback } from 'react';

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig) => {
    setIsLoading(true);
    setError(null);
    let data;
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : 'GET',
        headers: requestConfig.headers ? requestConfig.headers : {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      data = await response.json();
      
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
      return data
    }
    
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;