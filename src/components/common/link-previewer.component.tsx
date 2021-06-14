import React, { useState } from 'react';

import './link-previewer.style.ts';

export const LinkPreviewer = props => {
  const [isShown, setIsShown] = useState(false);

  return (
    <a href={props.href} className="link-with-preview" onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
      <span> {props.children} </span>
      {isShown && <Card image={props.image} title={props.title} text={props.text} />}
    </a>
  );
};

const Card = props => {
  return (
    <div className="card">
      <img src={props.image} className="card-img-top" alt="" />
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
        <p className="card-text">{props.text}</p>
      </div>
    </div>
  );
};
