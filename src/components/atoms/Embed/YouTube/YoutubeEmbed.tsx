import React, { useEffect, useRef, useState } from 'react';

export interface YouTubeEmbedProps {
  videoId: string;
  options?: YT.PlayerOptions;
  placeholder?: string | React.ReactNode;
  onLoad?: (player: YT.Player) => void;
  onError?: () => void;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  options,
  placeholder,
  onLoad,
  onError,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YT.Player | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>(videoId);
  const [apiReady, setApiReady] = useState<boolean>(false);

  // Handler when YouTube IFrame API is ready
  const onYouTubeIframeAPIReady = () => {
    setApiReady(true);
  };

  // Load YouTube IFrame API
  useEffect(() => {
    // If YT is already loaded, set apiReady to true
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    // Create a global callback for YouTube API
    (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

    // Append YouTube IFrame API script
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => {
      setError(true);
      setLoading(false);
      if (onError) onError();
    };
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      delete (window as any).onYouTubeIframeAPIReady;
    };
  }, [onError]);

  // Initialize YouTube Player when API is ready
  useEffect(() => {
    if (apiReady && ref.current && !playerRef.current) {
      setLoading(true);
      setError(false);

      playerRef.current = new window.YT.Player(ref.current, {
        videoId: currentVideoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          ...options?.playerVars,
        },
        events: {
          onReady: event => {
            setLoading(false);
            if (onLoad) onLoad(event.target);
          },
          onError: () => {
            setLoading(false);
            setError(true);
            if (onError) onError();
          },
        },
      });
    }
  }, [apiReady, currentVideoId, options, onLoad, onError]);

  // Handle videoId changes
  useEffect(() => {
    if (playerRef.current && currentVideoId !== videoId) {
      setLoading(true);
      setError(false);
      playerRef.current.loadVideoById(videoId);
      setCurrentVideoId(videoId);
    }
  }, [videoId, currentVideoId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <>
      {loading && <>{placeholder || <p>Loading video...</p>}</>}
      {error && <>{placeholder || <p>Could not load video!</p>}</>}
      <div
        ref={ref}
        style={!loading && !error ? { display: 'block' } : { display: 'none' }}
      />
    </>
  );
};
