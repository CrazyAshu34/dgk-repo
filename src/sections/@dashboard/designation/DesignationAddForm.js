/* eslint-disable jsx-a11y/label-has-associated-control */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Divider, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFCheckbox, RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import {
  useCreateDesignation,
  useUpdateDesignationById,
} from '../../../services/designationServices';

DesignationAddForm.propTypes = {
  isEdit: PropTypes.bool,
  data: PropTypes.func,
};

export default function DesignationAddForm({ isEdit = false, data }) {
  const navigate = useNavigate();

  const { createDesignation, isLoading: designationIsLoading } = useCreateDesignation();
  const { updateDesignation, isLoading: updatedesignationIsLoading } = useUpdateDesignationById();

  const NewDesignationSchema = Yup.object().shape({
    designationName: Yup.string().required('Designation Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      _id: data?._id || '',
      designationName: data?.designationName || '',
      addstaff: data?.addstaff || false,
      order: data?.order || false,
      // all: data?.orderstatus?.all || false,
      // new: data?.orderstatus?.new || false,
      // onprocess: data?.orderstatus?.onprocess || false,
      // dispatched: data?.orderstatus?.dispatched || false,
      // delivered: data?.orderstatus?.delivered || false,
      // cancelled: data?.orderstatus?.cancelled || false,
      productmanagement: data?.productmanagement || false,
      customer: data?.customer || false,
      contactenquiries: data?.contactenquiries || false,
      productenquiry: data?.productenquiry || false,
      testimonials: data?.testimonials || false,
      banner: data?.banner || false,
      notification: data?.notification || false,
      blogmanagement: data?.blogmanagement || false,
      category: data?.category || false,
      subcategory: data?.subcategory || false,
      supersubcategory: data?.supersubcategory || false,
      designation: data?.designation || false,
      brandmanagement: data?.brandmanagement || false,
      discount: data?.discount || false,
      generalconfig: data?.generalconfig || false,
      colorfamilies: data?.colorfamilies || false,
      offer: data?.offer || false,
      gst: data?.gst || false,
    }),
    [data]
  );

  const methods = useForm({
    resolver: yupResolver(NewDesignationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && data) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, data]);

  const onSubmit = async (_data) => {
    try {
      const payload = {
        designationName: _data?.designationName,
        id: defaultValues?._id,
        addstaff: _data?.addstaff,
        order: _data?.order,
        // orderstatus: {
        //   all: _data?.all,
        //   new: _data?.new,
        //   onprocess: _data?.onprocess,
        //   dispatched: _data?.dispatched,
        //   delivered: _data?.delivered,
        //   cancelled: _data?.cancelled,
        // },
        productmanagement: _data?.productmanagement,
        customer: _data?.customer,
        contactenquiries: _data?.contactenquiries,
        productenquiry: _data?.productenquiry,
        testimonials: _data?.testimonials,
        banner: _data?.banner,
        notification: _data?.notification,
        blogmanagement: _data?.blogmanagement,
        category: _data?.category,
        subcategory: _data?.subcategory,
        supersubcategory: _data?.supersubcategory,
        designation: _data?.designation,
        brandmanagement: _data?.brandmanagement,
        discount: _data?.discount,
        generalconfig: _data?.generalconfig,
        colorfamilies: _data?.colorfamilies,
        offer: _data?.offer,
        gst: _data?.gst,
      };
      if (isEdit) {
        console.log("payload==", payload);
        updateDesignation(payload, {
          onSuccess: () => closeIt(),
        });
      } else {
        createDesignation(payload, {
          onSuccess: () => closeIt(),
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const closeIt = () => {
    reset();
    navigate(PATH_DASHBOARD.designation.list);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <RHFTextField name="designationName" label="Designation Name" />
        </Grid>

        <Grid item xs={12} md={7} />

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }} spacing={3}>
            <Typography variant="h6">ECOM Management</Typography>
            <Divider borderColor="grey.500" sx={{ marginTop: '10px', marginBottom: '5px' }} />
            <Stack spacing={2}>
              <RHFCheckbox name="addstaff" label="Staff Management" />
              <RHFCheckbox name="customer" label="Customer Management" />


              <RHFCheckbox name="productmanagement" label="Product Management" />
              <RHFCheckbox name="order" label="Order Management" />
              {/* <Stack spacing={0} style={{ marginLeft: '50px' }}>
                <RHFCheckbox name="all" label="All" />
                <RHFCheckbox name="new" label="New" />
                <RHFCheckbox name="onprocess" label="On Process" />
                <RHFCheckbox name="dispatched" label="Dispatched" />
                <RHFCheckbox name="delivered" label="Delivered" />
                <RHFCheckbox name="cancelled" label="Cancelled" />
              </Stack> */}

            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }} spacing={3}>
            <Typography variant="h6">Enquiry Management</Typography>
            <Divider borderColor="grey.500" sx={{ marginTop: '10px', marginBottom: '5px' }} />
            <Stack spacing={2}>
              <RHFCheckbox name="contactenquiries" label="Contact Enquires" />
              <RHFCheckbox name="productenquiry" label="Product Review" />
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }} spacing={3}>
            <Typography variant="h6">CONFIGRATION</Typography>
            <Divider borderColor="grey.500" sx={{ marginTop: '10px', marginBottom: '5px' }} />
            <Stack spacing={2}>

              <RHFCheckbox name="testimonials" label="Testimonial" />
              <RHFCheckbox name="blogmanagement" label="Blog" />
              <RHFCheckbox name="banner" label="Banner management" />
              <RHFCheckbox name="notification" label="Notification" />

            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }} spacing={3}>
            <Typography variant="h6">POSTS</Typography>
            <Divider borderColor="grey.500" sx={{ marginTop: '10px', marginBottom: '5px' }} />
            <Stack spacing={2}>
              <RHFCheckbox name="category" label="Category" />
              <RHFCheckbox name="subcategory" label="Sub Category" />
              <RHFCheckbox name="supersubcategory" label="Super Sub Category" />
              <RHFCheckbox name="brandmanagement" label="Brand Management" />
              <RHFCheckbox name="designation" label="Designation And Rights" />
              <RHFCheckbox name="discount" label="Coupon" />
              <RHFCheckbox name="gst" label="GST" />
              <RHFCheckbox name="generalconfig" label="General Config" />
              <RHFCheckbox name="colorfamilies" label="Color Families" />
              {/* <RHFCheckbox name="offer" label="Offer" /> */}

            </Stack>
          </Card>
        </Grid>

        <Stack alignItems="flex-start" sx={{ p: 3 }} spacing={3}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting || designationIsLoading || updatedesignationIsLoading}
          >
            {isEdit ? 'Update Now' : 'Create Now'}
          </LoadingButton>
        </Stack>
      </Grid>
    </FormProvider>
  );
}
