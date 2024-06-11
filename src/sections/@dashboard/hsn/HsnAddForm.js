import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useCreateHsn, useUpdateHsnById } from '../../../services/hsnServices';

HsnAddForm.propTypes = {
    isEdit: PropTypes.bool,
    hsnData: PropTypes.object,
};

export default function HsnAddForm({ isEdit = false, hsnData }) {
    const navigate = useNavigate();
    const { createHsn, isLoading: HsnIsLoading } = useCreateHsn();
    const { UpdateHsn, isLoading: updateHsnIsLoading } = useUpdateHsnById();

    const NewGstSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        hsnCode: Yup.string().required('HSN Code is required'),
    });

    const defaultValues = useMemo(
        () => ({
            _id: hsnData?._id || '',
            title: hsnData?.title || '',
            hsnCode: hsnData?.hsnCode || '',
        }),
        [hsnData]
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
        if (isEdit && hsnData) {
            reset(defaultValues);
            setValue('_id', hsnData?._id);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, hsnData]);

    const onSubmit = async (_data) => {
        console.log('_data', _data);
        try {

            if (isEdit) {
                UpdateHsn(_data, {
                    onSuccess: () => closeIt(),
                });
            } else {
                createHsn(_data, {
                    onSuccess: () => closeIt(),
                });
            }
        } catch (error) {
            console.error('error', error);
        }
    };

    const closeIt = () => {
        reset();
        navigate(PATH_DASHBOARD.hsn.list);
    };



    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} lg={12}>
                                <RHFTextField name="title" label="Title" />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <RHFTextField name="hsnCode" label="HSN Code" />
                            </Grid>
                        </Grid>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting || HsnIsLoading || updateHsnIsLoading}
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
