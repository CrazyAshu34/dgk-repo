import { Box, InputAdornment, Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from '../../../components/iconify';

CustomerTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function CustomerTableToolbar({ filterName, onFilterName }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <Box
        sx={{
          width: {
            xs: '100%',
            sm: '100%',
            md: '500px',
            lg: '500px',
          },
        }}
      >
        <TextField
          fullWidth
          value={filterName}
          onChange={onFilterName}
          placeholder="Search by Name, Phone No, and email id"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Stack>
  );
}
