import React from 'react';
import { makeStyles, createStyles, fade, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#424242',
      color: '#E0E0E0'
    },
    inline: {
      display: 'inline'
    },
    input: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      marginLeft: 0,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch'
        }
      }
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto'
      }
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    chip: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: theme.spacing(2),
      '& > *': {
        margin: theme.spacing(0.5)
      }
    },
    avatar: {
      display: 'flex',
      justifyContent: 'center',
      '& > *': {
        margin: theme.spacing(1)
      },
      marginBottom: theme.spacing(2)
    },
    header: {
      // padding: '0 16px'
    },
    action: {
      width: 265,
      marginBottom: 10,
      textAlign: 'left',
      borderRadius: 20
    },
    more: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  })
);

export default function TopicComponent() {
  const classes = useStyles();

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return (
    <Card className={classes.root}>
      <CardHeader disableTypography className={classes.header} title={<Typography variant="h5">Topic and People</Typography>} />
      <CardContent>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              input: classes.input
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
        <div className={classes.chip}>
          <Chip size="small" label="fun" onDelete={handleDelete} color="primary" />
          <Chip size="small" label="funny" onDelete={handleDelete} color="primary" />
          <Chip size="small" label="lol" onDelete={handleDelete} color="primary" />
          <Chip size="small" label="comedy" onDelete={handleDelete} color="primary" />
          <Chip size="small" label="blockchain" onDelete={handleDelete} color="secondary" />
          <Chip size="small" label="cursed" onDelete={handleDelete} color="secondary" />
        </div>

        <Box className={classes.avatar}>
          <Avatar alt="Remy Sharp" src="/images/avatar/1.jpg" />
          <Avatar alt="Travis Howard" src="/images/avatar/2.jpg" />
          <Avatar alt="Cindy Baker" src="" />
          <Avatar alt="Lauren Philip" src="" />
        </Box>

        <Box className={classes.more}>
          <Button color="secondary">More...</Button>
        </Box>

        <Button className={classes.action} color="primary" size="large" variant="contained">
          Make It An Experience
        </Button>
      </CardContent>
    </Card>
  );
}
