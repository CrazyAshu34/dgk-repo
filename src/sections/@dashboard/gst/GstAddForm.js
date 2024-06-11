import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, InputAdornment, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useCreateGst, useUpdateGstById } from '../../../services/gstServices';

GstAddForm.propTypes = {
    isEdit: PropTypes.bool,
    gstData: PropTypes.func,
};

export default function GstAddForm({ isEdit = false, gstData }) {
    const navigate = useNavigate();
    console.log("gstData==", gstData);
    const { createGst, isLoading: GstIsLoading } = useCreateGst();
    const { UpdateGst, isLoading: updateGstIsLoading } = useUpdateGstById();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const NewGstSchema = Yup.object().shape({
        name: Yup.string().required('GST Name is required'),
        sgst: Yup.number().required('SGST is required'),
        igst: Yup.number().required('IGST is required'),
    });

    const defaultValues = useMemo(
        () => ({
            _id: gstData?._id || '',
            name: gstData?.name || '',
            sgst: gstData?.sgst || '',
            igst: gstData?.igst || '',
            totalGst: gstData?.totalGst || '',

        }),
        [gstData]
    );

    const methods = useForm({
        resolver: yupResolver(NewGstSchema),
        defaultValues,
    });

    const {
        reset, watch,
        handleSubmit, setValue,
        formState: { isSubmitting },
    } = methods;
    const values = watch();
    useEffect(() => {
        if (isEdit && gstData) {
            reset(defaultValues);
            setValue('_id', gstData?._id);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, gstData]);

    useEffect(() => {
        if (values?.igst >= 0 && values?.sgst >= 0) {
            console.log("pookkk");
            // eslint-disable-next-line no-unsafe-optional-chaining 
            const totgst = parseFloat(values?.igst, 10) + parseFloat(values?.sgst, 10);

            if (Number.isNaN(totgst)) {
                setValue('totalGst', "0")
            } else {
                setValue('totalGst', totgst)
            }

        }
    }, [values?.igst, values?.sgst, setValue]);
    console.log("values?.igst", values?.igst, "values?.sgst", values?.sgst)
    const onSubmit = async (_data) => {
        console.log('_data', _data);
        try {

            if (isEdit) {
                UpdateGst(_data, {
                    onSuccess: () => closeIt(),
                });
            } else {
                createGst(_data, {
                    onSuccess: () => closeIt(),
                });
            }
        } catch (error) {
            console.error('error', error);
        }
    };

    const closeIt = () => {
        reset();
        navigate(PATH_DASHBOARD.gst.list);
    };

    const StartDateChange = (newValue) => {
        setStartDate(newValue);
    };

    const EndDateChange = (newValue) => {
        setEndDate(newValue);
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} lg={12}>
                                <RHFTextField name="name" label="GST Name" />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <RHFTextField
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                %
                                            </InputAdornment>
                                        ),
                                    }}
                                    name="sgst"
                                    label="SGST"
                                    type="number"
                                // onInput={(e) => {
                                //     allowOnlyNumbers(e);
                                //     e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                // }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <RHFTextField
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                %
                                            </InputAdornment>
                                        ),
                                    }}
                                    name="igst"
                                    label="CGST"
                                    type="number"
                                // onInput={(e) => {
                                //     allowOnlyNumbers(e);
                                //     e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                // }}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                    Total GST
                                </Typography>
                                <RHFTextField inputProps={{ readOnly: true }} name="totalGst" label="" />
                            </Grid>
                        </Grid>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting || GstIsLoading || updateGstIsLoading}
                            >
                                {isEdit ? 'Update Now' : 'Add Now'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
