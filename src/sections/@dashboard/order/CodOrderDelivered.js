import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Grid, MenuItem, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateOrderStatusById } from 'services/orderServices';
import * as Yup from 'yup';
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';

CodOrderDelivered.propTypes = {
    orderId: PropTypes.string,

    handleClose: PropTypes.func,
};

export default function CodOrderDelivered({ orderId, handleClose }) {

    const userId = localStorage.getItem('userId');
    const [paymentMethod, setPaymentMethod] = useState('');
    const queryClient = useQueryClient();
    const NewUserSchema = Yup.object().shape({
        paymentMethod: Yup.string().required('Payment Method is required'),
        paymentId: Yup.string().required('Reference ID is required'),
    });
    const { updateOrderStatus, isLoading: updateOrderIsLoading } = useUpdateOrderStatusById();

    const defaultValues = {
        paymentMethod: '',
    };

    const methods = useForm({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    const values = watch();

    useEffect(() => {
        setPaymentMethod(values?.paymentMethod);
    }, [values?.paymentMethod])


    const onSubmit = async (data) => {
        try {
            const payload = {
                // eslint-disable-next-line object-shorthand
                orderId: orderId,
                paymentMethod: data?.paymentMethod,
                paymentId: data?.paymentId,
                orderStatus: "DELIVERED",
                // eslint-disable-next-line object-shorthand
                userId: userId,
                updateStatus: "",
            };

            console.log("payloadObj=", payload);
            updateOrderStatus(payload, {
                onSuccess: () => queryClient.invalidateQueries(['_getAllOrders']),
            });
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Box >
                        <Grid container spacing={3}>

                            <Grid item xs={12} md={12} lg={12}>
                                <RHFSelect
                                    name="paymentMethod"
                                    label="Payment Method"
                                    size="large"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                >

                                    <MenuItem value="UPI"> UPI</MenuItem>
                                    <MenuItem value="DIRECT_BANK_TRANSFER"> DIRECT_BANK_TRANSFER</MenuItem>
                                </RHFSelect>
                            </Grid>
                            { // paymentMethod==="UPI" || paymentMethod==="DIRECT_BANK_TRANSFER"?
                                <Grid item xs={12} md={12} lg={12}>
                                    <RHFTextField
                                        name="paymentId"
                                        label="Reference ID"
                                    />
                                </Grid>
                                // :null
                            }
                            <Grid item xs={12} md={12} lg={12}>
                                <Stack direction="row" style={{ padding: '30px' }} justifyContent="end">
                                    <LoadingButton
                                        type="submit"
                                        variant="contained"
                                        size=""
                                        loading={isSubmitting}
                                    >
                                        Submit
                                    </LoadingButton>
                                    {/* <Button variant="outlined" style={{ marginLeft: '10px' }} color="inherit" onClick={onCancel}>
                                        Cancel
                                    </Button> */}

                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>

                </Grid>
            </Grid>
        </FormProvider>
    );
}
