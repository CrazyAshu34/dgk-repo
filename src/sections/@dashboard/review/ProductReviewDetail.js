import { Button, Rating, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import moment from 'moment';
import PropTypes from 'prop-types';
import { CustomAvatar } from '../../../components/custom-avatar';
import Iconify from '../../../components/iconify';
import { useStatusUpdateReviewById } from '../../../services/productServices';

const IconStyle = styled(Iconify)(({ theme }) => ({
    width: 20,
    height: 20,
    marginTop: 1,
    flexShrink: 0,
    marginRight: theme.spacing(2),
}));

ProductReviewDetails.propTypes = {
    reviewData: PropTypes.object,
    handleClose: PropTypes.func,
};
export default function ProductReviewDetails({ reviewData, handleClose }) {
    const theme = useTheme();
    const { updateProductStatus, isLoading: updateOrderIsLoading } = useStatusUpdateReviewById();
    const onChangeStatus = async (data) => {

        const payload = {
            _id: reviewData?._id,
            status: data,
        };
        updateProductStatus(payload, {
            onSuccess: () => queryClient.invalidateQueries(['_statusUpdateReviewById']),
        });
        handleClose();
    };

    return (
        <>
            <Stack
                spacing={2}
                sx={{
                    position: 'relative',
                    p: (theme) => theme.spacing(3, 3, 2, 3),
                }}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    <CustomAvatar name={reviewData?.customers[0]?.name} />
                    <div>
                        <Typography variant="subtitle2">{reviewData?.customers[0]?.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                            Posted {moment(reviewData?.createdAt).format('DD-MMM-YYYY')}
                            <Stack direction="column" alignItems="left" spacing={1}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {moment(reviewData?.createdAt).format('hh:mm A')}
                                </Typography>

                            </Stack>
                        </Typography>
                    </div>
                </Stack>
                <Rating value={reviewData?.rating} size="small" readOnly precision={0.5} />
                <Typography variant="body2">{reviewData?.message}</Typography>
            </Stack>
            <Stack
                spacing={2}
                direction="row"
                alignItems="flex-end"
                sx={{
                    p: theme.spacing(0, 3, 3, 3),
                }}
            >
                <Button
                    fullWidth
                    color="success"
                    variant="contained"
                    startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                    onClick={() => onChangeStatus("Active")}
                >
                    Accept
                </Button>

                <Button
                    fullWidth
                    color="error"
                    variant="contained"
                    startIcon={<Iconify icon="eva:close-circle-fill" />}
                    onClick={() => onChangeStatus("InActive")}
                >
                    Reject
                </Button>
            </Stack>
        </>
    );
}; 
