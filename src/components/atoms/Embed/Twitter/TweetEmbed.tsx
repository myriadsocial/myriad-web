import React, {useEffect, useRef, useState} from 'react';

import Script from 'next/script';

export interface TwitterTweetEmbedProps {
  tweetId: string;
  options?: Record<string, any>;
  placeholder?: string | React.ReactNode;
  onLoad?: (element: any) => void;
  onError?: () => void;
}

export const TweetEmbed: React.FC<TwitterTweetEmbedProps> = props => {
  const {tweetId, onLoad, onError} = props;

  const ref = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentTweetId, setTweetId] = useState<string>();
  const [initialized, setInitialized] = useState(Boolean(window['twttr']));

  useEffect(() => {
    if (currentTweetId !== props.tweetId && initialized) {
      loadTweet(props.tweetId, props.options);

      setTweetId(tweetId);
    }
  }, [props, initialized]);

  const setWidgetInitialized = () => {
    setInitialized(true);
  };

  const loadTweet = (tweetId: string, options?: Record<string, any>) => {
    setLoading(true);
    setError(false);
    const twitter = window['twttr'];

    if (!twitter) {
      setLoading(false);
      setError(true);
      console.error('Failure to load window.twttr, aborting load');
      return;
    }

    if (!twitter.widgets.createTweet) {
      setLoading(false);
      setError(true);
      console.error(`Method createTweet is not present anymore in twttr.widget api`);
      return;
    }

    twitter.widgets.createTweet(tweetId, ref?.current, options).then((element: any) => {
      setLoading(false);

      if (!element) {
        ref?.current.children.length > 0 && ref?.current.removeChild(ref?.current.children[0]);

        setError(true);
        onError && onError();
      } else {
        onLoad && onLoad(element);
      }
    });
  };

  console.log('LOADING', loading);
  console.log('ERROR', error);

  return (
    <React.Fragment>
      <Script src="https://platform.twitter.com/widgets.js" onLoad={setWidgetInitialized} />

      {loading && <React.Fragment>{props.placeholder}</React.Fragment>}
      {error && <React.Fragment>Could not load tweet!</React.Fragment>}
      <div ref={ref} />
    </React.Fragment>
  );
};
