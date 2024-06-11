// routes
import { PATH_AUTH } from '../../../routes/paths';
// config
import { PATH_AFTER_LOGIN } from '../../../config-global';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'Home',
    icon: <Iconify icon="eva:home-fill" />,
    path: '/',
  },

  {
    title: 'Pages',
    path: '/pages',
    icon: <Iconify icon="eva:file-fill" />,
    children: [
      {
        subheader: 'Authentication',
        items: [
          { title: 'Login', path: PATH_AUTH.loginUnprotected },
          { title: 'Register', path: PATH_AUTH.registerUnprotected },
          { title: 'Reset password', path: PATH_AUTH.resetPassword },
          { title: 'Verify code', path: PATH_AUTH.verify },
        ],
      },

      {
        subheader: 'Dashboard',
        items: [{ title: 'Dashboard', path: PATH_AFTER_LOGIN }],
      },
    ],
  },
];

export default navConfig;
