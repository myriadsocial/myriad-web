import React, {useEffect, useRef, useState, useMemo} from 'react';
import {FacebookProvider, EmbeddedPost} from 'react-facebook';

import CircularProgress from '@material-ui/core/CircularProgress';

import ShowIf from '../../../components/common/show-if.component';
import {useStyles} from './Embed.styles';
import {isFacebookUrl} from './util';

import Embedo from 'embedo';
import {EmbedoReddit} from 'embedo/plugins';

type EmbedProps = {
  url: string;
  options?: {
    facebookAppId: string;
  };
  showError?: boolean;
  onError?: (message: string) => void;
  onClick?: () => void;
};

Embedo.plugins([EmbedoReddit.default]);
Embedo.debug = true;

export const Embed: React.FC<EmbedProps> = props => {
  const {url, options, showError = false, onClick, onError} = props;
  const styles = useStyles();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isFacebook = isFacebookUrl(url);

  const embedo = useMemo(() => {
    const embedo = new Embedo({
      facebook: null,
      twitter: true,
      reddit: true,
    });

    return embedo;
  }, [Embedo, options]);

  useEffect(() => {
    if (!isFacebook) {
      setLoading(true);

      embedo
        .load(ref.current, url, options)
        .done(() => {
          setLoading(false);
        })
        .fail((err: any) => {
          setLoading(false);

          setError('Error');
          onError && onError('Error');
        });
    }

    return () => {
      embedo.destroy(ref.current);
    };
  }, [url, isFacebook]);

  const handleClick = (): void => {
    onClick && onClick();
  };

  return (
    <div className={styles.root}>
      <div ref={ref} onClick={handleClick} />

      <ShowIf condition={isFacebook}>
        <FacebookProvider appId={options?.facebookAppId}>
          <EmbeddedPost href={url} width="700" />
        </FacebookProvider>
      </ShowIf>

      {loading && (
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      )}

      <div id="fb-root" />

      {showError && error}
    </div>
  );
};
