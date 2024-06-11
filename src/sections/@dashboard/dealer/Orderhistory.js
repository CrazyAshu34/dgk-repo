import PropTypes from 'prop-types';
// @mui
import {
  Card,
  CardHeader,
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { useTheme } from '@mui/material/styles';
import Label from 'components/label/Label';
import moment from 'moment';
import Scrollbar from '../../../components/scrollbar';
import { TableHeadCustom } from '../../../components/table';
import { onCloseModal, onOpenModal } from '../../../redux/slices/calendar';
import { useDispatch, useSelector } from '../../../redux/store';
import DealerTable from './DealerTable';

Orderhistory.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
};

export default function Orderhistory({ title, tableData, tableLabels, ...other }) {
  const navigate = useNavigate();
  const handleDetailsViewRow = (id) => { 
    navigate(PATH_DASHBOARD.order.invoiceb2b(id));
  };
  return (
    <Card {...other}>
      <CardHeader title={title} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <OrderHistoryRow key={row.id} row={row} onDetails={() => handleDetailsViewRow(row?._id)} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

OrderHistoryRow.propTypes = {
  row: PropTypes.object,
  onDetails: PropTypes.func,
};

function OrderHistoryRow({ row, onDetails }) {
  const theme = useTheme();
  const { ord_id, ord_payid, ord_quantity, ord_value, ord_status, ord_date, ord_product } = row;

  const dispatch = useDispatch();
  const handleOpenModal = () => {
    dispatch(onOpenModal());
  };
  const { openModal } = useSelector((state) => state.calendar);
  const handleCloseModal = () => {
    dispatch(onCloseModal());
  };

  return (
    <>
      <TableRow>
        <TableCell onClick={() => onDetails()} sx={{ cursor: 'pointer' }}>
          {ord_id}
        </TableCell>

        <TableCell>{ord_payid}</TableCell>

        <TableCell align="center">{ord_quantity}</TableCell>

        <TableCell align="center">{ord_value}</TableCell>

        <TableCell align="center">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (ord_status === 'on_process' && 'primary') ||
              (ord_status === 'delivered' && 'success') ||
              (ord_status === 'new' && 'warning') ||
              'error'
            }
          >
            {ord_status?.replaceAll('_', ' ')}
          </Label>
        </TableCell>

        <TableCell>{moment(ord_date).format('DD MMM YYYY')}</TableCell>
      </TableRow>

      <Dialog fullWidth maxWidth="md" open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Products</DialogTitle>
        <DealerTable ord_product={ord_product.cart} onCancel={handleCloseModal} />
      </Dialog>
    </>
  );
}
