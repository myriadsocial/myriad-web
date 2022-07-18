import {
  getPluginType,
  someNode,
  useEventPlateId,
  usePlateEditorState,
  withPlateEventProvider,
} from '@udecode/plate-core';
import {ELEMENT_LINK} from '@udecode/plate-link';
import {ToolbarButton, ToolbarButtonProps} from '@udecode/plate-ui-toolbar';

import React, {useState} from 'react';

import {Modal} from 'components/atoms/Modal';
import {getPrevLink, upsertLink} from 'components/common/Editor/plugins/Link';
import {EmbedURL} from 'src/components/EmbedURL';
import {useToggle} from 'src/hooks/use-toggle.hook';
import i18n from 'src/locale';

export type LinkToolbarButtonProps = ToolbarButtonProps;

export const LinkToolbarButton = withPlateEventProvider(
  ({id, getLinkUrl, ...props}: LinkToolbarButtonProps) => {
    id = useEventPlateId(id);
    const editor = usePlateEditorState(id)!;

    const [open, toggleLinkDialog] = useToggle(false);
    const [prevLink, setPrevLink] = useState<string | null>(null);

    const type = getPluginType(editor, ELEMENT_LINK);
    const isLink = !!editor?.selection && someNode(editor, {match: {type}});

    const openDialog = (prev: string | null) => {
      setPrevLink(prev);
      toggleLinkDialog();
    };

    const handleConfirmLink = (url: string | null) => {
      upsertLink(editor, url);
      toggleLinkDialog();
    };

    return (
      <>
        <ToolbarButton
          active={isLink}
          onMouseDown={async event => {
            if (!editor) return;

            event.preventDefault();

            const currentLink = getPrevLink(editor);
            console.log('currentLink', currentLink);
            openDialog(currentLink);
          }}
          {...props}
        />
        <Modal
          title={i18n.t('Post_Create.Upload.Embed.Hyperlink.Title')}
          subtitle={i18n.t('Post_Create.Upload.Embed.Hyperlink.Subtitle')}
          titleSize="small"
          maxWidth="xl"
          open={open}
          onClose={toggleLinkDialog}>
          <EmbedURL defaultValue={prevLink} onConfirm={handleConfirmLink} />
        </Modal>
      </>
    );
  },
);
