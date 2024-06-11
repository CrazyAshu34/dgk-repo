import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateProductImageUrl, useDeleteProductImageById } from 'services/productServices';
import * as Yup from 'yup';
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { Upload } from '../../../components/upload';
import { PATH_DASHBOARD } from '../../../routes/paths';
import {
  useCreateCategory,
  useCreateCategoryUniqueSlug,
  useUpdateCategoryById,
} from '../../../services/categoryServices';

CategoryAddForm.propTypes = {
  isEdit: PropTypes.bool,
  categoryData: PropTypes.func,
};

export default function CategoryAddForm({ isEdit = false, categoryData }) {
  const navigate = useNavigate();

  const { createCategory, isLoading: categoryIsLoading } = useCreateCategory();
  const { updateCategory, isLoading: updatecategoryIsLoading } = useUpdateCategoryById();
  const { createCategorySlug } = useCreateCategoryUniqueSlug();
  const { mutate: createImageUrl } = useCreateProductImageUrl();
  const { deletedata } = useDeleteProductImageById();

  const NewCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    icon: Yup.mixed().test('required', 'Icon is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      _id: categoryData?._id || '',
      name: categoryData?.name || '',
      icon: categoryData?.icon || '',
      slug: categoryData?.slug || '',
      bannerImages: categoryData?.bannerImages || [],
    }),
    [categoryData]
  );
  const { trigger } = useForm();
  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting }, control,
  } = methods;
  const values = watch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bannerImages',
  });
  useEffect(() => {
    if (isEdit && categoryData) {
      reset(defaultValues);
      setValue('bannerImages', categoryData?.bannerImages);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, categoryData]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data?.name,
      };
      await createCategorySlug(payload, {
        onSuccess: (response) => {
          setValue('slug', response.data.data);
          const formData = new FormData();
          formData.set('id', defaultValues?._id);
          formData.append('icon', data.icon);
          formData.append('bannerImages', JSON.stringify(data.bannerImages));
          formData.set('name', data.name);
          if (isEdit) {
            // if (data?.name?.toLowerCase() !== categoryData?.name?.toLowerCase()) {
            //   formData.set('slug', response.data.data);
            // } else {
            formData.set('slug', categoryData?.slug);
            // }
          } else {
            formData.set('slug', response.data.data);
          }
          if (isEdit) {
            updateCategory(formData, {
              onSuccess: () => closeIt(),
            });
          } else {
            createCategory(formData, {
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
    navigate(PATH_DASHBOARD.category.list);
  };

  const handleBannerDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const formData = new FormData();
      newFiles.forEach((file) => {

        formData.append('productPictures', file);
      });

      createImageUrl(formData, {
        onSuccess: (imageData) => {
          trigger('bannerImages');
          console.log("formData=", imageData?.data?.images);
          handleSetValue(imageData?.data?.images);
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const handleSetValue = (allS3Images) => {
    const requiredData = allS3Images.map((image) => {
      return image?.key.split("/")[1];
    });
    trigger();

    append(requiredData);
  };

  const handleUpload = (imageName) => {
    // const formData = new FormData();
    // files.forEach((file) => {
    //   formData.append('productPictures', file);
    // });

    // createImageUrl(formData, {
    //   onSuccess: (imgUrl) => {
    //     console.log('IMAGES', imgUrl);
    //     const newImages = [
    //       {
    //         title: imageName,
    //         values: imgUrl?.data?.images,
    //       },
    //     ];
    //     append(newImages);
    //     setValue('bannerImages', newImages);
    //   },
    // });
  };

  const handleRemoveFile = (keyValue) => {
    const newImages = values?.bannerImages;
    // remove the image from the array  whose id is equal to the keyValue
    const filteredImages = newImages?.filter((image) => image !== keyValue);
    // set other tag value as it is and update the current tag value 
    setValue('bannerImages', filteredImages);

    // deletedata(keyValue);
  };
  const handleRemoveAllFiles = (keyValue) => {
    const newImages = values?.bannerImages?.filter((image) => image?.title !== keyValue);
    setValue('bannerImages', newImages);
  };
  console.log("bannerImages=", values.bannerImages);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>


        <Grid item xs={12} md={8}>
          <Card sx={{ pl: 3, pr: 3, pt: 8, pb: 5 }}>
            <Stack spacing={2}>
              <Grid item xs={12} md={12} lg={12}>
                <RHFTextField name="name" label="Category Name" />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>

                <Upload
                  multiple
                  imgArr
                  thumbnail
                  files={values.bannerImages || []}
                  onDrop={handleBannerDrop}
                  onRemove={handleRemoveFile}
                  onRemoveAll={() => handleRemoveAllFiles()}
                  onUpload={() => {
                    handleUpload();
                  }}
                  placeholder={
                    <>
                      Upload Banner Images
                    </>
                  }
                />
              </Grid>
              <Stack alignItems="flex-end" sx={{ mt: 4, mb: 1 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting || categoryIsLoading || updatecategoryIsLoading}
                >
                  {isEdit ? 'Update' : 'Add Now'}
                </LoadingButton>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <RHFUploadAvatar
              name="icon"
              // maxSize={3145728}
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
                  <Box sx={{ mb: 0 }}>Icon</Box>
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                </Typography>
              }
            />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
