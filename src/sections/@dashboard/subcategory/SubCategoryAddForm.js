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
  useCreateCategoryUniqueSlug,
  useGetAllCategories,
} from '../../../services/categoryServices';
import {
  useCreateSubCategories,
  useUpdateSubCategoriesById,
} from '../../../services/subCategoryServices';

SubCategoryAddForm.propTypes = {
  isEdit: PropTypes.bool,
  subCategoryData: PropTypes.object,
};

export default function SubCategoryAddForm({ isEdit = false, subCategoryData }) {
  const navigate = useNavigate();

  const { createSubCategories, isLoading: SubCategoriesIsLoading } = useCreateSubCategories();
  const { updateSubCategories, isLoading: updateSubCategoriesIsLoading } =
    useUpdateSubCategoriesById();
  const { data: categorys } = useGetAllCategories();
  const { createCategorySlug } = useCreateCategoryUniqueSlug();

  const NewSubCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    category: Yup.string().required('Category is required'),
    icon: Yup.mixed().test('required', 'Icon is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      _id: subCategoryData?._id || '',
      name: subCategoryData?.name || '',
      icon: subCategoryData?.icon || '',
      categoryId: subCategoryData?.categoryId || '',
    }),
    [subCategoryData]
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
    if (isEdit && subCategoryData) {
      reset(defaultValues);
      setValue('category', subCategoryData?.categoryId);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, subCategoryData]);

  const onSubmit = async (data) => {
    const catArr = categorys.find((p) => p._id === data.category);
    try {
      const payload = {
        name: data?.name,
      };
      await createCategorySlug(payload, {
        onSuccess: (response) => {
          setValue('slug', response.data.data);
          const formData = new FormData();
          formData.set('id', defaultValues?._id);
          if (data.icon?.path) {
            formData.append('icon', data.icon);
          } else {
            formData.set('icon', data.icon);
          }
          formData.set('category', catArr.name);
          formData.set('categoryId', data.category);
          formData.set('name', data.name);
          if (isEdit) {
            // if (data?.name?.toLowerCase() !== subCategoryData?.name?.toLowerCase()) {
            //   formData.set('slug', response.data.data);
            // } else {
            formData.set('slug', subCategoryData?.slug);
            // }
          } else {
            formData.set('slug', response.data.data);
          }
          if (isEdit) {
            updateSubCategories(formData, {
              onSuccess: () => closeIt(),
            });
          } else {
            createSubCategories(formData, {
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
  console.log('okk', subCategoryData, values);
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
    navigate(PATH_DASHBOARD.subcategory.list);
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
                <RHFSelect
                  native
                  name="category"
                  label="Select Category"
                  placeholder="Select Category"
                >
                  <option value="" selected>
                    Select Category
                  </option>
                  {categorys
                    ?.filter((item) => item?._id !== 'Other')
                    ?.map((option, index) => (
                      <option key={index} value={option._id}>
                        {option.name}
                      </option>
                    ))}
                </RHFSelect>
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <RHFTextField name="name" label="Sub Category Name" />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || SubCategoriesIsLoading || updateSubCategoriesIsLoading}
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
