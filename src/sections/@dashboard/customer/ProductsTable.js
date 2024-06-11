import { Box, Button, DialogActions } from '@mui/material';
import PropTypes from 'prop-types';
import Productshistory from './Productshistory';

ProductsTable.propTypes = {
  ord_product: PropTypes.object,
  cust_type: PropTypes.object,
  onCancel: PropTypes.func,
};

export default function ProductsTable({ ord_product, onCancel, cust_type }) {
  console.log('ord_product?.cart', ord_product, cust_type);
  return (
    <>
      <Productshistory
        tableData={ord_product}
        cust_type={cust_type}
        tableLabels={[
          { id: 'pro_id', label: 'Pro Id' },
          { id: 'pro_banimage', label: 'Image' },
          { id: 'title', label: 'Title', width: 250 },
          { id: 'pro_mrp', label: 'Mrp' },
        ]}
      />

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
