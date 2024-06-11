/* eslint-disable consistent-return */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useCreateProductImageUrl } from 'services/productServices';
import FormProvider, {
  RHFAutocomplete,
  RHFEditor,
  RHFTextField,
  RHFUpload,
} from '../../../components/hook-form';
import Iconify from '../../../components/iconify/Iconify';
import { PATH_DASHBOARD } from '../../../routes/paths';
import {
  useCreateProject,
  useUpdateProjectById,
  useCreateProjectUniqueSlug,
} from '../../../services/projectServices';

ProjectAddForm.propTypes = {
  isEdit: PropTypes.bool,
  projectData: PropTypes.func,
};

export default function ProjectAddForm({ isEdit = false, projectData }) {
  const navigate = useNavigate();
  const { createProject, isLoading: blogIsLoading } = useCreateProject();
  const { updateProject, isLoading: updateBlogIsLoading } = useUpdateProjectById();
  const { mutate: createImageUrl } = useCreateProductImageUrl();
  const { generateUniqueSlug } = useCreateProjectUniqueSlug();
  const NewBlogSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').matches("^[a-zA-Z0-9\\-\\s]+$", 'Insert only normal character'),
    city: Yup.string().required('City is required'),
    details: Yup.string().required('Description is required'),
    cover_image: Yup.mixed().test('required', 'Cover Image is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      _id: projectData?._id || '',
      name: projectData?.name || '',
      slug: projectData?.slug || '',
      city: projectData?.city || '',
      details: projectData?.details || '',
      cover_image: projectData?.cover_image || '',
    }),
    [projectData]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const values = watch();

  useEffect(() => {
    if (isEdit && projectData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, projectData]);

  const createUniqueSlugFromBackend = async (title = '') => {
    const payload = {
      title,
    };
    await generateUniqueSlug(payload, {
      onSuccess: (data) => {
        setValue('slug', data.data.data);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  useEffect(() => {
    if (values?.name !== '') {
      const slugTimer = setTimeout(() => {
        if (!isEdit) {
          createUniqueSlugFromBackend(values?.name);
        } else if (values?.name !== projectData?.name) {
          createUniqueSlugFromBackend(values?.name);
        }
      }, 1000);
      return () => {
        clearTimeout(slugTimer);
      };
    }
  }, [values?.name, isEdit, projectData]);

  const onSubmit = async (data) => {
    console.log('data', data);
    try {
      const formData = {
        _id: defaultValues?._id,
        name: data?.name,
        cover_image: data?.cover_image,
        city: data?.city,
        details: data?.details,
        slug:
          // eslint-disable-next-line no-nested-ternary
          isEdit
            ? values?.name !== projectData?.name
              ? values?.slug
              : projectData?.slug
            : values?.slug,
      };
      if (isEdit) {
        updateProject(formData, {
          onSuccess: () => closeIt(),
        });
      } else {
        createProject(formData, {
          onSuccess: () => closeIt(),
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const formData = new FormData();
      const file = acceptedFiles[0];
      formData.append('productPictures', file);
      createImageUrl(formData, {
        onSuccess: (imageData) => {
          setValue('cover_image', imageData.data.images[0]?.location);
        },
      });
      // if (file) {
      //   setValue(
      //     'cover_image',
      //     Object.assign(file, {
      //       preview: URL.createObjectURL(file),
      //     })
      //   );
      // }
    },
    [setValue]
  );

  const closeIt = () => {
    reset();
    navigate(PATH_DASHBOARD.project.list);
  };

  const uniqueSlugGenerator = (title = '') => {
    const slug = title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    return slug;
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <RHFTextField name="name" label="Name" />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <RHFTextField name="city" label="City" />
              </Grid>

              <Grid item xs={12} md={12}>
                <RHFTextField multiline rows="5" name="details" label="Details" />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Cover Image
                </Typography>

                <RHFUpload
                  name="cover_image"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                />
              </Grid>

              {/* <Grid item xs={12} md={12}>
                <div>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Description
                  </Typography>
                  <RHFEditor name="blog_description" />
                </div>
              </Grid> */}

              <Card sx={{ p: 3 }}>
                <Stack alignItems="flex-end">
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting || blogIsLoading || updateBlogIsLoading}
                  >
                    {isEdit ? 'Update Now' : 'Post Now'}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
