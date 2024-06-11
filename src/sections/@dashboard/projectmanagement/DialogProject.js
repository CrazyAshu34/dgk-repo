/* eslint-disable react/jsx-no-duplicate-props */
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Button, DialogActions, Stack, Card } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useUpdateProjectById } from 'services/projectServices';
import LoadingButton from 'theme/overrides/LoadingButton';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import AddProjectImages from './ProjectImages';

DialogProject.propTypes = {
  images: PropTypes.array,
  tabValue: PropTypes.string,
  details: PropTypes.string,
  onCancel: PropTypes.func,
  _id: PropTypes.string,
};
DialogProjectDetails.propTypes = {
  images: PropTypes.array,
  tabValue: PropTypes.string,
  details: PropTypes.string,
  _id: PropTypes.string,
  onCancel: PropTypes.func,
};

export default function DialogProject({ images, details, onCancel, tabValue, _id }) {
  return (
    <>
      <DialogProjectDetails
        details={details}
        _id={_id}
        images={images}
        tabValue={tabValue}
        onCancel={onCancel}
      />

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
export function DialogProjectDetails({ images, details, tabValue, onCancel, _id }) {
  const NewUserSchema = Yup.object().shape({});
  const { updateProject } = useUpdateProjectById();
  const defaultValues = {
    images: images || [],
    details: details || '',
    _id: _id || '',
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const values = watch();
  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const formData = {
        _id: values?._id,
        images: data?.images,
      };
      updateProject(formData, {
        onSuccess: () => onCancel(),
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Box sx={{ pl: 3, pr: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                {tabValue === 'details' ? (
                  <RHFTextField
                    name="details"
                    label="Details"
                    fullWidth
                    multiline
                    rows={3}
                    inputProps={{ readOnly: true }}
                  />
                ) : (
                  <AddProjectImages />
                )}
              </Grid>
              {tabValue === 'images' && (
                <Card sx={{ p: 3 }}>
                  <Stack alignItems="flex-end">
                    <Button type="submit" variant="contained">
                      Upload Images
                    </Button>
                  </Stack>
                </Card>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
