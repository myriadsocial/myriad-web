import * as React from 'react';

export interface Props {
  className?: string;
  background?: string;
}

const ScrollView: React.FC<Props> = ({children, className, background}) => {
  const style: React.CSSProperties = {
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background,
  };

  return (
    <div className={className} style={style} id="infinite-scrollable">
      {children}
    </div>
  );
};

export default ScrollView;
