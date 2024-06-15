// FormAlien.js
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import FormProvider from 'components/hook-form/FormProvider';
import RHFTextField from 'components/hook-form/RHFTextField';

// Validation schema
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const nameRegExp = /^[A-Za-z\s]+$/;

const userSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .matches(nameRegExp, 'Name can only contain letters and spaces'),
  contact: Yup.string()
    .matches(phoneRegExp, 'Phone number must be exactly 10 digits')
    .required('Contact number is required'),
  email: Yup.string()
    .email('Email must be a valid email address')
    .required('Email is required'),
});

function FormAlien({ editData, match }) {
  const [editMode, setEditMode] = React.useState(false);
  const index = match ? match.params.index : null;

  const defaultValues = editData ? editData : {
    name: '',
    contact: '',
    email: ''
  };

  React.useEffect(() => {
    if (index !== null) {
      setEditMode(true);
    }
  }, [index]);

  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  const { handleSubmit, formState: { errors } } = methods;

  const onSubmit = async (data) => {
    try {
      const existingData = localStorage.getItem('formSubmissions');
      const formDataArray = existingData ? JSON.parse(existingData) : [];

      if (editMode) {
        const editIndex = formDataArray.findIndex((item) => item.email === data.email);
        formDataArray[editIndex] = data;
      } else {
        formDataArray.push(data);
      }

      localStorage.setItem('formSubmissions', JSON.stringify(formDataArray));
      setEditMode(false);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods}>
      <Box
        sx={{
          p: 3,
          maxWidth: 500,
          mx: 'auto',
          bgcolor: 'white',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
          marginTop: '100px'
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Enquiry Generation Form
        </Typography>

        <Typography variant="body1" gutterBottom>
          Please fill out the following details to generate your enquiry
        </Typography>

        <Box component="div" noValidate autoComplete="off">
          <RHFTextField
            fullWidth
            label="Name"
            name="name"
            margin="normal"
            required
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <RHFTextField
            fullWidth
            label="Contact Number"
            name="contact"
            margin="normal"
            required
            inputProps={{ maxLength: 10 }}
            error={!!errors.contact}
            helperText={errors.contact?.message}
          />
          <RHFTextField
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            required
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3 }}
            onClick={handleSubmit(onSubmit)}
          >
            {editMode ? 'Update Enquiry' : 'Create Enquiry'}
          </Button>
          <Link to="/auth/table">
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
            >
              View Submitted Data
            </Button>
          </Link>
        </Box>
      </Box>
    </FormProvider>
  );
}

export default FormAlien;
