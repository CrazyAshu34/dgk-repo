import { MenuItem, Select, TableCell, TableRow } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Image from '../../../components/image';
import { useStatusUpdateReviewById } from '../../../services/productServices';


ProductReviewTableRow.propTypes = {
    row: PropTypes.object,
    index: PropTypes.number,
    onOpenReviewModel: PropTypes.func,
    handleDetailsViewRow: PropTypes.func,
};

export default function ProductReviewTableRow({ row, index, onOpenReviewModel, handleDetailsViewRow }) {
    const { _id, products, customers, orders, message, rating, status, orderId, images, createdAt } = row;
    const [reviewStatus, setReviewStatus] = useState('Pending');
    const queryClient = useQueryClient();
    const { updateProductStatus, isLoading: updateOrderIsLoading } = useStatusUpdateReviewById();
    useEffect(() => {
        if (status === "Pending") {
            setReviewStatus("Pending");
        } else if (status === "Active") {
            setReviewStatus("Active");
        } else if (status === "InActive") {
            setReviewStatus("InActive");
        }
    }, [status]);
    const onChangeStatus = async (data) => {
        setReviewStatus(data);
        const payload = {
            _id,
            status: data,
        };
        updateProductStatus(payload, {
            onSuccess: () => queryClient.invalidateQueries(['_statusUpdateReviewById']),
        });
    };
    return (
        <TableRow hover>
            <TableCell align="left">{index + 1}</TableCell>

            <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                <Image
                    disabledEffect
                    alt={products[0]?.title}
                    src={
                        products[0]?.images[0]?.values[0] !== undefined
                            ? products[0]?.images[0]?.values[0]?.url
                            : 'https://picsum.photos/seed/picsum/200/300'
                    }
                    sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
                />
            </TableCell>

            <TableCell align="left">
                {products[0]?.title}
            </TableCell>

            <TableCell align="left" style={{ cursor: 'pointer' }} onClick={() => onOpenReviewModel()}>
                {/* {images?.length > 0 ? <a href={images[0]}>View</a> : '-'} */}
                View
            </TableCell>
            <TableCell align="left" onClick={() => handleDetailsViewRow()} style={{ cursor: 'pointer', color: 'blue' }} >

                {orders[0]?.orderId}
            </TableCell>

            <TableCell align="left">{moment(createdAt).format('DD MMM YYYY')}</TableCell>
            <TableCell align="left">
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    onChange={(e) => onChangeStatus(e.target.value)}
                    value={reviewStatus}
                    sx={{ height: '40px' }}
                >
                    <MenuItem value='Pending'>Pending</MenuItem>
                    <MenuItem value='InActive'>InActive</MenuItem>
                    <MenuItem value='Active'>Active</MenuItem>
                </Select>
            </TableCell>
        </TableRow>
    );
}
