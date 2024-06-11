import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import {
    useCreateCollection,
    useCreateCollectionUniqueSlug,
    useUpdateCollectionById,
} from '../../../services/collectionServices';

CollectionAddForm.propTypes = {
    isEdit: PropTypes.bool,
    collectionData: PropTypes.func,
};

export default function CollectionAddForm({ isEdit = false, collectionData }) {
    const navigate = useNavigate();

    const { createCollection, isLoading: categoryIsLoading } = useCreateCollection();
    const { updateCollection, isLoading: updatecategoryIsLoading } = useUpdateCollectionById();
    const { createCollectionSlug } = useCreateCollectionUniqueSlug();

    const NewCategorySchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        icon: Yup.mixed().test('required', 'Icon is required', (value) => value !== ''),
    });

    const defaultValues = useMemo(
        () => ({
            _id: collectionData?._id || '',
            name: collectionData?.name || '',
            icon: collectionData?.icon || '',
            slug: collectionData?.slug || '',
        }),
        [collectionData]
    );

    const methods = useForm({
        resolver: yupResolver(NewCategorySchema),
        defaultValues,
    });

    const {
        reset,
        setValue,
        handleSubmit,
        watch,
        formState: { isSubmitting },
    } = methods;
    useEffect(() => {
        if (isEdit && collectionData) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, collectionData]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                name: data?.name,
            };
            await createCollectionSlug(payload, {
                onSuccess: (response) => {
                    setValue('slug', response.data.data);
                    const formData = new FormData();
                    formData.set('id', defaultValues?._id);
                    formData.append('icon', data.icon);
                    formData.set('name', data.name);
                    if (isEdit) {
                        // if (data?.name?.toLowerCase() !== collectionData?.name?.toLowerCase()) {
                        //   formData.set('slug', response.data.data);
                        // } else {
                        formData.set('slug', collectionData?.slug);
                        // }
                    } else {
                        formData.set('slug', response.data.data);
                    }
                    if (isEdit) {
                        updateCollection(formData, {
                            onSuccess: () => closeIt(),
                        });
                    } else {
                        createCollection(formData, {
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
        navigate(PATH_DASHBOARD.collection.list);
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
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

                <Grid item xs={12} md={8}>
                    <Card sx={{ pl: 3, pr: 3, pt: 8, pb: 5 }}>
                        <Grid item xs={12} md={12} lg={12}>
                            <RHFTextField name="name" label="Collection Name" />
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
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
