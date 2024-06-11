import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, {
  RHFEditor,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import {
  useCreateTestimonials,
  useUpdateTestimonialsById,
} from '../../../services/testimonialsServices';

export const review = [
  { label: '1 Star' },
  { label: '2 Star' },
  { label: '3 Star' },
  { label: '4 Star' },
  { label: '5 Star' },
];

TestimonialsAddForm.propTypes = {
  isEdit: PropTypes.bool,
  testimonialsData: PropTypes.func,
};

export default function TestimonialsAddForm({ isEdit = false, testimonialsData }) {
  const navigate = useNavigate();

  const { createTestimonials, isLoading: TestimonialsIsLoading } = useCreateTestimonials();
  const { updateTestimonials, isLoading: updateTestimonialsIsLoading } =
    useUpdateTestimonialsById();

  const NewTestimonialsSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    comment: Yup.string().required('Comment is required'),
    designation: Yup.string().required('Designation is required'),
    // rewiew: Yup.string().required('Review is required'),
    image: Yup.mixed().test('required', 'Icon is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      _id: testimonialsData?._id || '',
      name: testimonialsData?.name || '',
      comment: testimonialsData?.comment || '',
      rewiew: testimonialsData?.rewiew || '',
      image: testimonialsData?.image || '',
      designation: testimonialsData?.designation || '',
    }),
    [testimonialsData]
  );

  const methods = useForm({
    resolver: yupResolver(NewTestimonialsSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && testimonialsData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, testimonialsData]);

  const onSubmit = async (data) => {
    console.log('data', data);
    try {
      const formData = new FormData();
      formData.set('id', testimonialsData?._id);
      formData.set('name', data.name);
      formData.append('image', data.image);
      formData.set('rewiew', data.rewiew);
      formData.set('comment', data.comment);
      formData.set('designation', data.designation);
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      if (isEdit) {
        updateTestimonials(formData, {
          onSuccess: () => closeIt(),
        });
      } else {
        createTestimonials(formData, {
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
          'image',
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
    navigate(PATH_DASHBOARD.testimonials.list);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, mb: 2 }}>
            <Box sx={{ mb: 1 }}>
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
                    <Box sx={{ mb: 0 }}>Testimonials Image</Box>
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={6}>
                <RHFTextField name="name" label="Name" />
              </Grid>

              {/* <RHFSelect native name="rewiew" label="Select Star" placeholder="Select Star">
                  <option value="">Select Star</option>
                  {review.map((option, index) => (
                    <option key={index} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect> */}
              <Grid item xs={12} md={6}>
                <RHFTextField name="designation" label="Designation" />
              </Grid>

              <Grid item xs={12} md={12}>
                <div>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Content
                  </Typography>
                  <RHFTextField simple name="comment" multiline rows={5} />
                </div>
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || TestimonialsIsLoading || updateTestimonialsIsLoading}
              >
                {isEdit ? 'Update Now' : 'Post Now'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
