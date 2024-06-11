import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFAutocomplete, RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useCreateDiscount, useUpdateDiscountById } from '../../../services/discountServices';

DiscountAddForm.propTypes = {
  isEdit: PropTypes.bool,
  discountData: PropTypes.func,
};

export default function DiscountAddForm({ isEdit = false, discountData }) {
  const navigate = useNavigate();

  const { createDiscount, isLoading: DiscountIsLoading } = useCreateDiscount();
  const { UpdateDiscount, isLoading: updateDiscountIsLoading } = useUpdateDiscountById();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const NewDiscountSchema = Yup.object().shape({
    name: Yup.string().required('Coupon Name is required'),
    code: Yup.string().required('Coupon Code is required'),
    type: Yup.string().required('Coupon Type is required'),
    category: Yup.string().required('Coupon Category is required'),
    discount: Yup.number().required('Discount is required'),
    minAmount: Yup.number().required('Minimum Amount is required'),
    usingTime: Yup.string().required('Using Coupon Code is required'),
    // startDate: Yup.string().required('Start Date is required'),
    // endDate: Yup.string().required('End Date is required'),
  });

  const defaultValues = useMemo(
    () => ({
      _id: discountData?._id || '',
      name: discountData?.name || '',
      code: discountData?.code || '',
      type: discountData?.type || '',
      category: discountData?.category || '',
      discount: discountData?.amount || 0,
      minAmount: discountData?.minAmount || 0,
      startDate: discountData?.startDate || '',
      endDate: discountData?.endDate || '',
      usingTime: discountData?.usingTime || '',
    }),
    [discountData]
  );

  const methods = useForm({
    resolver: yupResolver(NewDiscountSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && discountData) {
      reset(defaultValues);
      setStartDate(discountData?.startDate);
      setEndDate(discountData?.endDate);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, discountData]);

  const onSubmit = async (_data) => {
    console.log('_data', _data);
    try {
      const payload = {
        id: defaultValues?._id,
        name: _data?.name,
        code: _data?.code,
        type: _data?.type,
        category: _data?.category,
        usingTime: _data?.usingTime,
        discount: _data?.discount,
        minAmount: _data?.minAmount,
        // eslint-disable-next-line object-shorthand
        startDate: startDate,
        // eslint-disable-next-line object-shorthand
        endDate: endDate,
      };
      if (isEdit) {
        UpdateDiscount(payload, {
          onSuccess: () => closeIt(),
        });
      } else {
        createDiscount(payload, {
          onSuccess: () => closeIt(),
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const closeIt = () => {
    reset();
    navigate(PATH_DASHBOARD.discount.list);
  };

  const StartDateChange = (newValue) => {
    setStartDate(newValue);
  };

  const EndDateChange = (newValue) => {
    setEndDate(newValue);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={6}>
                <RHFTextField name="name" label="Coupon Name" />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <RHFTextField name="code" label="Coupon Code" />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFAutocomplete
                  name="type"
                  label="Coupon Type"
                  // multiple
                  freeSolo
                  options={['FLAT', 'PERCENTAGE'].map((option) => option)}
                  ChipProps={{ size: 'small' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFAutocomplete
                  name="category"
                  label="Coupon Category"
                  // multiple
                  freeSolo
                  options={['Public', 'Private'].map((option) => option)}
                  ChipProps={{ size: 'small' }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <RHFTextField name="discount" label="Discount Amount(Only Number)" type="number" />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <RHFTextField name="minAmount" label="Apply Coupon Code Minimum Amount(Only Number)" type="number" />
              </Grid>
              <Grid item xs={12} md={12}>
                <RHFAutocomplete
                  name="usingTime"
                  label="Using Coupon Code"
                  // multiple
                  freeSolo
                  options={['One-Time-Use', 'Multi-Time-Use'].map((option) => option)}
                  ChipProps={{ size: 'small' }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Start Date"
                    inputFormat="MM/DD/YYYY"
                    value={startDate}
                    name="startDate"
                    onChange={StartDateChange}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6} lg={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="End Date"
                    inputFormat="MM/DD/YYYY"
                    value={endDate}
                    name="endDate"
                    onChange={EndDateChange}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || DiscountIsLoading || updateDiscountIsLoading}
              >
                {isEdit ? 'Update Now' : 'Add Now'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
