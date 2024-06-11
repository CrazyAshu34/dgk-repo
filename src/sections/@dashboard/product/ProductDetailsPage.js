import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import Image from '../../../components/image';

export default function ProductDetailsPage() {
  // {id, staffData }
  // const { designation_id } = staffData;
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const NewUserSchema = Yup.object().shape({});

  const defaultValues = {
    name: '',
    designation_id: '',
    dob: '',
    contact_no: '',
    scontact_no: '',
    email_id: '',
    profile: '',
    // name: staffData?.name ? staffData?.name : '',
    // designation_id: staffData?.designation_id ? staffData?.designation_id : '',
    // dob: staffData?.dob ? staffData?.dob : '',
    // contact_no: staffData?.contact_no ? staffData?.contact_no : '',
    // scontact_no: staffData?.scontact_no ? staffData?.scontact_no : '',
    // email_id: staffData?.email_id ? staffData?.email_id : '',
    // profile: staffData?.profile ? staffData?.profile : '',
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
    console.log('data', data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, mb: 2 }}>
            <Box sx={{ mb: 1 }}>
              <Image
                alt="file_360"
                // src={staffData?.profile}
                src=""
                style={{ borderRadius: '16px', objectFit: 'fill', height: '200px' }}
              />
            </Box>
          </Card>
        </Grid>

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
                    // value={moment(staffData?.dob).format('DD/MM/YYYY')}
                    inputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="designation_id"
                    // value={designationfor?.designation_name}
                    label="Designation"
                    inputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField name="email_id" label="Email" inputProps={{ readOnly: true }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="contact_no"
                    label="Primary Contact No."
                    type="number"
                    inputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="scontact_no"
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
