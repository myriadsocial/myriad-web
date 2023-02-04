import React, {useState} from 'react';

import Image from 'next/image';
import {useRouter} from 'next/router';

import {Backdrop, CircularProgress, Typography} from '@material-ui/core';

import {BoxComponent} from '../atoms/Box';
import {ListItemComponent} from '../atoms/ListItem';
import {useStyles} from './Menu.styles';
import {useMenuList, MenuDetail, MenuId} from './use-menu-list';

import {PolkadotLink} from 'components/common/PolkadotLink.component';
import SelectServer from 'src/components/SelectServer';
import {useInstances} from 'src/hooks/use-instances.hooks';
import {ServerListProps} from 'src/interfaces/server-list';
import i18n from 'src/locale';
import {Prompt} from 'src/stories/Prompt.stories';

type MenuProps = {
  selected: MenuId;
  onChange: (path: string) => void;
  logo: string;
  anonymous?: boolean;
};

export const Menu: React.FC<MenuProps> = props => {
  const {selected, onChange, logo} = props;

  const styles = useStyles();
  const router = useRouter();

  const {switchInstance, loadingSwitch, onLoadingSwitch} = useInstances();

  const menu = useMenuList(selected);

  const [register, setRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openError, setOpenError] = useState(false);

  const gotoHome = () => {
    if (router.pathname === '/') return;
    router.push('/', undefined, {shallow: true});
  };

  const openMenu = (item: MenuDetail) => () => {
    if (router.pathname === item.url) return;
    onChange(item.url);
  };

  const toggleSelected = async (server: ServerListProps) => {
    try {
      await switchInstance(server);
    } catch (err) {
      if (err.message === 'AccountNotFound') {
        setRegister(true);
      } else {
        setOpenError(true);
        setErrorMessage(err.message);
      }

      onLoadingSwitch(false);
    }
  };

  const onCancelError = () => {
    setErrorMessage('');
    setOpenError(false);
  };

  return (
    <div className={styles.root} data-testid={'menu-test'}>
      <BoxComponent paddingLeft={0} paddingRight={0}>
        <div className={styles.head} onClick={gotoHome} aria-hidden="true">
          <Image src={logo} alt="" width={220} height={48} />
        </div>

        <div className={styles.instance}>
          <SelectServer
            title={i18n.t('Login.Options.Prompt_Select_Instance.Switch')}
            onServerSelect={server => toggleSelected(server)}
            register={register}
            setRegister={value => setRegister(value)}
            page="layout"
          />
        </div>

        {menu
          .filter(ar => ar.isDesktop === true)
          .map(item => (
            <ListItemComponent
              data-testid={`list-item-${item.id}`}
              id={item.id}
              key={item.id}
              title={item.title}
              icon={item.icon}
              active={item.active}
              onClick={openMenu(item)}
              url={item.url}
              isAnimated={item.isAnimated}
            />
          ))}
      </BoxComponent>
      <Backdrop className={styles.backdrop} open={loadingSwitch}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Prompt
        title={errorMessage}
        icon="danger"
        open={openError}
        onCancel={onCancelError}
        subtitle={
          errorMessage === 'ExtensionNotInstalled' ? (
            <Typography>
              {i18n.t('Login.Options.Prompt_Extension.Subtitle_1')}&nbsp;
              <PolkadotLink />
              &nbsp;{i18n.t('Login.Options.Prompt_Extension.Subtitle_2')}
            </Typography>
          ) : (
            <React.Fragment />
          )
        }></Prompt>
    </div>
  );
};
