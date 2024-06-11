import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Grid, Typography } from '@mui/material';
import LoadingScreen from 'components/loading-screen/LoadingScreen';
import BlankPage from 'pages/dashboard/BlankPage';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useGetAllTestimonials } from 'services/testimonialsServices';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { OderImageList } from './image';

const inputTitle = {
  0: 'First Text Field',
  1: 'Second Text Field',
  2: 'Third Text Field',
  3: 'Fourth Text Field',
  4: 'Fifth Text Field',
  5: 'Sixth Text Field',
  6: 'Seventh Text Field',
  7: 'Eighth Text Field',
  8: 'Nineth Text Field',
  9: 'Tenth Text Field',
  10: 'Eleventh Text Field',
  11: 'Twelveth Text Field',
  12: 'Thirteen Text Field',
  13: 'fourteen Text Field',
  14: 'fifteen Text Field',
  15: 'sixteen Text Field',
  16: 'seventeen Text Field',
};

OrderViewDetail.propTypes = {
  isEdit: PropTypes.bool,
  testimonialsData: PropTypes.func, inputFields: PropTypes.object
};

export default function OrderViewDetail({ isEdit = false, testimonialsData, inputFields }) {
  const {
    data,
    isLoading: testimonialsIsLoading,
    isError: testimonialsIsError,
  } = useGetAllTestimonials();

  const NewTestimonialsSchema = Yup.object().shape({});

  const defaultValues = useMemo(() => ({}), []);

  const methods = useForm({
    resolver: yupResolver(NewTestimonialsSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  if (testimonialsIsLoading) return <LoadingScreen />;

  if (testimonialsIsError) return <BlankPage />;

  console.log("inputFields===",inputFields)
  return (
    <FormProvider methods={methods}>
      <Typography variant="subtitle1" sx={{ color: '#7e8b97', mb: 1, pl: 4 }}>
        TEXT FIELDS :
      </Typography>

      <Card sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {inputFields?.inputTextFields?.map((item, index) => (
          <Grid item xs={6} md={4} key={index}>
            {console.log("map----",item)}
            
            <RHFTextField simple name="test_comment" label={item.title} value={item.value} multiline />
          </Grid>
          ))}

           
        </Grid>
      </Card>

      <Typography variant="subtitle1" sx={{ color: '#7e8b97', pl: 4, mt: 4, mb: 2 }}>
        IMAGE FIELDS :
      </Typography>

      <OderImageList products={data} inputImageFields={inputFields?.inputImageFields} />
    </FormProvider>
  );
}
