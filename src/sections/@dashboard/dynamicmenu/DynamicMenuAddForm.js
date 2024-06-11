import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import {
    useCreateDynamicMenu, useUpdateDynamicMenuById
   
  } from '../../../services/dynamicMenuServices';


DynamicMenuAddForm.propTypes = {
  isEdit: PropTypes.bool,
  dynamicmenuData: PropTypes.object,
};

export default function DynamicMenuAddForm({ isEdit = false, dynamicmenuData }) {
  const navigate = useNavigate();

  const { createDynamicMenu, isLoading: DynamicMenuIsLoading } = useCreateDynamicMenu();
  const { updateDynamicMenu, isLoading: updateSubCategoriesIsLoading } =
    useUpdateDynamicMenuById();
  

  const NewSubCategorySchema = Yup.object().shape({
    menu_name: Yup.string().required('Menu Name is required'),
    link: Yup.string().required('Link is required'),
    icon: Yup.mixed().test('required', 'Icon is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      _id: dynamicmenuData?._id || '',
      menu_name: dynamicmenuData?.menu_name || '',
      icon: dynamicmenuData?.icon || '',
      link: dynamicmenuData?.link || '',
      menu_type: dynamicmenuData?.menu_type || 'For Staff',
    }),
    [dynamicmenuData]
  );

  const methods = useForm({
    resolver: yupResolver(NewSubCategorySchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;
  const values = watch();
  useEffect(() => {
    if (isEdit && dynamicmenuData) {
      reset(defaultValues);
     
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, dynamicmenuData]);

  const onSubmit = async (data) => {
    
    try { 
          const formData = new FormData();
          formData.set('id', defaultValues?._id);
          if (data.icon?.path) {
            formData.append('icon', data.icon);
          } else {
            formData.set('icon', data.icon);
          }
          formData.set('menu_name', data.menu_name);
          formData.set('menu_type', data.menu_type);
          formData.set('link', data.link);
           
          if (isEdit) {
            updateDynamicMenu(formData, {
              onSuccess: () => closeIt(),
            });
          } else {
            createDynamicMenu(formData, {
              onSuccess: () => closeIt(),
            });
          }
        
    
    } catch (error) {
      console.error('error', error);
    }
  }; 
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'icon',
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
    navigate(PATH_DASHBOARD.dynamicmenu.list);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <RHFUploadAvatar
              name="icon"
              accept="image/*"
              maxSize={3145728}
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
                  <Box sx={{ mb: 0 }}>Icon</Box>
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
                <RHFTextField name="menu_name" label="Menu Name" />
            </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <RHFSelect
                  native
                  name="menu_type"
                  label="Menu Type"
                  placeholder="Menu Type"
                > 
                  <option  value="For Admin" > For Admin</option>
                  <option  value="For Staff" selected> For Staff</option>
                </RHFSelect>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <RHFTextField name="link" label="Link" />
            </Grid>
              
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || DynamicMenuIsLoading || updateSubCategoriesIsLoading}
              >
                {isEdit ? 'Update' : 'Add Now'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
