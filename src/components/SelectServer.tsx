import {useState, useMemo} from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import useMyriadInstance from 'src/components/common/Blockchain/use-myriad-instance.hooks';
import {useInstances} from 'src/hooks/use-instances.hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginLeft: '20px',
      gap: '4px',
    },
    formControl: {
      width: '250px',
      height: '40px',
    },
    select: {
      background: '#F6F7FC',
      borderRadius: '40px',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

const SelectServer = () => {
  const {provider} = useMyriadInstance();
  const {servers, getAllInstances} = useInstances();

  const classes = useStyles();

  const [serverId, setServerId] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<{name?: string; value: string}>) => {
    setServerId(event.target.value);
  };

  useMemo(() => {
    getAllInstances(provider);
  }, [provider]);

  return (
    <div className={classes.root}>
      <Typography>Switch Instance</Typography>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="outlined-age-native-simple">Select Instance</InputLabel>
        <Select
          native
          value={serverId}
          onChange={handleChange}
          label="server-name"
          inputProps={{
            name: 'server-name',
            id: 'outlined-server-name',
          }}
          className={classes.select}>
          <option aria-label="None" value="" />
          {servers.map(server => (
            <option key={server.id} value={server.id}>
              {server.detail?.name ?? 'Unnamed instance'}
            </option>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectServer;
