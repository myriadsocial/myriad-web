import { CheckCircleIcon } from '@heroicons/react/solid';

import React, { useState, useEffect } from 'react';

import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  SvgIcon,
  Typography,
} from '@material-ui/core';

import { Modal } from '../atoms/Modal';
import { useStyles } from './postVisibility.styles';
import { usePostVisibilityList } from './use-post-visibility-list.hook';

import SettingVisibility from 'components/PostCreate/SettingVisibility';
import ShowIf from 'components/common/show-if.component';
import { Experience } from 'src/interfaces/experience';
import { Post, PostVisibility as Visibility } from 'src/interfaces/post';
import { User } from 'src/interfaces/user';
import * as TimelineAPI from 'src/lib/api/experience';
import * as UserAPI from 'src/lib/api/user';
import i18n from 'src/locale';

type ReportProps = {
  open: boolean;
  reference: Post;
  onVisibilityChanged: (
    type: string,
    selectedUserIds: string[],
    selectedTimelineIds: string[],
  ) => void;
  onClose: () => void;
};

export const PostVisibility: React.FC<ReportProps> = props => {
  const { open, onClose, onVisibilityChanged, reference } = props;
  const styles = useStyles();

  const list = usePostVisibilityList();
  const [type, setType] = useState<Visibility | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<User[]>([]);
  const [selectedTimeline, setSelectedTimeline] =
    useState<Experience | null>(null);
  const [pageUserIds, setPageUserIds] = React.useState<number>(1);
  const [isLoadingSelectedUser, setIsLoadingSelectedUser] =
    useState<boolean>(false);

  useEffect(() => {
    reference.visibility && setType(reference.visibility);
  }, []);

  const handleSelectItem =
    (value: Visibility | string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const type = value as Visibility;
        setType(type);
      } else {
        setType(null);
      }
    };

  const handlePostVisibility = () => {
    if (type) {
      onVisibilityChanged(
        type,
        selectedUserIds.map(item => item.id),
        [selectedTimeline.id],
      );
    }
  };

  const getSelectedIds = async (userIds: string[]) => {
    setIsLoadingSelectedUser(true);
    const response = await UserAPI.getUserByIds(userIds, pageUserIds);
    setSelectedUserIds([
      ...selectedUserIds,
      ...(response?.data as unknown as User[]),
    ]);
    setIsLoadingSelectedUser(false);
    if (pageUserIds < response.meta.totalPageCount)
      setPageUserIds(pageUserIds + 1);
  };

  const getSelectedTimeline = async (timelineIds: string[]) => {
    if (!timelineIds?.[0]) return;

    setIsLoadingSelectedUser(true);
    try {
      const response = await TimelineAPI.getExperienceDetail(timelineIds[0]);
      setSelectedTimeline(response);
    } catch {
      // ignore
    } finally {
      setIsLoadingSelectedUser(false);
    }
  };

  useEffect(() => {
    getSelectedIds(reference.selectedUserIds);
  }, [pageUserIds]);

  useEffect(() => {
    if (reference.selectedTimelineIds)
      getSelectedTimeline(reference.selectedTimelineIds);
  }, [reference]);

  const disabledSubmit =
    type !== 'selected_user'
      ? reference.visibility === type
      : selectedUserIds.length < 1 && !isLoadingSelectedUser;

  return (
    <Modal
      title={i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Header')}
      open={open}
      onClose={onClose}
      className={styles.root}>
      <Typography variant="h5">
        {i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Title')}
      </Typography>
      <Typography
        variant="subtitle1"
        color="textSecondary"
        className={styles.fontSize}>
        {reference.visibility === Visibility.FRIEND
          ? i18n.t(
              'Post_Detail.Post_Options.Post_Visibility_Setting.Visibility_Friend',
            )
          : reference.visibility === Visibility.PRIVATE
          ? i18n.t(
              'Post_Detail.Post_Options.Post_Visibility_Setting.Visibility_Private',
            )
          : i18n.t(
              'Post_Detail.Post_Options.Post_Visibility_Setting.Visibility_Everyone',
            )}
      </Typography>

      <List dense={false} className={styles.list}>
        {list.map(option => (
          <ListItem key={option.id} button selected={type === option.id}>
            <ListItemText primary={option.title} />
            <ListItemSecondaryAction>
              <Radio
                edge="end"
                color="primary"
                onChange={handleSelectItem(option.id)}
                checked={type === option.id}
                checkedIcon={
                  <SvgIcon component={CheckCircleIcon} viewBox="0 0 20 20" />
                }
                inputProps={{ 'aria-labelledby': option.id }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <ShowIf condition={type === Visibility.CUSTOM}>
        <SettingVisibility
          setPost={setSelectedUserIds}
          values={selectedUserIds}
          page={'edit'}
        />
      </ShowIf>

      <div className={styles.info}>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          className={styles.fontSize}>
          {i18n.t(
            'Post_Detail.Post_Options.Post_Visibility_Setting.Tipping_Warning',
          )}
        </Typography>
      </div>

      <div className={styles.action}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={onClose}>
          {i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Cancel')}
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handlePostVisibility}
          disabled={disabledSubmit}>
          {i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Confirm')}
        </Button>
      </div>
    </Modal>
  );
};
