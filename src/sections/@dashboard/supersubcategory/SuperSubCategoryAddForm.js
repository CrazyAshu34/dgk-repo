import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateCategoryUniqueSlug } from 'services/categoryServices';
import * as Yup from 'yup';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useGetAllSubCategories } from '../../../services/subCategoryServices';
import {
  useCreateSuperSubCategories,
  useUpdateSuperSubCategoriesById,
} from '../../../services/superSubCategoryServices';

SuperSubCategoryAddForm.propTypes = {
  isEdit: PropTypes.bool,
  superSubCategoryData: PropTypes.func,
};

export default function SuperSubCategoryAddForm({ isEdit = false, superSubCategoryData }) {
  const navigate = useNavigate();

  const { createSuperSubCategories, isLoading: SuperSubCategoryIsLoading } =
    useCreateSuperSubCategories();
  const { updateSuperSubCategories, isLoading: updateSuperSubCategoryIsLoading } =
    useUpdateSuperSubCategoriesById();
  const { data: subcategorys } = useGetAllSubCategories();
  const { createCategorySlug } = useCreateCategoryUniqueSlug();

  const NewSuperSubCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    subcategory: Yup.string().required('Category is required'),
    icon: Yup.mixed().test('required', 'Icon is required', (value) => value !== ''),
  });
  console.log("superSubCategoryData=", superSubCategoryData);
  const defaultValues = useMemo(
    () => ({
      _id: superSubCategoryData?._id || '',
      name: superSubCategoryData?.name || '',
      subcategory: superSubCategoryData?.subcategoryId || '',
      icon: superSubCategoryData?.icon || '',
    }),
    [superSubCategoryData]
  );

  const methods = useForm({
    resolver: yupResolver(NewSuperSubCategorySchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && superSubCategoryData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, superSubCategoryData]);

  const onSubmit = async (data) => {
    const subcatArr = subcategorys.find((p) => p._id === data.subcategory);
    const dataArr = subcategorys.find((x) => x._id === data.subcategory);
    try {
      const payload = {
        name: data?.name,
      };
      await createCategorySlug(payload, {
        onSuccess: (response) => {
          setValue('slug', response.data.data);
          const formData = new FormData();
          formData.set('id', superSubCategoryData?._id);
          if (data.icon?.path) {
            formData.append('icon', data.icon);
          } else {
            formData.set('icon', data.icon);
          }
          formData.set('subcategory', subcatArr.name);
          formData.set('subcategoryId', data.subcategory);
          formData.set('name', data.name);
          formData.set('categoryId', dataArr.categoryId);
          if (isEdit) {
            // if (data?.name?.toLowerCase() !== superSubCategoryData?.name.toLowerCase()) {
            //   formData.set('slug', response.data.data);
            // } else {
            formData.set('slug', superSubCategoryData?.slug);
            // }
          } else {
            formData.set('slug', response.data.data);
          }

          if (isEdit) {
            updateSuperSubCategories(formData, {
              onSuccess: () => closeIt(),
            });
          } else {
            createSuperSubCategories(formData, {
              onSuccess: () => closeIt(),
            });
          }
        },
        onError: (error) => {
          console.log(error);
        },
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
    navigate(PATH_DASHBOARD.supersubcategory.list);
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

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <RHFSelect
                  native
                  name="subcategory"
                  label="Select Sub Category"
                  placeholder="Select Sub Category"
                >
                  <option value="" selected>
                    Select Sub Category
                  </option>
                  {subcategorys
                    ?.filter((item) => item?.name !== 'Other')
                    ?.map((option, index) => (
                      <option key={index} value={option._id}>
                        {option.name} {`(${option.category})`}
                      </option>
                    ))}
                </RHFSelect>
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <RHFTextField name="name" label="Super Sub Category" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={
                  isSubmitting || SuperSubCategoryIsLoading || updateSuperSubCategoryIsLoading
                }
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
