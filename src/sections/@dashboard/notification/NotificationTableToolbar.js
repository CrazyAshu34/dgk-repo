import { Box, InputAdornment, Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from '../../../components/iconify';

NotificationTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  headers: PropTypes.array,
  getDownload: PropTypes.array,
};

export default function NotificationTableToolbar({
  filterName,
  onFilterName,
  headers,
  getDownload,
}) {
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
          placeholder="Search by Notification Title & Id"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {/* <CSVLink
        data={getDownload}
        headers={headers}
        filename="Notification_List.csv"
        target="_blank"
        style={{ textDecoration: 'none' }}
      >
        <LoadingButton type="submit" variant="contained" size="" sx={{ py: 2, px: 2 }}>
          Excel
        </LoadingButton>
      </CSVLink> */}
    </Stack>
  );
}