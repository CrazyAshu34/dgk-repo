import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormProvider, { RHFSwitch, RHFTextField } from '../../../components/hook-form';
import { useUpdateGeneralConfigById } from '../../../services/generalconfigServices';

ConfigEditForm.propTypes = {
  generalConfigData: PropTypes.func,
};

export default function ConfigEditForm({ generalConfigData }) {
  const [gstCheck, setGstCheck] = useState(false);
  const [gstVal, setGstVal] = useState('');

  const queryClient = useQueryClient();
  const { updateGeneralConfig, isLoading: ConfigIsLoading } = useUpdateGeneralConfigById();

  const NewConfigSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      _id: generalConfigData?._id || '',
      gst: generalConfigData?.gst || '',
      show_gst: generalConfigData?.show_gst || false,
      allowReview: generalConfigData?.allowReview || false,
      allowCostPriceManagement: generalConfigData?.allowCostPriceManagement || false,
      allowStockManagement: generalConfigData?.allowStockManagement || false,
    }),
    [generalConfigData]
  );

  const methods = useForm({
    resolver: yupResolver(NewConfigSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (generalConfigData) {
      reset(defaultValues);
      setGstCheck(generalConfigData.show_gst);
      setGstVal(generalConfigData.gst);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generalConfigData]);

  const onSubmit = async (_data) => {
    try {
      const payload = {
        id: defaultValues?._id,
        allowReview: _data?.allowReview,
        allowCostPriceManagement: _data?.allowCostPriceManagement,
        allowStockManagement: _data?.allowStockManagement,
      };
      updateGeneralConfig(payload, {
        onSuccess: () => queryClient.invalidateQueries(['_getGetAllGeneralConfig']),
      });
    } catch (error) {
      console.error('error', error);
    }
  };
 

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <div>
                <RHFSwitch
                  name="allowStockManagement"
                  label="Onlink Stock Management"
                  labelPlacement="start"
                  sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                />

                <RHFSwitch
                  name="allowCostPriceManagement"
                  label="Cost Price And Margins Management"
                  labelPlacement="start"
                  sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                />
                <RHFSwitch
                  name="allowReview"
                  label="Allow Product Review"
                  labelPlacement="start"
                  sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                />
              </div>
            </Stack>
            <Stack alignItems="flex-end" sx={{ mt: 4, mb: 1 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || ConfigIsLoading}
              >
                Update
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
