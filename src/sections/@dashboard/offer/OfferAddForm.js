import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useCreateOffer, useUpdateOfferById } from '../../../services/offerServices';

OfferAddForm.propTypes = {
  isEdit: PropTypes.bool,
  OfferData: PropTypes.func,
};

export default function OfferAddForm({ isEdit = false, OfferData }) {
  const navigate = useNavigate();

  const [validDate, setValidDate] = useState(new Date());

  const { createOffer, isLoading: OfferIsLoading } = useCreateOffer();
  const { updateOffer, isLoading: updateOfferIsLoading } = useUpdateOfferById();

  const NewOffreSchema = Yup.object().shape({
    title: Yup.string().required('Name is required'),
    coupenCode: Yup.string().required('Coupon code is required'),
    image: Yup.mixed().test('required', 'Icon is required', (value) => value !== ''),
    link: Yup.string().url('Link must be a valid URL'),
  });

  const defaultValues = useMemo(
    () => ({
      _id: OfferData?._id || '',
      title: OfferData?.title || '',
      image: OfferData?.image || '',
      coupenCode: OfferData?.coupenCode || '',
      link: OfferData?.link || '',
      validDate: OfferData?.validDate || '',
    }),
    [OfferData]
  );

  const methods = useForm({
    resolver: yupResolver(NewOffreSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && OfferData) {
      reset(defaultValues);
      setValidDate(OfferData?.validDate);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, OfferData]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.set('id', defaultValues?._id);
      formData.append('image', data.image);
      formData.set('title', data.title);
      formData.append('coupenCode', data.coupenCode);
      formData.set('link', data.link);
      formData.set('validDate', validDate);
      if (isEdit) {
        updateOffer(formData, {
          onSuccess: () => closeIt(),
        });
      } else {
        createOffer(formData, {
          onSuccess: () => closeIt(),
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const closeIt = () => {
    reset();
    navigate(PATH_DASHBOARD.offer.list);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'image',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const ValidDateChange = (newValue) => {
    setValidDate(newValue);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <RHFUploadAvatar
              name="image"
              accept="image/*"
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  <Box sx={{ mb: 0 }}>Banner Image</Box>
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label="Offer Title" />
              <RHFTextField name="coupenCode" label="Coupen Code" />
              <RHFTextField name="link" label="Link" />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Valid Date"
                  inputFormat="MM/DD/YYYY"
                  value={validDate}
                  name="validDate"
                  onChange={ValidDateChange}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
            </Stack>
            <Stack alignItems="flex-end" sx={{ mt: 4, mb: 1 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || OfferIsLoading || updateOfferIsLoading}
              >
                {isEdit ? 'Update' : 'Add Now'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
