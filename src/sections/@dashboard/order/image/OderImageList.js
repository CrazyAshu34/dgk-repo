import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import ShopProductCard from './ShopProductCard';

// ----------------------------------------------------------------------

OderImageList.propTypes = {
  products: PropTypes.array,
  inputImageFields: PropTypes.object,
};

export default function OderImageList({ products, inputImageFields, ...other }) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      }}
      {...other}
    >
      {inputImageFields?.map((row, index) => (
        <ShopProductCard key={index} item={row} />
      ))}
    </Box>
  );
}
