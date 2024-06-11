import { Box, Chip, Paper, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useGetProductById } from 'services/productServices';
import { fCurrency } from 'utils/formatNumber';
import Image from '../../../../components/image';

OrderProduct.propTypes = {
    row: PropTypes.object,
    index: PropTypes.number,
    handleGst: PropTypes.func,
};
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
}));

export default function OrderProduct({ row, index, handleGst }) {

    const [productDetails, setProductDetails] = useState([]);
    const [singlePrice, setSinglePrice] = useState(0);
    const [gstAmount, setGstAmount] = useState(0);
    const [gstPercent, setGstPercent] = useState(0);
    const { data: productData, isLoading, isError } = useGetProductById(row?.productId);
    useEffect(() => {
        if (productData) {
            if (productData[0]?.gsts[0]?.totalGst) {
                // Calculate GST amount (rounding to nearest integer)
                // var gstAmt = Math.round(parseInt(row?.sellingPrice) * (parseInt(productData[0]?.gsts[0]?.totalGst) / 100));
                // Calculate single unit price (price without GST)
                // console.log(productData, "row?.sellingPrice=", row);
                // var singleUnitPrice = Math.round(parseInt(row?.sellingPrice) - gstAmt);
                const singleUnitPrice = row?.sellingPrice / (1 + parseFloat(productData[0]?.gsts[0]?.totalGst) / 100);
                // const gstAmt = parseFloat(row?.sellingPrice) * (parseFloat(productData[0]?.gsts[0]?.totalGst) / 100);
                const gstAmt = parseFloat(row?.sellingPrice) - parseFloat(row?.basePrice);
                // Set GST amount, single unit price, and GST percentage in the state
                setGstAmount(gstAmt);
                setSinglePrice(singleUnitPrice);
                setGstPercent(productData[0]?.gsts[0]?.totalGst);
                handleGst(gstAmt);
            } else {
                setSinglePrice(row?.sellingPrice);
            }
        }
    }, [productData]);
    const handleGetPrice = (amount) => {
        // console.log('cartPrice=', item?.[`${cust_type}Rows`][0]?.perProductPrice);
        const price = amount;
        return parseFloat(price);
    };
    function extractHexColorsFromString(str) {
        // Regular expression for a valid hexadecimal color code
        const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

        // Check if the string matches the pattern
        return hexColorRegex.test(str);
    }
    return (<>
        <TableRow
            key={index}
            sx={{
                borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
            style={{ background: '#f4f6f8' }}
        >

            <TableCell><Image disabledEffect alt="logo" src={row?.images[0]} sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }} /></TableCell>
            <TableCell align="left" style={{ padding: '15px 0px 15px 15px' }}>
                <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">
                        {row?.productName}

                    </Typography>

                    {/* {
                        row?.variant?.length > 0 ?
                            row?.variant?.map(item =>
                                <>
                                    <small>
                                        {item?.title.toUpperCase()} : {item?.option.toUpperCase()}
                                    </small>{"\n"}</>
                            )
                            : null
                    } */}
                    {
                        row?.variant?.length > 0 ?
                            row?.variant?.map(item => (
                                <div key={item?.title}>
                                    <small style={{ display: 'flex' }}>
                                        {item?.title.toUpperCase()} :{' '}
                                        {extractHexColorsFromString(item?.option) ? (
                                            <div
                                                style={{
                                                    backgroundColor: item?.option,
                                                    // padding: '2px 8px',
                                                    borderRadius: '0px',
                                                    height: '10px',
                                                    width: '10px',
                                                    border: '1px solid lightgray',
                                                    marginLeft: '5px',
                                                    marginRight: '5px',
                                                    marginTop: '3px'
                                                }}
                                            ></div>
                                        ) : null}
                                        {item?.option.toUpperCase()}
                                    </small>
                                </div>
                            ))
                            : null
                    }
                    {row?.sku ? <p style={{ margin: '0' }}><small>{`SKU: ${row?.sku}`}</small></p> : null}
                    {row?.isExchange ?
                        <Stack direction="row" spacing={1}>
                            <Chip label="Exchange" color="success" style={{ cursor: "default" }} title={row?.reason} variant="outlined" />
                        </Stack>
                        : null}
                    {row?.isReturn ?
                        <Stack direction="row" spacing={1}>
                            <Chip label="Return" color="warning" style={{ cursor: "default" }} title={row?.reason} variant="outlined" />
                        </Stack>
                        : null}
                </Box>
            </TableCell>

            <TableCell align="left">{row?.hsnCode}</TableCell>
            <TableCell align="right">{fCurrency(handleGetPrice(row?.mrp))}</TableCell>
            <TableCell align="right">{fCurrency(handleGetPrice(row?.discount))}</TableCell>
            <TableCell align="right">{fCurrency(handleGetPrice(row?.sellingPrice))}</TableCell>
            <TableCell align="right">{row?.gst ? `${row?.gst}%` : '0%'}</TableCell>
            <TableCell align="right">
                {fCurrency(handleGetPrice(gstAmount))}
            </TableCell>

            <TableCell align="right">{fCurrency(handleGetPrice(row?.basePrice))}</TableCell>

            <TableCell align="right" width={15}>{row.productQuantity}</TableCell>
            <TableCell align="right">
                {fCurrency(handleGetPrice(row?.basePrice) * row.productQuantity)}
            </TableCell>

        </TableRow>
    </>
    );
}; 
