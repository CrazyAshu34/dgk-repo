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
import { useCreateClient, useUpdateClientById } from '../../../services/clientServices';

ClientAddForm.propTypes = {
  isEdit: PropTypes.bool,
  clientData: PropTypes.func,
};

export default function ClientAddForm({ isEdit = false, clientData }) {
  const navigate = useNavigate();

  const { createClient, isLoading: clientIsLoading } = useCreateClient();
  const { updateClient, isLoading: updateclientIsLoading } = useUpdateClientById();

  const NewCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    logo: Yup.mixed().test('required', 'Logo is required', (value) => value !== ''),
    link: Yup.string().url('link must be a valid URL'),
  });

  const defaultValues = useMemo(
    () => ({
      _id: clientData?._id || '',
      name: clientData?.name || '',
      logo: clientData?.logo || '',
      link: clientData?.link || '',
    }),
    [clientData]
  );

  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && clientData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, clientData]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.set('id', defaultValues?._id);
      formData.append('logo', data.logo);
      formData.set('name', data.name);
      formData.set('link', data.link);
      if (isEdit) {
        updateClient(formData, {
          onSuccess: () => closeIt(),
        });
      } else {
        createClient(formData, {
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
          'logo',
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
    navigate(PATH_DASHBOARD.client.list);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <RHFUploadAvatar
              name="logo"
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
                  <Box sx={{ mb: 0 }}>Logo</Box>
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <RHFTextField name="name" label="client Name" />
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <RHFTextField name="link" label="LINK" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 4, mb: 1 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || clientIsLoading || updateclientIsLoading}
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
