import {ChevronRightIcon} from '@heroicons/react/outline';

import React from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import Box, {BoxProps} from '@material-ui/core/Box';
import SvgIcon from '@material-ui/core/SvgIcon';
import {makeStyles, Theme} from '@material-ui/core/styles';

type BoxComponentProps = BoxProps & {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  radiusStr?: string;
  isWithChevronRightIcon?: boolean;
  isFitContent?: boolean;
  minWidth?: number;
  paddingLeft?: number;
  onClick?: () => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background: '#FFF',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
    // @ts-ignore
    borderRadius: props => props.radiusStr ?? theme.spacing(2.5),
    // @ts-ignore
    width: props => (props.isFitContent ? 'fit-content' : 'unset'),
    // @ts-ignore
    minWidth: props => props.minWidth ?? 0,
    padding: theme.spacing(3, 3.75),
    // @ts-ignore
    paddingLeft: props => props.paddingLeft ?? theme.spacing(3.75),
  },
  header: {
    marginBottom: 14,
    display: 'flex',
    justifyContent: 'space-between',
  },
  action: {
    padding: 0,
    '& .MuiSvgIcon-root': {
      fill: 'none',
    },
  },
}));

export const BoxComponent: React.FC<BoxComponentProps> = props => {
  const {
    children,
    title,
    isWithChevronRightIcon = true,
    onClick,
    isFitContent,
    radiusStr,
    minWidth,
    paddingLeft,
    ...restProps
  } = props;
  const styles = useStyles({isFitContent, radiusStr, minWidth, paddingLeft});

  const handleClick = (): void => {
    onClick && onClick();
  };

  return (
    <Box {...restProps} className={styles.root}>
      {title && (
        <div className={styles.header}>
          <Typography variant="h4">{title}</Typography>

          {isWithChevronRightIcon && (
            <IconButton
              disableRipple
              onClick={handleClick}
              color="primary"
              size="medium"
              className={styles.action}
            >
              <SvgIcon component={ChevronRightIcon} viewBox="0 0 24 24" />
            </IconButton>
          )}

          {!isWithChevronRightIcon && <></>}
        </div>
      )}

      {children}
    </Box>
  );
};
