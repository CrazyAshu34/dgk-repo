import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Divider, MenuItem, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import { IconButtonAnimate } from '../../../components/animate';
import { CustomAvatar } from '../../../components/custom-avatar';
import LoadingScreen from '../../../components/loading-screen';
import MenuPopover from '../../../components/menu-popover';
import { useSnackbar } from '../../../components/snackbar';
import BlankPage from '../../../pages/dashboard/BlankPage';
import { useGetOneUserById } from '../../../services/userServices';
// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: PATH_DASHBOARD.user.profile,
  },
  {
    label: 'Settings',
    linkTo: PATH_DASHBOARD.user.account,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  const { userdata, logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const [openPopover, setOpenPopover] = useState(null);

  const userId = localStorage.getItem('userId');

  const { data: user, isLoading, isError } = useGetOneUserById(userId);

  if (isLoading) return <LoadingScreen />;

  if (isError) return <BlankPage />;

 // console.log('oneUserData', user);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleLogout = async () => {
    try {
      logout();
      navigate(PATH_AUTH.login, { replace: true });
      handleClosePopover();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleClickItem = (path) => {
    handleClosePopover();
    navigate(path);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          ...(openPopover && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <CustomAvatar src={user?.profile} alt={user?.name} name={user?.name} />
        {/* <CustomAvatar src={user?.photoURL} alt={user?.displayName} name={user?.displayName} /> */}
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {/* {user?.displayName} */}
            {user?.name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email_id}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
