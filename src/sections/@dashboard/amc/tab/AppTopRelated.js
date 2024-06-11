import PropTypes from 'prop-types';
// @mui
import { Box, Stack, Typography } from '@mui/material';
// utils

// ----------------------------------------------------------------------

AppTopRelated.propTypes = {
  blogdata: PropTypes.object,
};

export default function AppTopRelated({ blogdata }) {
  const { title, images, amc_status, expires_on, created_at } = blogdata;

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              display: 'flex',
              borderRadius: 1.5,
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.neutral',
            }}
          >
            <Box component="img" src={images.length>0?images[0]?.values[0]?.url:''} sx={{ width: 24, height: 24 }} />
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 160 }}>
            <Typography variant="subtitle2">{title}</Typography>
            <Stack direction="row" alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
              {/* <Typography variant="caption" sx={{ ml: 0.5, mr: 1 }}>
                AMC Status: {amc_status} | Expiry Date: {expires_on}
              </Typography> */}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
