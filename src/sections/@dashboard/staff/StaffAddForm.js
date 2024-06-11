  import { yupResolver } from '@hookform/resolvers/yup';
  import { LoadingButton } from '@mui/lab';
  import {
    Box,
    Card,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Typography,
  } from '@mui/material';

  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
  import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

  import { useCallback, useState } from 'react';
  import { useForm } from 'react-hook-form';
  import { useNavigate } from 'react-router-dom';
  import * as Yup from 'yup';
  import FormProvider, {
    RHFSelect,
    RHFTextField,
    RHFUploadAvatar,
  } from '../../../components/hook-form';
  import Iconify from '../../../components/iconify';
  import LoadingScreen from '../../../components/loading-screen';
  import BlankPage from '../../../pages/dashboard/BlankPage';
  import { PATH_DASHBOARD } from '../../../routes/paths';
  import { useGetAllDesignation } from '../../../services/designationServices';
  import { useCreateStaff } from '../../../services/staffServices';

  export default function StaffAddForm() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState('');

    const { createStaff, isLoading: staffIsLoading } = useCreateStaff();
    const {
      data: allDesignation,
      isLoading: designationLoding,
      isError: designationError,
    } = useGetAllDesignation();

    const newActiveDesignation = allDesignation?.filter(
      (item) => item?.designationStatus === 'Active'
    );

    const phoneRegExp =
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const NewStaffSchema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      emailId: Yup.string().email('Email must be a valid email address'),
      // dob: Yup.string().required('Date of birth is required'),
      designationId: Yup.string().required('Designation is required'),
      contactNo: Yup.string()
        .min(10, 'Password must be at least 10 characters')
        .max(10, 'Password must be at least 10 characters')
        .matches(phoneRegExp, 'Phone number is not valid'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      c_pass: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    });

    const defaultValues = {
      name: '',
      designationId: '',
      dob: '',
      contactNo: '',
      scontactNo: '',
      emailId: '',
      password: '',
      profile: '',
    };

    const methods = useForm({
      resolver: yupResolver(NewStaffSchema),
      defaultValues,
    });

    const {
      reset,
      setValue,
      handleSubmit,
      formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data) => {
      console.log('data', data);

      // Don't get too cocky

      try {
        const formData = new FormData();
        formData.append('profile', data.profile);
        formData.set('password', data.password);
        formData.set('designationId', data.designationId);
        formData.set('dob', dateOfBirth);
        formData.set('name', data.name);
        formData.set('emailId', data.emailId);
        formData.set('scontactNo', data.scontactNo);
        formData.set('contactNo', data.contactNo);
        formData.set('remarks', data.remarks);
        createStaff(formData, {
          onSuccess: () => closeIt(),
        });
      } catch (error) {
        console.error('error', error);
      }
    };

    const handleDrop = useCallback(
      (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
          setValue(
            'profile',
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
      navigate(PATH_DASHBOARD.staff.list);
    };

    const handleChange = (newValue) => {
      setDateOfBirth(newValue);
    };

    if (designationLoding) return <LoadingScreen />;

    if (designationError) return <BlankPage />;

    return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, mb: 2 }}>
              <Box sx={{ mb: 1 }}>
                <RHFUploadAvatar
                  name="profile"
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
                      <Box sx={{ mb: 0 }}>Profile Picture</Box>
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                    </Typography>
                  }
                />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="name" label="Name" />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="Date Of Birth"
                        inputFormat="MM/DD/YYYY"
                        value={dateOfBirth}
                        name="dob"
                        onChange={handleChange}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    {/* <RHFSelect
                      native
                      name="designationId"
                      label="Select Designation"
                      placeholder="Select Designation"
                    >
                      <option value="">Select Designation</option>
                      {newActiveDesignation.map((option) => (
                        <option value={option?._id}>{option.designation_name}</option>
                      ))}
                    </RHFSelect> */}

                    <RHFSelect
                      name="designationId"
                      label="Select Designation"
                      size="large"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                    >
                      <MenuItem
                        value=""
                        sx={{
                          mx: 1,
                          borderRadius: 0.75,
                          typography: 'body2',
                          fontStyle: 'italic',
                          color: 'text.secondary',
                        }}
                      >
                        None
                      </MenuItem>
                      <Divider />
                      {newActiveDesignation.map((option) => (
                        <MenuItem
                          key={option}
                          value={option?._id}
                          sx={{
                            mx: 1,
                            my: 0.5,
                            borderRadius: 0.75,
                            typography: 'body2',
                            textTransform: 'capitalize',
                          }}
                        >
                          {option.designationName}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <RHFTextField name="emailId" label="Email" defaultValues="" />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <RHFTextField name="contactNo" label="Primary Contact No." type="number" />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <RHFTextField
                      name="scontactNo"
                      label="Secondary  Contact No."
                      inputProps={{
                        maxLength: 10,
                        minLength: 10,
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        min: 10,
                        max: 10,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <RHFTextField
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <RHFTextField
                      name="c_pass"
                      label="Confirm New Password"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                  <RHFTextField
                      name="remarks"
                      label="Remarks"
                    />
                  </Grid>
                </Grid>
              </Stack>

              <Stack direction="row" spacing={1.5} sx={{ mt: 3 }} justifyContent="end">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size=""
                  loading={isSubmitting || staffIsLoading}
                >
                  Add Now
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
