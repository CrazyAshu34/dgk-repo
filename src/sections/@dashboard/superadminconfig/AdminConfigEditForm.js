import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFSwitch, RHFTextField, RHFUpload } from '../../../components/hook-form';

export default function AdminConfigEditForm() {
  // {id, staffData }
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const [gstCheck, setGstCheck] = useState(false);
  const [gstVal, setGstVal] = useState('');
  const [reviewCheck, setReviewCheck] = useState(false);
  const NewUserSchema = Yup.object().shape({});

  const defaultValues = {
    publish: true,
    comments: true,
    show_gst: '',
    allow_review: true,
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

  //   useEffect(() => {
  //     if(currentUser){
  //        setGstCheck(currentUser.show_gst)
  //        setGstVal(currentUser.gst)
  //        setReviewCheck(currentUser.allow_review)
  //     }
  //     reset(defaultValues);
  // }, [currentUser]);

  const onSubmit = async (data) => {
    // const payload={
    //     show_gst: gstCheck,
    //     gst: gstVal,
    //     allow_review: reviewCheck
    //   }
  };

  const gst_check = async () => {
    if (gstCheck === true) {
      setGstCheck(false);
      setGstVal('');
    } else {
      setGstCheck(true);
    }
  };
  const review_check = async () => {
    if (reviewCheck === true) {
      setReviewCheck(false);
    } else {
      setReviewCheck(true);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'blog_image',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <div>
                <RHFSwitch
                  name="publish"
                  label="Staff Management"
                  labelPlacement="start"
                  sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                />

                <RHFSwitch
                  name="comments"
                  label="Business To Customer"
                  labelPlacement="start"
                  sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                />

                <RHFSwitch
                  name="comments"
                  label="Business To Business"
                  labelPlacement="start"
                  sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                />

                <Stack spacing={3}>
                  <RHFTextField name="gst" label="SGST" />

                  <RHFTextField name="gst" label="CGST" />

                  <div style={{ marginBottom: '10px' }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Image
                    </Typography>

                    <RHFUpload
                      name="blog_image"
                      accept="image/*"
                      maxSize={3145728}
                      onDrop={handleDrop}
                    />
                  </div>
                </Stack>

                <RHFSwitch
                  name="allow_review"
                  label="Quantity Based Pricing"
                  labelPlacement="start"
                  sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                />

                <RHFSwitch
                  name="allow_review"
                  label="Delership Enquiry"
                  labelPlacement="start"
                  sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                />

                <RHFSwitch
                  name="allow_review"
                  label="Discount Engine"
                  labelPlacement="start"
                  sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                />

                <RHFSwitch
                  name="allow_review"
                  label="Brand Management"
                  labelPlacement="start"
                  sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                />

                <RHFSwitch
                  name="allow_review"
                  label="Blogs"
                  labelPlacement="start"
                  sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                />

                <RHFSwitch
                  name="allow_review"
                  label="Gallery"
                  labelPlacement="start"
                  sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                />
              </div>
            </Stack>
            <Stack alignItems="flex-end" sx={{ mt: 4, mb: 1 }}>
              <LoadingButton type="submit" variant="contained">
                Update
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
