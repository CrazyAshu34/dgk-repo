import { Box, Button, DialogActions } from '@mui/material';
import PropTypes from 'prop-types';
import Dealerhistory from './Dealerhistory';

DealerTable.propTypes = {
  ord_product: PropTypes.object,
  onCancel: PropTypes.func,
};

export default function DealerTable({ ord_product, onCancel }) {
  console.log('ord_product', ord_product);
  return (
    <>
      <Dealerhistory
        tableData={ord_product}
        tableLabels={[
          { id: 'pro_id', label: 'Pro Id' },
          { id: 'pro_banimage', label: 'Image' },
          { id: 'title', label: 'Title' },
          { id: 'pro_mrp', label: 'Mrp' },
        ]}
      />

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} sx={{ border: '2px solid red' }} />
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
