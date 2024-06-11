/* eslint-disable react/jsx-no-duplicate-props */
import { Box, Button, DialogActions } from '@mui/material';
import PropTypes from 'prop-types';
import ProductEnquriesRemark from './ProductEnquriesRemark';

DialogProductEnquries.propTypes = {
  message: PropTypes.object,
  onCancel: PropTypes.func,
};

export default function DialogProductEnquries({ message, onCancel }) {
  return (
    <>
      <ProductEnquriesRemark message={message} />

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
