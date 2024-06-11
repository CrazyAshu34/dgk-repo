/* eslint-disable */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Card, Dialog, DialogContent, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import FormProvider from '../../../../../components/hook-form';
import Iconify from '../../../../../components/iconify/Iconify';
import { useCreateProduct, useInputFieldsUpdateProductById,  } from '../../../../../services/productServices';
import AddImageFields from './AddImageFields';
import AddTextFields from './AddTextFields';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

InputFields.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
  setProductBasic: PropTypes.object,
  onChangeTab: PropTypes.object,
  productId: PropTypes.object,
};

export default function InputFields({ isEdit, currentProduct, setProductBasic, onChangeTab, productId }) {
  const navigate = useNavigate();

  const [openVariant, setOpenVariant] = useState(false);
  const [openVariantQuantity, setOpenVariantQuantity] = useState(false);

  const NewProductSchema = Yup.object().shape({
   // variants: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      inputTextFields: currentProduct?.inputFields?.inputTextFields || [],
      inputImageFields: currentProduct?.inputFields?.inputImageFields || [],
    }),
    [currentProduct]
  );
console.log("currentProduct===/",currentProduct);
  const methods = useForm(
    {
      resolver: yupResolver(NewProductSchema),
      defaultValues,
    },
    [defaultValues]
  );

  const {
    reset,
    watch,
    control,
    setValue,
    trigger,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();
  useEffect(() => {
    setValue("_id", productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);
  useEffect(() => {
    if(isEdit){
    setValue("inputFields.inputTextFields", currentProduct?.inputFields?.inputTextFields);
    setValue("inputFields.inputImageFields", currentProduct?.inputFields?.inputImageFields);
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);
  const { mutate: createProduct, isLoading: isCreatingProduct } = useCreateProduct();
  const { updateProductInputFields } = useInputFieldsUpdateProductById();
  const onSubmit = async (_data) => {
    console.log("update=",_data);
     await updateProductInputFields(_data,{
      onSuccess: (data) => {
        navigate(PATH_DASHBOARD.product.list); 
     },});
  };

  const leadVariantArray = values?.inputTextFields?.filter(
    (item) => item?.title.toLowerCase() === values?.leadVariant?.toLowerCase()
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} direction="row">
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, mb: 3 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Does it have Text as input fields
                </Typography>

                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={
                    <Iconify
                      icon={values?.inputFields?.inputTextFields?.length > 0 ? 'bx:bxs-edit' : 'bx:bxs-plus-circle'}
                      width={20}
                      height={20}
                    />
                  }
                  onClick={() => {
                    setOpenVariant(true);
                  }}
                >
                  {values?.inputFields?.inputTextFields?.length > 0 ? 'Edit' : 'Add'}
                </Button>
              </Stack>

              <Stack spacing={2}>
                {values?.inputFields?.inputTextFields?.map((item, index) => (
                  <Stack spacing={1} key={index}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      {item.title}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Dialog fullWidth maxWidth="sm" open={openVariant}>
                <DialogContent>
                  <AddTextFields
                    onClose={() => {
                      setOpenVariant(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </Card>

            <Card sx={{ p: 3, mb: 3 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Does it have Image as input fields
                </Typography>

                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={
                    <Iconify
                      icon={values?.inputFields?.inputImageFields?.length > 0 ? 'bx:bxs-edit' : 'bx:bxs-plus-circle'}
                      width={20}
                      height={20}
                    />
                  }
                  onClick={() => {
                    setOpenVariantQuantity(true);
                  }}
                >
                  {values?.inputFields?.inputImageFields?.length > 0 ? 'Edit' : 'Add'}
                </Button>
              </Stack>

              <Stack spacing={2}>
                {values?.inputFields?.inputImageFields?.map((item, index) => (
                  <Stack spacing={1} key={index}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      {item.title}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Dialog fullWidth maxWidth="sm" open={openVariantQuantity}>
                <DialogContent>
                  <AddImageFields
                    onClose={() => {
                      setOpenVariantQuantity(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </Card>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || isCreatingProduct}
                startIcon={<Iconify icon="bx:bxs-check-circle" />}
              >
                Submit
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
