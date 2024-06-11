import PropTypes from 'prop-types';
// @mui
import { Box, Card, Fab, Stack } from '@mui/material';
// routes
// utils
// redux
// components
import Iconify from '../../../../components/iconify';
import Image from '../../../../components/image';

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  item: PropTypes.object,
};

export default function ShopProductCard({ item }) {
  const { title, value } = item;

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      <Box sx={{ position: 'relative', p: 1 }}>
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: 'absolute',
            transition: (theme) =>
              theme.transitions.create('all', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        ><a rel="noreferrer" href={value} target="_blank" download>
          <Iconify icon="material-symbols:download-for-offline-outline" /></a>
        </Fab>

        <Image alt={title} src={value} ratio="1/1" sx={{ borderRadius: 1.5 }} />
      </Box>

      <Stack spacing={2.5} sx={{ p: 3 }}>
        {title}
      </Stack>
    </Card>
  );
}
