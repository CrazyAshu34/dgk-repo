import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useCreateColorFamilies, useUpdateColorFamiliById } from '../../../services/colorfamiliesServices';
import ColorPicker from './ColorPicker';

ColorFamiliesAddForm.propTypes = {
    isEdit: PropTypes.bool,
    colorData: PropTypes.func,
};

export default function ColorFamiliesAddForm({ isEdit = false, colorData }) {
    const navigate = useNavigate();

    const { createColorFamili, isLoading: ColorFamiliesIsLoading } = useCreateColorFamilies();
    const { UpdateColorFamili, isLoading: updateColorFamiliesIsLoading } = useUpdateColorFamiliById();
    const [hexaColorCode, setHexaColorCode] = useState('#FFFFFF');
    const NewDiscountSchema = Yup.object().shape({
        colorName: Yup.string().required('Color Name is required'),
        // hexaColor: Yup.string().required('Hexa Color is required'),
    });

    const defaultValues = useMemo(
        () => ({
            _id: colorData?._id || '',
            colorName: colorData?.colorName || '',
            hexaColor: colorData?.hexaColor || '',

        }),
        [colorData]
    );

    const methods = useForm({
        resolver: yupResolver(NewDiscountSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (isEdit && colorData) {
            setHexaColorCode(colorData?.hexaColor);
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, colorData]);
    const handleColorChange = (color) => {
        setHexaColorCode(color);
        console.log('Selected color:', color);
    };
    const onSubmit = async (_data) => {
        console.log('_data', _data);
        try {
            const payload = {
                id: defaultValues?._id,
                colorName: _data?.colorName,
                hexaColor: hexaColorCode,
            };
            if (isEdit) {
                UpdateColorFamili(payload, {
                    onSuccess: () => closeIt(),
                });
            } else {
                createColorFamili(payload, {
                    onSuccess: () => closeIt(),
                });
            }
        } catch (error) {
            console.error('error', error);
        }
    };

    const closeIt = () => {
        reset();
        navigate(PATH_DASHBOARD.colorfamilies.list);
    };


    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6} lg={6}><small>Color Name</small></Grid> <Grid item xs={12} md={6} lg={6}><small>Pick a Color</small></Grid>
                            <Grid item xs={12} md={6} lg={6} style={{ paddingTop: '0px' }}>
                                <RHFTextField name="colorName" />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6} style={{ paddingTop: '0px' }}>
                                {/* <RHFTextField name="hexaColor" label="Hexa Color" /> */}

                                <ColorPicker hexaColorCode={hexaColorCode} onChange={handleColorChange} />

                            </Grid>


                        </Grid>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting || ColorFamiliesIsLoading || updateColorFamiliesIsLoading}
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
