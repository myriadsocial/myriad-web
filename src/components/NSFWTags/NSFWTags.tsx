import {ChevronDownIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {SvgIcon, Typography, IconButton} from '@material-ui/core';

import {PostTags} from '../PostTag/PostTags';
import {Modal} from '../atoms/Modal';
import {useStyles} from './NSFWTags.styles';
import {tagOptions} from './default';

type NSFWTagsProps = {
  tags: string[];
  onConfirm: (tags: string[]) => void;
};

export const NSFWTags: React.FC<NSFWTagsProps> = props => {
  const {tags, onConfirm} = props;

  const [isOpen, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const styles = useStyles({selected: selectedTags.length > 0});

  const openTag = () => {
    setOpen(true);
  };

  const closeTag = () => {
    setOpen(false);
  };

  const handleConfirmTags = (tags: string[]) => {
    closeTag();
    setSelectedTags(tags);
    onConfirm(tags);
  };

  return (
    <>
      <IconButton onClick={openTag} color="primary" aria-label="expand" className={styles.expand}>
        <Typography component="span" className={styles.nsfw}>
          NSFW
        </Typography>
        <SvgIcon component={ChevronDownIcon} fontSize="small" color="primary" />
      </IconButton>

      <Modal title="NSFW tags" align="left" titleSize="small" open={isOpen} onClose={closeTag}>
        <PostTags selected={tags} options={tagOptions} onConfirm={handleConfirmTags} />
      </Modal>
    </>
  );
};
