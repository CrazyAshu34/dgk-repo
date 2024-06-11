import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Dialog,
  DialogTitle,
  Grid, Stack
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useCreateCustomer, useUpdateCustomerById } from '../../../services/customerServices';
import DialogAssigned from '../service/DialogAssigned';

CustomerAddForm.propTypes = {
  isEdit: PropTypes.bool,
  customerData: PropTypes.func,
};

export default function CustomerAddForm({ isEdit = false, customerData }) {
  const navigate = useNavigate();
  const [dateofBirth, setDateOfBirth] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [assignee, setAssignee] = useState(null);
  const { createCustomer, isLoading: customerIsLoading } = useCreateCustomer();
  const { updateCustomer, isLoading: updateCustomerIsLoading } = useUpdateCustomerById();

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const NewBannerSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    emailId: Yup.string()
      .email('Email must be a valid email address'),
    city: Yup.string().required('City is required'),
    contactNo: Yup.string()
      .min(10, 'Contact No. Must be at least 10 characters')
      .max(10, 'Contact No. Must not be more than 10 characters')
      .matches(phoneRegExp, 'Phone number is not valid'),
  });

  const defaultValues = useMemo(
    () => ({
      _id: customerData?._id || '',
      name: customerData?.name || '',
      mobileNumber: customerData?.mobileNumber || '',
      emailId: customerData?.emailId || '',
    }),
    [customerData]
  );

  const methods = useForm({
    resolver: yupResolver(NewBannerSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && customerData) {
      reset(defaultValues);
      setAssignee(customerData?.assignee ? JSON.parse(customerData?.assignee) : null);
      setDateOfBirth(customerData?.dob);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, customerData]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        id: customerData?._id,
        name: data.name,
        mobileNumber: data.mobileNumber,
        emailId: data.emailId,
      };
      if (isEdit) {
        updateCustomer(payload, {
          onSuccess: (dataa) => closeIt(dataa),
        });
      } else {
        createCustomer(payload, {
          onSuccess: (dataa) => closeIt(dataa),
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const closeIt = (data) => {
    if (data?.data?.status === true) {
      reset();
      navigate(PATH_DASHBOARD.customer.list);
    }
  };
  const onAssignStaff = (val) => {
    console.log(val);
  }
  const handleAddEvent = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const ValidDateChange = (newValue) => {
    setDateOfBirth(newValue);
  };
  //
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <RHFTextField name="name" label="Name" />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <RHFTextField name="emailId" label="Email" />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <RHFTextField name="mobileNumber" type="number" label="Primary Contact Number" />
                  </Grid>
                </Grid>
              </Stack>
              <Stack direction="row" spacing={1.5} sx={{ mt: 3 }} justifyContent="end">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size=""
                  loading={isSubmitting || customerIsLoading || updateCustomerIsLoading}
                >
                  {isEdit ? 'Update Now' : 'Post Now'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <Dialog fullWidth maxWidth="lg" open={showModal} onClose={handleCloseModal}>
        <DialogTitle>Salect Account Manager</DialogTitle>
        <DialogAssigned
          setAssignee={setAssignee}
          onCancel={handleCloseModal}
          onAssignStaff={onAssignStaff}
          pageName="customer"
        />
      </Dialog>
    </>
  );
}
