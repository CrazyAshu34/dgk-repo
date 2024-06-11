import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
    Box,
    Checkbox,
    Grid, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useExchangeAndCreateOrderById } from 'services/orderServices';
import * as Yup from 'yup';
import FormProvider from '../../../components/hook-form';
import Image from '../../../components/image';

OrderExchange.propTypes = {
    orderId: PropTypes.string,
    orderData: PropTypes.object,
    handleClose: PropTypes.func,
};

export default function OrderExchange({ orderId, orderData, handleClose }) {
    const userId = localStorage.getItem('userId');
    const [productRows, setProductRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const { exchangeAndCreateOrder, isLoading: updateOrderIsLoading } = useExchangeAndCreateOrderById();
    useEffect(() => {
        if (orderData) {
            // const matchedProducts = orderData.orderDetails.orderedProducts.filter(product => {
            //     return orderData.exchangeDetails.exchangeProducts.some(exchangeProduct => exchangeProduct.productId === product.productId);
            // });
            const matchedProducts = orderData.orderDetails.orderedProducts.filter((product) => {
                const matchingExchangeProduct = orderData.exchangeDetails.exchangeProducts.find((exchangeProduct) => {
                    if (exchangeProduct.productId === product.productId) {
                        if (product.variant.length === 0) {
                            return true; // When variant is empty, filter by productId only
                        }
                        // Check if the variants match
                        return product.variant.every((variant) =>
                            exchangeProduct.variant.some((exchangeVariant) =>
                                exchangeVariant.title === variant.title &&
                                exchangeVariant.option === variant.option
                            )
                        );
                    }
                    return false;
                });

                return matchingExchangeProduct !== undefined;
            });

            setProductRows(matchedProducts);
            setSelectedRows(matchedProducts);
        }
    }, [orderData]);
    const NewUserSchema = Yup.object().shape({
        exchangeReason: Yup.string(),
    });
    const defaultValues = {
        exchangeReason: '',
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
    const onSubmit = async () => {
        try {
            const payload = {
                // eslint-disable-next-line object-shorthand
                orderId: orderId,
                exchangeProduct: selectedRows,
                exchangeStatus: "EXCHANGE_ASSIGN_TO_SHIPROCKET",
            };

            console.log("payloadObj=", payload);
            exchangeAndCreateOrder(payload, {
                onSuccess: () => queryClient.invalidateQueries(['_getAllOrders']),
            });
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRowSelect = (event, row) => {
        if (event.target.checked) {
            setSelectedRows([...selectedRows, row]);
        } else {
            setSelectedRows(selectedRows.filter(selectedRow => selectedRow !== row));
        }
    };
    console.log("exchangeProduct=", selectedRows);
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Typography id="modal-modal-title" variant="h6" component="h6" style={{ fontSize: "15px" }} sx={{ mb: 2 }}>
                Exchange Order({orderData?.orderId})
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Box >
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} lg={12}>
                                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                                    <Table size='small' >
                                        <TableBody>
                                            {productRows?.map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                                                    }}
                                                >
                                                    <TableCell align="left">
                                                        <Checkbox
                                                            checked={selectedRows.includes(row)}
                                                            onChange={(event) => handleRowSelect(event, row)}
                                                        />

                                                    </TableCell>
                                                    <TableCell><Image disabledEffect alt="logo" src={row?.images[0]} sx={{ maxWidth: 60 }} /></TableCell>
                                                    <TableCell align="left">
                                                        <Box sx={{ maxWidth: 560 }}>
                                                            <Typography variant="subtitle2">
                                                                {row?.productName}
                                                            </Typography>
                                                            {
                                                                row?.variant?.length > 0 ?
                                                                    row?.variant?.map(item =>
                                                                        <>
                                                                            <small>
                                                                                {item?.title.toUpperCase()} : {item?.option.toUpperCase()}
                                                                            </small>{"\n"}</>
                                                                    )
                                                                    : null
                                                            }
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">{row.productQuantity}</TableCell>
                                                </TableRow>
                                            ))
                                            }
                                        </TableBody></Table>
                                </TableContainer>

                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                                <Stack direction="row" style={{ padding: '30px' }} justifyContent="end">
                                    <LoadingButton
                                        type="submit"
                                        variant="contained"
                                        size=""
                                        loading={isSubmitting}
                                        disabled={selectedRows?.length === 0}
                                    >
                                        Proceed to packed
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
