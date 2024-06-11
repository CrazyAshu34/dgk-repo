/* eslint-disable no-nested-ternary */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
  RHFUpload,
} from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useCreateBanners, useUpdateBannersById } from '../../../services/bannerServices';

BannerAddForm.propTypes = {
  isEdit: PropTypes.bool,
  bannerData: PropTypes.func,
};

export default function BannerAddForm({ isEdit = false, bannerData }) {
  const navigate = useNavigate();
  const bannersType = [
    { bannerName: 'DeskTop Banner', bannerKey: 'DESKTOP_BANNER' },
    { bannerName: 'Mobile Banner', bannerKey: 'MOBILE_BANNER' },
    { bannerName: 'Popup Banner', bannerKey: 'POPUP_BANNER' }
  ]
  const { createBanner, isLoading: bannerIsLoading } = useCreateBanners();
  const { updateBanner, isLoading: updatebannerIsLoading } = useUpdateBannersById();

  const NewBannerSchema = Yup.object().shape({
    bannerTitle: Yup.string().required('Title is required'),
    bannerSubtitle: Yup.string(),
    bannerImage: Yup.mixed().test('required', 'Banner Image is required', (value) => value !== ''),
    bannerType: Yup.string().required('Banner type is required'),
    link: Yup.string().url('Banner link must be a valid URL'),
  });

  const defaultValues = useMemo(
    () => ({
      _id: bannerData?._id || '',
      bannerTitle: bannerData?.bannerTitle || '',
      bannerSubtitle: bannerData?.bannerSubtitle || '',
      bannerType: bannerData?.bannerType || '',
      bannerImage: bannerData?.bannerImage || '',
      link: bannerData?.link || '',
    }),
    [bannerData]
  );

  const methods = useForm({
    resolver: yupResolver(NewBannerSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;
  const values = watch();
  useEffect(() => {
    if (isEdit && bannerData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, bannerData]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.set('id', bannerData?._id);
      formData.append('bannerImage', data.bannerImage);
      formData.set('bannerTitle', data.bannerTitle);
      formData.set('bannerSubtitle', data.bannerSubtitle);
      formData.set('bannerType', data.bannerType);
      formData.set('link', data.link);
      if (isEdit) {
        updateBanner(formData, {
          onSuccess: () => closeIt(),
        });
      } else {
        createBanner(formData, {
          onSuccess: () => closeIt(),
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'bannerImage',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const closeIt = () => {
    reset();
    navigate(PATH_DASHBOARD.banner.list);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="bannerTitle" label="Banner title" />
              {values?.bannerType !== 'Category Banner 1' &&
                values?.bannerType !== 'Category Banner 2' &&
                values?.bannerType !== 'Category Banner 3' && (
                  <RHFTextField name="bannerSubtitle" label="Banner sub title" />
                )}
              <RHFAutocomplete
                name="bannerType"
                label="Banner Type"
                // multiple
                freeSolo
                options={[
                  'Desktop Banner',
                  'Mobile Banner',
                  'Popup Banner',
                ].map((option) => option)}
                ChipProps={{ size: 'small' }}
              />

              <RHFTextField name="link" label="Product Link" />

              <div>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Banner Image
                </Typography>

                <RHFUpload
                  name="bannerImage"
                  // maxSize={3145728}
                  accept="image/*"
                  helperText={
                    <Typography variant="body2" textAlign="center">
                      {values?.bannerType === 'Category Banner 1'
                        ? 'Minimum Resolution : 650 x 320'
                        : values?.bannerType === 'Category Banner 2' ||
                          values?.bannerType === 'Category Banner 3'
                          ? 'Minimum Resolution : 320 x 320'
                          : null}
                    </Typography>
                  }
                  onDrop={handleDrop}
                />
              </div>
            </Stack>
          </Card>

          <Stack direction="row" spacing={1.5} sx={{ mt: 3 }} justifyContent="end">
            <LoadingButton
              type="submit"
              variant="contained"
              size=""
              loading={isSubmitting || bannerIsLoading || updatebannerIsLoading}
            >
              {isEdit ? 'Update Now' : 'Post Now'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
//---------------------------------------------------------------------------------------------------------
