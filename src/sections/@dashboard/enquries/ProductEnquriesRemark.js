import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '../../../components/hook-form';

ProductEnquriesRemark.propTypes = {
  message: PropTypes.object,
};

export default function ProductEnquriesRemark({ message }) {
  const NewUserSchema = Yup.object().shape({});

  const defaultValues = {
    message: message || '',
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

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
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
                <RHFTextField
                  name="message"
                  label="Message"
                  fullWidth
                  multiline
                  rows={3}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
