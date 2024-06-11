import { LoadingButton } from '@mui/lab';
import { Box, InputAdornment, Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from '../../../../components/iconify';

CategoryTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  handleAllReStoreRow: PropTypes.func,
  handleEmptyAllData: PropTypes.func,
};

export default function CategoryTableToolbar({
  filterName,
  onFilterName,
  handleAllReStoreRow,
  handleEmptyAllData,
}) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <Box
        sx={{
          width: {
            xs: '100%',
            sm: '100%',
            md: '300px',
            lg: '300px',
          },
        }}
      >
        <TextField
          fullWidth
          value={filterName}
          onChange={onFilterName}
          placeholder="Search by Category Name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Stack direction="row" alignItems="" spacing={2}>
        <LoadingButton
          variant="contained"
          onClick={() => {
            handleEmptyAllData();
          }}
        >
          Empty The Recycle Bin
        </LoadingButton>

        <LoadingButton
          variant="contained"
          onClick={() => {
            handleAllReStoreRow();
          }}
        >
          Restore All Item
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
