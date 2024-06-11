import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import {
  useCreateBrand,
  useCreateBrandUniqueSlug,
  useUpdateBrandById,
} from '../../../services/brandServices';

BrandAddForm.propTypes = {
  isEdit: PropTypes.bool,
  brandData: PropTypes.func,
};

export default function BrandAddForm({ isEdit = false, brandData }) {
  const navigate = useNavigate();

  const { createBrand, isLoading: brandIsLoading } = useCreateBrand();
  const { updateBrand, isLoading: updateBrandIsLoading } = useUpdateBrandById();
  const { generateUniqueSlug } = useCreateBrandUniqueSlug();

  const NewBrandSchema = Yup.object().shape({
    name: Yup.string().required('Brand Name is required').matches("^[a-zA-Z0-9\\-\\s]+$", 'Insert only normal character'),
    icon: Yup.mixed().test('required', 'Icon is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      _id: brandData?._id || '',
      name: brandData?.name || '',
      icon: brandData?.icon || '',
      slug: brandData?.slug || '',
    }),
    [brandData]
  );

  const methods = useForm({
    resolver: yupResolver(NewBrandSchema),
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
  // This is to set the seo title, meta description, slug and tags
  const createUniqueSlugFromBackend = async (title = '') => {
    const payload = {
      title,
    };
    await generateUniqueSlug(payload, {
      onSuccess: (data) => {
        setValue('slug', data.data.data);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  useEffect(() => {
    if (isEdit && brandData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, brandData]);

  useEffect(() => {
    const slugTimer = setTimeout(() => {
      if (!isEdit) {
        createUniqueSlugFromBackend(values?.name);
      }
      // else if (values?.name !== brandData?.name) {
      //   createUniqueSlugFromBackend(values?.name);
      // }
    }, 1000);

    return () => {
      clearTimeout(slugTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.name, brandData?.name, isEdit]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.set('id', brandData?._id);
      formData.append('icon', data.icon);
      formData.set('name', data.name);
      // formData.set('slug', data.name.toLowerCase().replace(/\s+/g, '-'));
      if (isEdit) {
        // if (data?.name?.toLowerCase() !== brandData?.name?.toLowerCase()) {
        //   formData.set('slug', values?.slug);
        // } else {
        formData.set('slug', brandData?.slug);
        // }
      } else {
        formData.set('slug', values?.slug);
      }
      if (isEdit) {
        updateBrand(formData, {
          onSuccess: () => closeIt(),
        });
      } else {
        createBrand(formData, {
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
          'icon',
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
    navigate(PATH_DASHBOARD.brand.list);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <RHFUploadAvatar
              name="icon"
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
                  <Box sx={{ mb: 0 }}>Icon</Box>
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ pl: 3, pr: 3, pt: 8, pb: 5 }}>
            <Grid item xs={12} md={12} lg={12}>
              <RHFTextField name="name" label="Brand Name" />
            </Grid>
            <Stack alignItems="flex-end" sx={{ mt: 4, mb: 1 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || brandIsLoading || updateBrandIsLoading}
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
