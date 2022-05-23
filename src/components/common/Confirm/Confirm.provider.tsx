import React, {useCallback, useState} from 'react';

import {Button, Grid} from '@material-ui/core';

import ShowIf from '../show-if.component';
import ConfirmContext, {HandleConfirm} from './Confirm.context';
import {ConfirmProviderProps, ConfirmOptions} from './Confirm.interface';
import {useStyles} from './Confirm.style';

import clsx from 'clsx';
import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import i18n from 'src/locale';

const DEFAULT_OPTIONS: ConfirmOptions = {
  title: i18n.t('Confirm.Title'),
  description: '',
  icon: 'warning',
  confirmationText: i18n.t('General.OK'),
  cancellationText: i18n.t('General.Cancel'),
  hideCancel: false,
};

export const ConfirmProvider: React.ComponentType<ConfirmProviderProps> = ({children}) => {
  const styles = useStyles();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>(DEFAULT_OPTIONS);

  const confirm = useCallback<HandleConfirm>(options => {
    setOptions({
      ...DEFAULT_OPTIONS,
      ...options,
    });
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    const {onCancel} = options;

    onCancel && onCancel();

    handleClose();
  }, [options, handleClose]);

  const handleConfirm = useCallback(() => {
    const {onConfirm} = options;

    onConfirm && onConfirm();

    handleClose();
  }, [options, handleClose]);

  return (
    <>
      <ConfirmContext.Provider value={confirm}>{children}</ConfirmContext.Provider>
      <PromptComponent
        open={open}
        title={options?.title}
        subtitle={options?.description}
        icon={options?.icon ?? 'warning'}
        onCancel={handleClose}>
        <Grid container justifyContent="space-around">
          <ShowIf condition={!options?.hideCancel}>
            <Button size="small" variant="outlined" color="secondary" onClick={handleCancel}>
              {options?.cancellationText}
            </Button>
          </ShowIf>
          <Button
            size="small"
            variant="contained"
            color="primary"
            className={clsx({
              [styles.error]: options.icon === 'danger',
            })}
            onClick={handleConfirm}>
            {options?.confirmationText}
          </Button>
        </Grid>
      </PromptComponent>
    </>
  );
};
