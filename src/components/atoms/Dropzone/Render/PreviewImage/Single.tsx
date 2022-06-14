import React, {useState} from 'react';

import NextImage, {ImageProps} from 'next/image';

import {Skeleton} from '../../File.skeleton';

import ShowIf from 'components/common/show-if.component';

type PreviewSingleProps = Omit<
  ImageProps,
  'placeholder' | 'blurDataURL' | 'objectFit' | 'objectPosition'
>;

export const Single: React.FC<PreviewSingleProps> = props => {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{position: 'relative'}}>
      <NextImage
        {...props}
        placeholder="empty"
        objectFit="cover"
        objectPosition="center"
        onLoadingComplete={() => setLoading(false)}
      />

      <ShowIf condition={loading}>
        <span style={{position: 'absolute', top: 0, left: 0}}>
          <Skeleton {...props} />
        </span>
      </ShowIf>
    </div>
  );
};

export default Single;
