import React, {useEffect, useState} from 'react';

import {generateRedditEmbedUrl} from 'src/helpers/url';

export interface RedditPostEmbedProps {
  url: string;
  options?: Record<string, any>;
  placeholder?: string | React.ReactNode;
  onLoad?: (element: any) => void;
  onError?: () => void;
}

export const RedditEmbed: React.FC<RedditPostEmbedProps> = props => {
  const {url} = props;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const embedUrl = generateRedditEmbedUrl(props.url);
  const postUrl = props.url.slice(0, props.url.lastIndexOf('/'));

  useEffect(() => {
    const controller = loadPost(props);

    return () => {
      controller.abort();
    };
  }, [url]);

  const loadPost = (props): AbortController => {
    setLoading(true);
    setError(false);

    const abortController = new AbortController();

    fetch(`${postUrl}.json`, {signal: abortController.signal})
      .then(res => {
        if (res.status < 300) {
          props.onLoad && props.onLoad(res);
        } else {
          setError(true);
          props.onError && props.onError();
        }
      })
      .catch(error => {
        setError(true);
        props.onError && props.onError();
      })
      .finally(() => {
        setLoading(false);
      });

    return abortController;
  };

  return (
    <React.Fragment>
      {loading && <React.Fragment>{props.placeholder}</React.Fragment>}
      {error && <React.Fragment>Could not load post!</React.Fragment>}
      {!loading && !error && (
        <iframe
          id="reddit-embed"
          title="Reddit preview"
          src={embedUrl}
          sandbox="allow-scripts allow-same-origin allow-popups"
          style={{border: 'none'}}
          width="780"
          height="560"
          scrolling="yes"
        />
      )}
    </React.Fragment>
  );
};
