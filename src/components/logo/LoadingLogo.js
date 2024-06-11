import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Link } from '@mui/material';
// import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const LoadingLogo = forwardRef(
  ({ disabledLink = false, src = '/logo/loding_logo.svg', sx, ...other }, ref) => {
    // const theme = useTheme();

    // const PRIMARY_LIGHT = theme.palette.primary.light;

    // const PRIMARY_MAIN = theme.palette.primary.main;

    // const PRIMARY_DARK = theme.palette.primary.dark;

    // OR using local (public folder)
    // -------------------------------------------------------
    const logo = (
      <Box
        component="img"
        src={src}
        sx={{ height: 75, cursor: 'pointer', ...sx, objectFit: 'cover' }}
      />
    );


    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} to="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

LoadingLogo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default LoadingLogo;
