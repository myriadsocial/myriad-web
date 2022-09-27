import {useState} from 'react';

import Image from 'next/image';

import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  ListItem,
} from '@material-ui/core';
import {useTheme} from '@material-ui/core/styles';
import {alpha, createStyles, makeStyles} from '@material-ui/core/styles';

import {ServerListProps} from 'src/interfaces/server-list';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      '&:hover': {
        backgroundColor: alpha('#FFC857', 0.15),
        '& .MuiCardActionArea-focusHighlight': {
          opacity: 0,
        },
      },
    },
  }),
);

type InstanceCardProps = {
  server: ServerListProps;
  onSelect: (serverId: number) => void;
  selected: boolean;
};

const InstanceCard = ({server, onSelect, selected}: InstanceCardProps) => {
  const styles = useStyles();

  const theme = useTheme();

  const text = server.detail?.description ?? 'Empty description';

  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const handleSelect = () => {
    onSelect(server.id);
  };

  return (
    <ListItem key={server.id}>
      <Card className={styles.root}>
        <CardActionArea
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: selected ? theme.palette.secondary.main : 'transparent',
          }}
          onClick={handleSelect}>
          <CardMedia style={{padding: 16}}>
            {server.detail?.serverImageURL && (
              <Image
                alt={server.detail?.id}
                src={server.detail?.serverImageURL ?? ''}
                placeholder="empty"
                height={80}
                width={80}
              />
            )}
          </CardMedia>
          <CardContent>
            <Typography style={{fontWeight: 600, fontSize: 16}}>{server.detail?.name}</Typography>
            <Typography style={{maxWidth: 368, fontWeight: 400, fontSize: 12}}>
              {text.split(' ').length > 10 && !expanded
                ? `${text.split(' ').slice(0, 10).join(' ')}...`
                : text}
            </Typography>
            <Box
              fontSize={10}
              fontWeight="fontWeightBold"
              style={{color: '#6E3FC3', textAlign: 'end'}}
              onClick={handleExpand}>
              {!expanded ? 'See more' : 'See less'}
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </ListItem>
  );
};

export default InstanceCard;
