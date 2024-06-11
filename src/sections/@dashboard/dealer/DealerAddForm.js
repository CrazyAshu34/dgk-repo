import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, IconButton, InputAdornment, Stack } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/iconify';
import LoadingScreen from '../../../components/loading-screen';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useCreateDealer } from '../../../services/dealerServices';

export default function DealerAddForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { createDealer, isLoading: dealerIsLoading } = useCreateDealer();

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const NewStaffSchema = Yup.object().shape({
    dist_com_name: Yup.string().required('Firm Name is required'),
    dist_name: Yup.string().required('Name is required'),
    dist_address: Yup.string().required('Complete address is required'),
    dist_email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required'),
    dist_contact: Yup.string()
      .min(10, 'Password must be at least 10 characters')
      .max(10, 'Password must be at least 10 characters')
      .matches(phoneRegExp, 'Phone number is not valid'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    c_pass: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const defaultValues = {
    dist_com_name: '',
    dist_name: '',
    dist_address: '',
    dist_email: '',
    dist_contact: '',
    city: '',
    pincode: '',
    password: '',
    profile: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewStaffSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (_data) => {
    console.log('data', _data);
    try {
      const payload = {
        dist_com_name: _data?.dist_com_name,
        dist_address: _data?.dist_address,
        dist_name: _data?.dist_name,
        dist_contact: _data?.dist_contact,
        dist_email: _data?.dist_email,
        pincode: _data?.pincode,
        city: _data?.city,
        password: _data?.password,
      };
      createDealer(payload, {
        onSuccess: (successdata) => closeIt(successdata),
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const closeIt = (successdata) => { 
    console.log("successdata", successdata);
    if (successdata?.data?.status === true) {
      reset();
      navigate(PATH_DASHBOARD.dealer.list);
    }
    
  };

  if (dealerIsLoading) return <LoadingScreen />;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="dist_com_name" label="Firm Name" />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField name="dist_name" label="Retailer Name" />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField name="dist_email" label="Email Id" />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField name="dist_contact" label="Contact No." />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="pincode"
                    label="Pincode"
                    inputProps={{
                      maxLength: 6,
                      minLength: 6,
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      min: 6,
                      max: 6,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField name="city" label="City" />
                </Grid>

                <Grid item xs={12} md={12}>
                  <RHFTextField name="dist_address" multiline rows={3} label="Complete Address" />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="c_pass"
                    label="Confirm New Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }} justifyContent="end">
              <LoadingButton
                type="submit"
                variant="contained"
                size=""
                loading={isSubmitting || dealerIsLoading}
              >
                Add Now
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
