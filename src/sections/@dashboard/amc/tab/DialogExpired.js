import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, DialogActions, Grid, Paper, Stack } from '@mui/material';
import { CalendarPicker } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useUpdateAmcTableById } from 'services/amcServices';
import * as Yup from 'yup';
import FormProvider from '../../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../../routes/paths';

DialogExpired.propTypes = {
  _id: PropTypes.object,
  onCancel: PropTypes.func,
  date: PropTypes.string,
};

export default function DialogExpired({ _id, onCancel, date }) {
  const navigate = useNavigate();
  const [expiryDate, setexpiryDate] = useState(new Date());
  const { updateAmc, isLoading: updateAmcIsLoading } = useUpdateAmcTableById();
  const NewProductSchema = Yup.object().shape({});
console.log('iddd==',_id);
  const defaultValues = {
    expiry_date: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date().getDate();
    const finalDate = new Date(year + 2, month, day);
    setexpiryDate(finalDate); 
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      id: _id,
      expiry_date: expiryDate,   
    };
    updateAmc(payload, {
      onSuccess: (_data) => closeIt(_data),
    });
  };

  const expiryDateChange = (newValue) => {
    setexpiryDate(newValue);
  };

  const closeIt = (_data) => {
    if (_data?.data?.status === true) {
      reset();
      navigate(PATH_DASHBOARD.amc.list);
      onCancel();
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Box sx={{ ml: 3, mr: 3 }}>
            <Stack
              spacing={3}
              direction={{ lg: 'row', sm: 'column', md: 'column' }}
              justifyContent="center"
              sx={{
                pt: 1,
              }}
            >
              <Paper
                variant="outlined"
                sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
              >
                <CalendarPicker name="expiry_date" date={expiryDate} onChange={expiryDateChange} />
              </Paper>
            </Stack>

            <Stack direction="row" sx={{ mt: 3 }} justifyContent="end">
              <DialogActions>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size=""
                  loading={isSubmitting || updateAmcIsLoading}
                >
                  Add Now
                </LoadingButton>
                <Button variant="outlined" color="inherit" onClick={onCancel}>
                  Cancel
                </Button>
              </DialogActions>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
