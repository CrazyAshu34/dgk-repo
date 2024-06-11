import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { CustomAvatar } from '../../../components/custom-avatar';
import Image from '../../../components/image';
import { bgBlur } from '../../../utils/cssStyles';

const StyledRoot = styled('div')(({ theme }) => ({
  '&:before': {
    ...bgBlur({
      color: theme.palette.primary.darker,
    }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

const StyledInfo = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

DealerCover.propTypes = {
  myProfile: PropTypes.object,
  dealerData: PropTypes.object,
};

export default function DealerCover({ dealerData, myProfile }) {
  const { cover } = myProfile;
  const { ret_id, dist_name, image } = dealerData;
  return (
    <StyledRoot>
      <StyledInfo>
        <CustomAvatar
          image={image}
          name={dist_name}
          sx={{
            mx: 'auto',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'common.white',
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
          }}
        />

        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="h4">{dist_name}</Typography>
          <Typography sx={{ opacity: 0.72 }}>{ret_id}</Typography>
        </Box>
      </StyledInfo>
      <Image
        alt="profile cover"
        src={cover}
        sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </StyledRoot>
  );
}
