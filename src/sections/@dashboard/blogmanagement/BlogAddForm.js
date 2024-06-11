import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Divider, Grid, MenuItem, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateBlog, useUpdateBlogById } from 'services/blogServices';
import * as Yup from 'yup';
import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar
} from '../../../components/hook-form';
import Iconify from '../../../components/iconify/Iconify';
import { PATH_DASHBOARD } from '../../../routes/paths';
import api from '../../../services/api';
import MoreData from './MoreData';

const header = {
  'Content-Type': 'multipart/form-data',
};

BlogAddForm.propTypes = {
  isEdit: PropTypes.bool,
  blogData: PropTypes.func,
};

export default function BlogAddForm({ isEdit = false, blogData }) {
  const navigate = useNavigate();
  const [blogFor, setBlogFor] = useState('');
  const [seoTagsOptions, setSeoTagsOptions] = useState([]);
  const [indexes, setIndexes] = useState([]);
  const [image, setImage] = useState('');

  const userId = localStorage.getItem('userId');

  const { createBlog, isLoading: notiIsLoading } = useCreateBlog();
  const { updateBlog, isLoading: updatenotiIsLoading } = useUpdateBlogById();

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    redirection_link: Yup.string().url('Youtube link must be a valid URL'),
    seoTitle: Yup.string(),
    seoMetaDescription: Yup.string(),
    seoSlug: Yup.string().required('Slug is required'),
    seoTags: Yup.array().default([process.env.REACT_APP_COMPANY_NAME]),
  });

  const defaultValues = useMemo(
    () => ({
      _id: blogData?._id || '',
      bannerType: blogData?.bannerType ? blogData?.bannerType : '',
      attachFile: blogData?.attachFile ? blogData?.attachFile : '',
      youtubeLink: blogData?.youtubeLink ? blogData?.youtubeLink : '',
      seoTitle: blogData?.seoTitle || '',
      seoMetaDescription: blogData?.seoMetaDescription || '',
      categoryName: blogData?.categoryName || '',
      seoTags: blogData?.seoTags || [process.env.REACT_APP_COMPANY_NAME],
      seoSlug: blogData?.seoSlug || '',
      title: blogData?.title ? blogData?.title : '',
      shortDescription: blogData?.shortDescription ? blogData?.shortDescription : '',
      redirection_noti: blogData?.redirection_noti || true,
      redirection_link: blogData?.redirection_link ? blogData?.redirection_link : '',
      descriptions: blogData?.descriptions ? blogData?.descriptions : [],
      postedBy: blogData?.postedBy ? blogData?.postedBy : '',

    }),
    [blogData]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    setValue,
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const uniqueSlugGenerator = (title = '') => {
    const slug = title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    return slug;
  };

  useEffect(() => {
    if (isEdit && blogData) {
      reset(defaultValues);
      setBlogFor(blogData?.bannerType);
      setValue('attachFile', blogData?.attachFile);
    }
  }, [isEdit, blogData, defaultValues]);

  useEffect(() => {
    if (values?.title !== '') {
      setValue('seoTitle', values?.title);
      setValue('seoMetaDescription', values?.title);
    }
  }, [values?.title]);

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      let formdata = new FormData();
      formdata.append('images', file);
      const response = await api.post('/image/upload', formdata, { headers: header });
      setValue('attachFile', response.data.images);
    },
    [setValue]
  );

  const onSubmit = async (data) => {
    console.log("okkkk");
    const arr1 = data?.descriptions;

    const arr2 = [...new Set(indexes)].map((itemY) => {
      return itemY;
    });
    let result = arr1.filter(
      (itemX) =>
        arr2.includes(itemX._id) &&
        (itemX?.noti_descriptions ||
          itemX?.images ||
          itemX?.attachment_link ||
          itemX?.multipleimages ||
          itemX?.youtubeLink ||
          itemX?.instagram_link ||
          itemX?.back_link ||
          itemX?.button_title ||
          itemX?.facebook_link ||
          itemX?.twitter_link)
    );

    try {
      const payload = {
        id: defaultValues?._id,
        attachFile: data?.attachFile,
        bannerType: blogFor,
        youtubeLink: data?.youtubeLink,
        descriptions: result,
        seoTitle: data?.seoTitle,
        seoMetaDescription: data?.seoMetaDescription,
        seoSlug: data?.seoSlug,
        seoTags: data?.seoTags,
        title: data?.title,
        shortDescription: data?.shortDescription,
        redirection_noti: data?.redirection_noti,
        redirection_link: data?.redirection_link,
        postedBy: data?.postedBy,
      };
      if (isEdit) {
        updateBlog(payload, {
          onSuccess: () => closeIt(),
        });
      } else {
        createBlog(payload, {
          onSuccess: () => closeIt(),
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const closeIt = () => {
    reset();
    navigate(PATH_DASHBOARD.blog.list);
  };

  useEffect(() => {
    if (!isEdit) {
      addFriend();
    }
  }, []);

  // useEffect(() => {
  //   blogData?.descriptions?.map((item, index) => {
  //     setIndexes((prevIndexes) => [...prevIndexes, index]);
  //   });
  // }, [blogData?.descriptions]);

  useEffect(() => {
    if (isEdit && blogData) {
      let nArr = [];
      blogData?.descriptions?.map((item, index) => {
        nArr.push(index);

      }); setIndexes(nArr);
    }
  }, [isEdit, blogData]);

  console.log(values, 'vals');

  const addFriend = () => {
    setIndexes((prevIndexes) => [...prevIndexes, [...new Set(indexes)]?.length]);
  };

  const removeFriend = (index) => () => {
    setIndexes((prevIndexes) => [...prevIndexes.filter((item) => item !== index)]);
    if (index >= 0 && index < values?.descriptions.length) {
      values?.descriptions.splice(index, 1);
    }
  };
  useEffect(() => {
    if (!isEdit && values?.title !== '') {
      setValue('seoSlug', uniqueSlugGenerator(values?.title));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.title]);
  console.log("valuesdesc=", values?.descriptions);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label="New Title" />
            </Stack>
          </Card>

          <Card sx={{ pl: 1, pb: 1, pr: 1, pt: 2, mt: 3 }}>
            <Stack spacing={3}>
              {[...new Set(indexes)]?.map((index) => {
                const fieldName = `descriptions[${index}]`;
                return (
                  <fieldset name={fieldName} key={fieldName} style={{ border: 'none' }}>
                    <div>
                      <MoreData
                        index={index}
                        fieldName={fieldName}
                        descriptions={blogData?.descriptions}
                        setValue={setValue}
                        values={values}
                        ref={register}
                      />
                    </div>
                    <Stack direction="row" spacing={1.5} sx={{ mt: 3 }} justifyContent="start">
                      <LoadingButton
                        type="button"
                        variant="contained"
                        size=""
                        onClick={removeFriend(index)}
                      >
                        Delete
                      </LoadingButton>
                    </Stack>
                  </fieldset>
                );
              })}
            </Stack>
          </Card>
          <Stack direction="row" spacing={1.5} sx={{ mt: 3, pl: 2 }} justifyContent="start">
            <LoadingButton type="button" variant="contained" size="" onClick={addFriend}>
              Add More
            </LoadingButton>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="postedBy" label="Posted By" />
            </Stack>
          </Card>
          <Card sx={{ p: 3, mt: 3 }}>
            <Stack spacing={3}>
              <RHFSelect
                name="bannerType"
                label="Select Banner Type"
                value={blogFor}
                onChange={(e) => setBlogFor(e.target.value)}
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
                <MenuItem
                  value="attachFile"
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                  }}
                >
                  Image
                </MenuItem>
                <MenuItem
                  value="youtubeLink"
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                  }}
                >
                  You Tube Link
                </MenuItem>
              </RHFSelect>
            </Stack>
          </Card>

          {blogFor === 'attachFile' ? (
            <Card sx={{ p: 3, mt: 3 }}>
              <Stack spacing={3}>
                <RHFUploadAvatar
                  name="attachFile"
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
                      <Box sx={{ mb: 0 }}>Attach Image</Box>
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                    </Typography>
                  }
                />
              </Stack>
            </Card>
          ) : null}

          {blogFor === 'youtubeLink' ? (
            <Card sx={{ p: 3, mt: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="youtubeLink" label="Youtube Link" />
              </Stack>
            </Card>
          ) : null}

          <Card sx={{ mb: 3, mt: 3, p: 2 }}>
            <Typography sx={{ p: 2 }}>SEO : Search Engine Optimization fields</Typography>
            <Stack spacing={3}>
              <RHFTextField name="seoTitle" label="Page Title" />

              <RHFTextField disabled={true} name="seoSlug" label="Slug" />
              <RHFTextField
                name="seoMetaDescription"
                label="Meta Description"
                multiline
                minRows={3}
                maxRows={8}
              />

              <RHFAutocomplete
                name="seoTags"
                size="large"
                placeholder="Add Tags (Press Enter to add)"
                multiple
                freeSolo
                fullWidth
                options={seoTagsOptions.map((option) => option)}
                ChipProps={{ size: 'large' }}
              />
            </Stack>
          </Card>

          <Stack spacing={2}>
            <LoadingButton
              variant="contained"
              size="large"
              startIcon={<Iconify icon="bx:bxs-check-circle" />}
              type="submit"
              loading={isSubmitting || notiIsLoading || updatenotiIsLoading}
            >
              {isEdit ? 'Update Now' : 'Post Now'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider >
  );
}
