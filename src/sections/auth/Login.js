
// @mui
import { Stack, Typography } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// routes
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthLoginForm from './AuthLoginForm';
// ----------------------------------------------------------------------
import { useEffect } from 'react';
/* eslint-disable */

export default function Login() {
  const { method } = useAuthContext();

  useEffect(() => {
  })
  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Sign in to {process.env.REACT_APP_COMPANY_NAME}</Typography>
      </Stack>

      <AuthLoginForm />
    </LoginLayout>
  );
}
