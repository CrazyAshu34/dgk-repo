// @mui
import { Box, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// routes
// components
import { CustomAvatar } from '../../../components/custom-avatar';

import LoadingScreen from '../../../components/loading-screen';
import BlankPage from '../../../pages/dashboard/BlankPage';
import { useGetOneUserById } from '../../../services/userServices';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { userdata } = useAuthContext();

  const userId = localStorage.getItem('userId');

  const { data: user, isLoading, isError } = useGetOneUserById(userId);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

  return (
    <StyledRoot>
      <CustomAvatar src={user?.profile} alt={user?.name} name={user?.name} />

      <Box sx={{ ml: 2, minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {user?.name}
        </Typography>

        <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
          {user?.designation_name}
        </Typography>
      </Box>
    </StyledRoot>
  );
}
