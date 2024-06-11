/* eslint-disable react/jsx-no-duplicate-props */
import { Box, Button, DialogActions } from '@mui/material';
import PropTypes from 'prop-types';
import ContactRemark from './ContactRemark';

DialogContact.propTypes = {
  remarks: PropTypes.object,
  onCancel: PropTypes.func,
};

export default function DialogContact({ remarks, onCancel }) {
  return (
    <>
      <ContactRemark remarks={remarks} />

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
