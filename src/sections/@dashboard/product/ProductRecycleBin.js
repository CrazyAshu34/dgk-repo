import PropTypes from 'prop-types';
// @mui
import { Card, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
// utils
import { bgGradient } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

ProductRecycleBin.propTypes = {
  sx: PropTypes.object,
  icon: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
};

export default function ProductRecycleBin({ title, total, icon, color = 'primary', sx, ...other }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: 'center',
        color: theme.palette[color].darker,
        bgcolor: theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
      <Iconify
        icon={icon}
        sx={{
          mb: 3,
          p: 2.5,
          width: 64,
          height: 64,
          borderRadius: '50%',
          color: theme.palette[color].dark,
          ...bgGradient({
            direction: '135deg',
            startColor: `${alpha(theme.palette[color].dark, 0)} 0%`,
            endColor: `${alpha(theme.palette[color].dark, 0.24)} 100%`,
          }),
        }}
      />

      <Typography variant="h3">{title}</Typography>

      <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
        {/* {total > 0 ? total : null} */}
        {total}
      </Typography>
    </Card>
  );
}
