import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack } from '@mui/material';
import LoadingScreen from 'components/loading-screen';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useUpdateDealerById } from '../../../services/dealerServices';

DealerEditForm.propTypes = {
  DealerData: PropTypes.func,
};

export default function DealerEditForm({ DealerData }) {
  const navigate = useNavigate();

  const { updateDealer, isLoading } = useUpdateDealerById();

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const NewUserSchema = Yup.object().shape({
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
  });

  const defaultValues = useMemo(
    () => ({
      _id: DealerData?._id || '',
      dist_com_name: DealerData?.dist_com_name || '',
      dist_name: DealerData?.dist_name || '',
      dist_address: DealerData?.dist_address || '',
      dist_email: DealerData?.dist_email || '',
      dist_contact: DealerData?.dist_contact || '',
      city: DealerData?.city || '',
      pincode: DealerData?.pincode || '',
    }),
    [DealerData]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (DealerData) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DealerData]);

  const onSubmit = async (_data) => {
    try {
      const payload = {
        _id: defaultValues?._id,
        dist_com_name: _data?.dist_com_name,
        dist_address: _data?.dist_address,
        dist_name: _data?.dist_name,
        dist_contact: _data?.dist_contact,
        dist_email: _data?.dist_email,
        pincode: _data?.pincode,
        city: _data?.city,
      };
      updateDealer(payload, {
        onSuccess: () => closeIt(),
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const closeIt = () => {
    reset();
    navigate(PATH_DASHBOARD.dealer.list);
  };

  if (isLoading) return <LoadingScreen />;

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
                  <RHFTextField name="dist_email" label="Email Id" inputProps={{ readOnly: true }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField name="dist_contact" label="Contact No." inputProps={{ readOnly: true }} />
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
              </Grid>
            </Stack>
          </Card>
          <Stack direction="row" spacing={1.5} sx={{ mt: 3 }} justifyContent="end">
            <LoadingButton type="submit" variant="contained" size="" loading={isSubmitting}>
              Update Now
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
