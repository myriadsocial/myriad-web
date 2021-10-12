import React, {ReactNode, useState} from 'react';

import {useStyles} from './link-previewer.style';

type LinkPreviewerProps = {
  image: string;
  title: string;
  text: string;
  href: string;
  children: ReactNode;
};

const LinkPreviewer = ({image, title, text, href, children}: LinkPreviewerProps) => {
  const styles = useStyles();
  const [isShown, setIsShown] = useState(false);

  return (
    <a
      href={href}
      className={styles.linkWithPreview}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}>
      <span> {children} </span>
      {isShown && <Card image={image} title={title} text={text} />}
    </a>
  );
};

type CardProps = {
  image: string;
  title: string;
  text: string;
};

const Card = ({image, title, text}: CardProps) => {
  const styles = useStyles();
  return (
    <div className={styles.card}>
      <img src={image} className={styles.card} alt="link-preview" />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{text}</p>
      </div>
    </div>
  );
};

export default LinkPreviewer;
