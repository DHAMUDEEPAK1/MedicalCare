import { useRef, useEffect, useState, useCallback } from 'react';

interface UseTranscriptAutoScrollOptions {
  /**
   * Distance from bottom (in pixels) to consider "near bottom"
   * Default: 100
   */
  threshold?: number;
  /**
   * Enable smooth scrolling behavior
   * Default: true
   */
  smooth?: boolean;
}

export function useTranscriptAutoScroll(
  transcript: unknown[],
  options: UseTranscriptAutoScrollOptions = {}
) {
  const { threshold = 100, smooth = true } = options;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Check if user is near bottom of scroll container
  const checkIfNearBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return false;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= threshold;
  }, [threshold]);

  // Handle scroll events to track user position
  const handleScroll = useCallback(() => {
    const nearBottom = checkIfNearBottom();
    setIsNearBottom(nearBottom);
    setShouldAutoScroll(nearBottom);
  }, [checkIfNearBottom]);

  // Scroll to bottom function
  const scrollToBottom = useCallback((force = false) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Only auto-scroll if user is near bottom or force is true
    if (force || shouldAutoScroll) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, [shouldAutoScroll, smooth]);

  // Auto-scroll when transcript changes
  useEffect(() => {
    if (transcript.length > 0) {
      // Small delay to ensure DOM has updated
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [transcript, scrollToBottom]);

  // Initial scroll on mount
  useEffect(() => {
    scrollToBottom(true);
  }, []);

  return {
    scrollContainerRef,
    bottomSentinelRef,
    isNearBottom,
    scrollToBottom,
    handleScroll,
  };
}
