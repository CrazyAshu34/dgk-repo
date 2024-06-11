import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useUpdatePasswordById } from '../../../services/staffServices';

ChangePassword.propTypes = {
  staffData: PropTypes.object,
};

export default function ChangePassword({ staffData }) {
  const navigate = useNavigate();

  const { updatePassword, isLoading: ChangePasswordIsLoading } = useUpdatePasswordById();

  const NewStaffSchema = Yup.object().shape({
    password: Yup.string().required('New Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const defaultValues = useMemo(
    () => ({
      _id: staffData?._id || '',
      password: '',
      confirmPassword: '',
    }),
    [staffData]
  );

  const methods = useForm({
    resolver: yupResolver(NewStaffSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const payload = {
        id: defaultValues?._id,
        password: data.password,
      };
      console.log('payload', payload);
      updatePassword(payload, {
        onSuccess: () => closeIt(),
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const closeIt = () => {
    reset();
    navigate(PATH_DASHBOARD.staff.list);
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="password" type="password" label="New Password" />

          <RHFTextField name="confirmPassword" type="password" label="Confirm New Password" />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting || ChangePasswordIsLoading}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
