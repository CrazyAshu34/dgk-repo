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
import { fCurrency } from 'utils/formatNumber';
import { useTheme } from '@mui/material/styles';
import Label from 'components/label/Label';
import moment from 'moment';
import { useState } from 'react';
import Image from '../../../components/image';
import Scrollbar from '../../../components/scrollbar';
import { TableHeadCustom } from '../../../components/table';

Carthistory.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
};

export default function Carthistory({ title, tableData, tableLabels, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData[0]?.cart.map((row) => (
                <CartHistoryRow key={row.id} row={row} date={tableData?.created_at} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

// ----------------------------------------------------------------------

CartHistoryRow.propTypes = {
  row: PropTypes.object,
  date: PropTypes.string,
};

function CartHistoryRow({ row, date }) {
  const theme = useTheme();
  const {
    title,
    images,
    quantity,
    b2bRows,
    variants,gsts,
  } = row;
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const amout = Number(b2bRows[0]?.perProductPrice);
const total_amount = Number(quantity)*Number(amout);
  return (
    <>
      <TableRow>
        <TableCell><Image
            disabledEffect
            alt={title}
            src={
              images?.values[0] !== undefined
                ? images?.values[0]?.url
                : 'https://picsum.photos/seed/picsum/200/300'
            }
            sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
          /></TableCell>
        <TableCell>
        
          {title} 
          {variants.length>0?<p><small>{b2bRows[0]?.variantData.map((ele)=> `${ele.title.toUpperCase()}: ${ele.value.toUpperCase()}, ` )}</small></p>:null}
        </TableCell>
        <TableCell align="center">{quantity}</TableCell>
        <TableCell align="center">{fCurrency(amout)}</TableCell>
        <TableCell align="center">{fCurrency(total_amount)}</TableCell>
        <TableCell>{moment(date).format('DD MMM YYYY')}</TableCell>
      </TableRow>
    </>
  );
}
