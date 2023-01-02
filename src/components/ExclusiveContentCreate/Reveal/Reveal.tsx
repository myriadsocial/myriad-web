import React from 'react';

import {useStyles} from './Reveal.styles';

import {NodeViewer} from 'components/common/NodeViewer';

export const Reveal = ({content}) => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <NodeViewer id={content?.id} text={content?.text} expand={true} />
      <div className={styles.textUnlock}>Unlocked</div>
    </div>
  );
};

export default Reveal;
