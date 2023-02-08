import {ChevronDownIcon} from '@heroicons/react/outline';
import {XIcon} from '@heroicons/react/solid';

import React, {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';
import {useDispatch, useSelector} from 'react-redux';

import {useSession} from 'next-auth/react';
import getConfig from 'next/config';
import Image from 'next/image';
import {useRouter} from 'next/router';

import {
  Box,
  ButtonBase,
  SvgIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  Typography,
  Button,
  useMediaQuery,
} from '@material-ui/core';

import InstanceCard from './InstanceCard';
import {InstanceCardSkeleton} from './InstanceCardSkeleton';
import useStyles from './SelectServer.styles';

import clsx from 'clsx';
import {unionBy} from 'lodash';
import ShowIf from 'src/components/common/show-if.component';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useInstances} from 'src/hooks/use-instances.hooks';
import {useUserHook} from 'src/hooks/use-user.hook';
import {ServerListProps} from 'src/interfaces/server-list';
import initialize from 'src/lib/api/base';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {setServer} from 'src/reducers/server/actions';
import {ServerState} from 'src/reducers/server/reducer';
import {fetchNetwork} from 'src/reducers/user/actions';
import theme from 'src/themes/default';

type SelectServerProps = {
  title?: string;
  register?: boolean;
  onSwitchInstance?: (server: ServerListProps, callback?: () => void) => void;
  setRegister?: (value: boolean) => void;
  page?: string;
};

const {publicRuntimeConfig} = getConfig();

export const COOKIE_INSTANCE_URL = 'cookie-instance-url-'.concat(
  publicRuntimeConfig.appEnvironment,
);

const SelectServer = ({
  title,
  register,
  setRegister,
  onSwitchInstance,
  page = 'login',
}: SelectServerProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const {server, apiURL} = useSelector<RootState, ServerState>(state => state.serverState);

  const {data: session} = useSession();
  const {servers, getAllInstances, loading} = useInstances();
  const {logout} = useAuthHook();
  const {currentWallet} = useUserHook();

  const [, setCookies] = useCookies([COOKIE_INSTANCE_URL]);
  const [selectedServer, setSelectedServer] = useState<ServerListProps | null>(null);
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    getAllInstances();
  }, [getAllInstances]);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = async (server: ServerListProps) => {
    setSelectedServer(server);

    if (page === 'login') {
      const query = {...router.query, instance: server.apiUrl};
      await router.replace({query}, undefined, {shallow: true});
      setCookies(COOKIE_INSTANCE_URL, server.apiUrl);

      initialize({apiURL: server.apiUrl});
      dispatch(setServer(server.detail, server.apiUrl));
      dispatch(fetchNetwork());

      setOpen(false);
    } else {
      if (!onSwitchInstance) return;
      onSwitchInstance(server, () => {
        setOpen(false);
        setRegister(false);
      });
    }
  };

  const handleCloseCheckAccountModal = () => {
    setRegister(false);
  };

  const onLogout = async (server: ServerListProps) => {
    setCookies(COOKIE_INSTANCE_URL, server.apiUrl);

    const query = session?.user?.email
      ? `&email=${session.user.email}`
      : `&network=${currentWallet.networkId}`;
    await logout(`/login?instance=${server.apiUrl}${query}`);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <React.Fragment>
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h5">
            {title ?? i18n.t('Login.Options.Prompt_Select_Instance.Title')}
          </Typography>
        </div>
        <ButtonBase
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: isMobile ? '#FFF' : '#F6F7FC',
            padding: `8px 12px`,
            gap: 8,
            borderRadius: 40,
          }}
          onClick={handleOpen}>
          <Image
            alt={server?.name ?? 'Error Image'}
            loader={() => server?.serverImageURL ?? ''}
            src={server?.serverImageURL ?? ''}
            placeholder="empty"
            height={30}
            width={30}
          />

          <Box>{server?.name ?? 'Unknown Instance'}</Box>
          <SvgIcon
            style={{marginLeft: 'auto'}}
            component={ChevronDownIcon}
            fontSize="small"
            color={'primary'}
          />
        </ButtonBase>
      </div>

      <Dialog
        id="server-list-dialog"
        open={open}
        onClose={handleClose}
        aria-labelledby="list-server-dialog">
        <DialogTitle
          id="list-server-dialog-title"
          style={{display: 'flex', flexDirection: 'column'}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
            <Box style={{fontWeight: 600, fontSize: 16, textAlign: 'center'}}>
              {i18n.t('Login.Options.Prompt_Select_Instance.Title')}{' '}
            </Box>
            <SvgIcon
              onClick={handleClose}
              classes={{
                root: clsx({
                  [classes.icon]: true,
                  [classes.right]: true,
                }),
              }}
              component={XIcon}
              viewBox="0 0 20 20"
            />
          </div>
        </DialogTitle>
        <DialogContent>
          <List>
            <ShowIf condition={loading}>
              <InstanceCardSkeleton />
            </ShowIf>
            <ShowIf condition={!loading}>
              {unionBy(servers, 'apiUrl').map(server => {
                if (!server?.detail) return <React.Fragment />;
                return (
                  <InstanceCard
                    key={server.apiUrl.concat('-').concat(server.id.toString())}
                    server={server}
                    onSelect={() => handleSelect(server)}
                    selected={server.apiUrl === apiURL}
                  />
                );
              })}
            </ShowIf>
          </List>
        </DialogContent>
      </Dialog>

      <Dialog
        id="selected-server-dialog"
        open={register}
        onClose={handleCloseCheckAccountModal}
        aria-labelledby="selected-server-dialog">
        <DialogTitle
          id="selected-server-dialog-title"
          style={{display: 'flex', flexDirection: 'column'}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
            <Box style={{fontWeight: 600, fontSize: 16, textAlign: 'center'}}>
              {i18n.t('Login.Options.Prompt_Select_Instance.Title')}{' '}
            </Box>
            <SvgIcon
              onClick={handleCloseCheckAccountModal}
              classes={{
                root: clsx({
                  [classes.icon]: true,
                  [classes.right]: true,
                }),
              }}
              component={XIcon}
              viewBox="0 0 20 20"
            />
          </div>
        </DialogTitle>
        <DialogContent>
          <List>
            <InstanceCard server={selectedServer} selected={true} onSelect={console.log} />
            <ListItem
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: 'fit-content',
              }}>
              <Typography style={{whiteSpace: 'pre-line'}}>
                {i18n.t('Login.Options.Prompt_Select_Instance.No_Account_Description', {
                  instance_name: selectedServer?.detail?.name ?? '',
                })}
              </Typography>
            </ListItem>
            <ListItem
              style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Button
                onClick={() => {
                  handleCloseCheckAccountModal();
                  handleOpen();
                }}
                size="small"
                variant="outlined"
                color="secondary">
                {i18n.t('Login.Options.Prompt_Select_Instance.No_Account_Cancel')}
              </Button>
              <Button
                onClick={() => onLogout(selectedServer)}
                size="small"
                variant="contained"
                color="primary">
                {i18n.t('Login.Options.Prompt_Select_Instance.No_Account_Confirm')}
              </Button>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default SelectServer;
