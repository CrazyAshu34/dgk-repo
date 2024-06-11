import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Grid, MenuItem, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCancelOrderById } from 'services/orderServices';
import * as Yup from 'yup';
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';

OrderCancelReason.propTypes = {
    orderId: PropTypes.string,
    orderMode: PropTypes.string,
    handleClose: PropTypes.func,
};

export default function OrderCancelReason({ orderId, orderMode, handleClose }) {

    const userId = localStorage.getItem('userId');
    const [refundMethod, setRefundMethod] = useState('');
    useEffect(() => {
        setValue('orderMode', orderMode);
    }, [orderMode])
    const NewUserSchema = Yup.object().shape({
        cancellationReason: Yup.string().required('Cancellation Reason is required'),
        refundMethod: Yup.string().when('orderMode', {
            is: 'ONLINE',
            then: () => Yup.string().required('Refund Method is required'),
        }),

        upiId: Yup.string().when('refundMethod', {
            is: 'UPI',
            then: () => Yup.string().required('UPI ID is required'),
        }),
        upiName: Yup.string().when('refundMethod', {
            is: 'UPI',
            then: () => Yup.string().required('UPI Name is required'),
        }),


        accountNumber: Yup.string().when('refundMethod', {
            is: 'DIRECT_BANK_TRANSFER',
            then: () => Yup.string().required('Account Number is required'),
        }),
        accountHolderName: Yup.string().when('refundMethod', {
            is: 'DIRECT_BANK_TRANSFER',
            then: () => Yup.string().required('Account Holder Name is required'),
        }),

        bankName: Yup.string().when('refundMethod', {
            is: 'DIRECT_BANK_TRANSFER',
            then: () => Yup.string().required('Bank Name is required'),
        }),
        branch: Yup.string().when('refundMethod', {
            is: 'DIRECT_BANK_TRANSFER',
            then: () => Yup.string().required('Branch is required'),
        }),
        ifscCode: Yup.string().when('refundMethod', {
            is: 'DIRECT_BANK_TRANSFER',
            then: () => Yup.string().required('IFSC Code is required'),
        }),

    });
    const { cancelOrder } = useCancelOrderById();
    const defaultValues = {
        cancellationReason: '',
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
        setRefundMethod(values?.refundMethod);
    }, [values?.refundMethod])


    const onSubmit = async (data) => {
        try {
            let payloadObj = {};
            if (refundMethod === "UPI") {
                payloadObj = {
                    orderId: orderId,
                    cancellationReason: data?.cancellationReason,
                    refundMethod: refundMethod,
                    upiId: data?.upiId,
                    upiName: data?.upiName,
                }
            } else if (refundMethod === "DIRECT_BANK_TRANSFER") {
                payloadObj = {
                    orderId: orderId,
                    cancellationReason: data?.cancellationReason,
                    refundMethod: refundMethod,
                    accountNumber: data?.accountNumber,
                    accountHolderName: data?.accountHolderName,
                    bankName: data?.bankName,
                    branch: data?.branch,
                    ifscCode: data?.ifscCode,
                }
            } else {
                payloadObj = {
                    orderId: orderId,
                    cancellationReason: data?.cancellationReason,
                    // user_id: userId,
                };
            }
            // console.log("payloadObj=", payloadObj)
            cancelOrder(payloadObj);
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };
    console.log("refundMethod=", values?.orderMode);
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Box >
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} lg={12}>

                                <RHFTextField
                                    name="cancellationReason"
                                    label="Cancellation Reason"
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            {orderMode === "ONLINE" ?
                                <Grid item xs={12} md={12} lg={12}>
                                    {/* <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Refund Method"
                                        name="refundMethod"
                                        style={{ display: 'block', fontSize: '0.875rem' }}
                                    // onChange={(event) => setRefundMethod(event.target.value)}
                                    >
                                        <MenuItem value="UPI"> UPI</MenuItem>
                                        <MenuItem value="DIRECT_BANK_TRANSFER"> DIRECT_BANK_TRANSFER</MenuItem>
                                    </Select> */}
                                    <RHFSelect
                                        name="refundMethod"
                                        label="Refund Method"
                                        size="large"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                    >
                                        <MenuItem value="UPI"> UPI</MenuItem>
                                        <MenuItem value="DIRECT_BANK_TRANSFER"> DIRECT_BANK_TRANSFER</MenuItem>
                                    </RHFSelect>
                                </Grid>
                                : null}
                            {refundMethod === "UPI" ?
                                <>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <RHFTextField
                                            name="upiId"
                                            label="UPI ID"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <RHFTextField
                                            name="upiName"
                                            label="UPI NAME"
                                        />
                                    </Grid></>
                                : null}
                            {refundMethod === "DIRECT_BANK_TRANSFER" ?
                                <>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <RHFTextField
                                            name="accountNumber"
                                            label="Account Number"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <RHFTextField
                                            name="accountHolderName"
                                            label="Account Holder Name"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <RHFTextField
                                            name="bankName"
                                            label="Bank Name"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <RHFTextField
                                            name="branch"
                                            label="Branch"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <RHFTextField
                                            name="ifscCode"
                                            label="IFSC Code"
                                        />
                                    </Grid>
                                </>
                                : null}
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
