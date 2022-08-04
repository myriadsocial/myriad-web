import React from 'react';

import Link from '@material-ui/core/Link';

import i18n from 'src/locale';
import {CSSProperties} from 'styled-components';

type LoadMoreComponentProps = {
  text?: string;
  align?: CSSProperties['textAlign'];
  loadmore: () => void;
};

export const LoadMoreComponent: React.FC<LoadMoreComponentProps> = props => {
  const {text = i18n.t('Loading.Load_More'), align = 'center', loadmore} = props;
  return (
    <div style={{paddingBottom: 30}}>
      <div style={{textAlign: align}}>
        <Link
          component="button"
          style={{color: '#7342CC', textDecoration: 'none', fontWeight: 500}}
          onClick={loadmore}>
          {text}
        </Link>
      </div>
    </div>
  );
};
