import PropTypes from 'prop-types';
// @mui
import {
    Card,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import Image from '../../../components/image';
import Scrollbar from '../../../components/scrollbar';
import { TableHeadCustom } from '../../../components/table';

Wishlisthistory.propTypes = {
    title: PropTypes.string,
    tableData: PropTypes.array,
    tableLabels: PropTypes.array,
};

export default function Wishlisthistory({ title, tableData, tableLabels, ...other }) {
    console.log("wishlistdata=", tableData);
    return (
        <Card {...other}>
            <CardHeader title={title} sx={{ mb: 3 }} />

            <TableContainer sx={{ overflow: 'unset' }}>
                <Scrollbar>
                    <Table sx={{ minWidth: 720 }}>
                        <TableHeadCustom headLabel={tableLabels} />

                        <TableBody>
                            {tableData?.map((row) => (
                                <WishlistHistoryRow key={row.id} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>
        </Card>
    );
}

// ----------------------------------------------------------------------

WishlistHistoryRow.propTypes = {
    row: PropTypes.object,
};

function WishlistHistoryRow({ row }) {
    const theme = useTheme();
    const {
        products,
        createdAt, productId
    } = row;

    return (
        <>
            <TableRow>
                <TableCell><Image
                    disabledEffect
                    alt={products[0]?.title}
                    src={
                        products[0]?.images[0]?.values[0] !== undefined
                            ? products[0]?.images[0]?.values[0]?.url
                            : 'https://picsum.photos/seed/picsum/200/300'
                    }
                    sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
                /></TableCell>
                <TableCell>{products[0]?.title}</TableCell>
                <TableCell>{moment(createdAt).format('DD MMM YYYY')}</TableCell>
            </TableRow>

        </>
    );
}
