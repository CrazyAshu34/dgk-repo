import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import Image from '../../../components/image';
import LoadingScreen from '../../../components/loading-screen';
import BlankPage from '../../../pages/dashboard/BlankPage';
import { useGetOneDesignationById } from '../../../services/designationServices';

StaffDetailsPage.propTypes = {
  staffData: PropTypes.func,
};

export default function StaffDetailsPage({ staffData }) {
  const { designationId, profile } = staffData;

  const {
    data: designationData,
    isError: designationError,
    isLoading: designationLoading,
  } = useGetOneDesignationById(designationId);

  const NewStaffSchema = Yup.object().shape({});

  const defaultValues = {
    name: staffData?.name ? staffData?.name : '',
    designationId: staffData?.designationId ? staffData?.designationId : '',
    dob: staffData?.dob ? staffData?.dob : '',
    contactNo: staffData?.contactNo ? staffData?.contactNo : '',
    scontactNo: staffData?.scontactNo ? staffData?.scontactNo : '',
    emailId: staffData?.emailId ? staffData?.emailId : '',
    profile: staffData?.profile ? staffData?.profile : '',
  };

  const methods = useForm({
    resolver: yupResolver(NewStaffSchema),
    defaultValues,
  });

  const {
    formState: { isSubmitting },
  } = methods;

  if (designationLoading) return <LoadingScreen />;

  if (designationError) return <BlankPage />;

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        {profile?.length > 0 ? (
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, mb: 2 }}>
              <Box sx={{ mb: 1 }}>
                <Image alt="file_360" src={profile} fill style={{ borderRadius: '16px' }} />
              </Box>
            </Card>
          </Grid>
        ) : null}

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="name" label="Name" inputProps={{ readOnly: true }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="dob"
                    label="Date Of Birth"
                    value={moment(staffData?.dob).format('DD/MM/YYYY')}
                    inputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Designation
                  </Typography>
                  <RHFTextField
                    name="designationId"
                    value={designationData?.designationName}
                    inputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mt: 3 }}>
                    {' '}
                    <RHFTextField name="emailId" label="Email" inputProps={{ readOnly: true }} />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="contactNo"
                    label="Primary Contact No."
                    type="number"
                    inputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="scontactNo"
                    label="Secondary  Contact No."
                    type="number"
                    inputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
