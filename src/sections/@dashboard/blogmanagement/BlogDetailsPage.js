import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormProvider, { RHFEditor, RHFTextField } from '../../../components/hook-form';
import Image from '../../../components/image';

BlogDetailsPage.propTypes = {
  id: PropTypes.object,
  blogData: PropTypes.func,
};

export default function BlogDetailsPage({ blogData, id }) {
  const {
    blog_title,
    blog_image,
    blog_posteddate,
    blog_description,
    blog_category,
    blog_highlight,
    blog_postedby,
    blog_seodesc,
    blog_seotitle,
    blog_keyword,
  } = blogData;

  const NewBlogSchema = Yup.object().shape({});

  const defaultValues = {
    blog_title: blog_title || '',
    blog_image: blog_image || '',
    blog_description: blog_description || '',
    blog_category: blog_category || '',
    blog_highlight: blog_highlight || '',
    blog_postedby: blog_postedby || '',
    blog_seodesc: blog_seodesc || '',
    blog_seotitle: blog_seotitle || '',
    blog_keyword: blog_keyword || '',
    blog_posteddate: blog_posteddate || '',
  };

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 5, px: 3 }}>
            <Image
              alt="register"
              src={blogData?.blog_image}
              fill
              sx={{ borderRadius: '16px', objectFit: 'cover' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={6}>
                <RHFTextField name="blog_title" label="Title" inputProps={{ readOnly: true }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="blog_postedby"
                  label="Posted By"
                  inputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <div>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Description
                  </Typography>

                  <RHFEditor simple name="blog_description" inputProps={{ readOnly: true }} />
                </div>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
