import { useState, useCallback } from 'react';

export const useRetry = (fn, options = {}) => {
  const { maxRetries = 3, delay = 1000, onRetry } = options;
  
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setIsRetrying(true);
    setError(null);
    let attempts = 0;

    const attempt = async () => {
      try {
        const result = await fn(...args);
        setIsRetrying(false);
        setRetryCount(0);
        return result;
      } catch (err) {
        attempts++;
        setRetryCount(attempts);
        setError(err);

        if (attempts < maxRetries && onRetry) {
          onRetry(attempts, err);
          await new Promise(resolve => setTimeout(resolve, delay));
          return attempt();
        }

        setIsRetrying(false);
        throw err;
      }
    };

    return attempt();
  }, [fn, maxRetries, delay, onRetry]);

  const reset = useCallback(() => {
    setIsRetrying(false);
    setRetryCount(0);
    setError(null);
  }, []);

  return {
    execute,
    isRetrying,
    retryCount,
    error,
    reset
  };
};

export default useRetry;
