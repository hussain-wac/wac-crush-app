import { useState, useCallback } from 'react';
import { crushAPI } from '../services/api';
import useStore from '../store/useStore';

function useSwipe() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const { nextUser, addMatch } = useStore();

  const swipe = useCallback(async (targetUserId, direction) => {
    if (isProcessing) return null;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await crushAPI.swipe(targetUserId, direction);

      if (result.matched && result.matchedUser) {
        addMatch(result.matchedUser);
      }

      nextUser();

      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Swipe failed');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, nextUser, addMatch]);

  const swipeLeft = useCallback((targetUserId) => {
    return swipe(targetUserId, 'left');
  }, [swipe]);

  const swipeRight = useCallback((targetUserId) => {
    return swipe(targetUserId, 'right');
  }, [swipe]);

  return {
    swipe,
    swipeLeft,
    swipeRight,
    isProcessing,
    error
  };
}

export default useSwipe;
