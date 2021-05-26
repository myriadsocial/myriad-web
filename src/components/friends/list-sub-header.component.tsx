import React from 'react';

import Typography from '@material-ui/core/Typography';

interface ListHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const ListSubHeaderComponent: React.FC<ListHeaderProps> = props => {
  const { children, title } = props;

  return (
    <div style={{ marginBottom: 16 }}>
      <Typography variant="caption" style={{ fontWeight: 400, fontSize: 14 }}>
        {title}
      </Typography>
      {children}
    </div>
  );
};
