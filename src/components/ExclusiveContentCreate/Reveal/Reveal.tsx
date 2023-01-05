import React from 'react';

import {useStyles} from './Reveal.styles';

import {NodeViewer} from 'components/common/NodeViewer';
import ShowIf from 'components/common/show-if.component';
import {isJson} from 'src/helpers/string';

export const Reveal = ({content}) => {
  const styles = useStyles();

  const isHtmlContent = !isJson(content.text);

  return (
    <div className={styles.container}>
      <ShowIf condition={isHtmlContent}>
        <div className={styles.plain} dangerouslySetInnerHTML={{__html: content.text}} />
      </ShowIf>
      <ShowIf condition={!isHtmlContent}>
        <NodeViewer id={content?.id} text={content?.text} expand={true} />
      </ShowIf>
    </div>
  );
};

export default Reveal;
