import React from 'react';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '../common/DialogTitle.component';

type Props = {
  onClose: () => void;
  onSave: (data) => void;
};

export default function JsonForm(props: Props) {
  return (
    <>
      <DialogTitle id="json-title" onClose={props.onClose}>
        Import Keystore JSON File
      </DialogTitle>
      <DialogContent>
        <label htmlFor="btn-upload">
          <input id="btn-upload" name="btn-upload" style={{ display: 'none' }} type="file" />
          <Button className="btn-choose" variant="contained" color="secondary" fullWidth={true} component="span">
            Choose Files
          </Button>
        </label>
      </DialogContent>
    </>
  );
}
