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
import { useState } from 'react';
import { fCurrency } from 'utils/formatNumber';
import Image from '../../../components/image';
import Scrollbar from '../../../components/scrollbar';
import { TableHeadCustom } from '../../../components/table';

Carthistory.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
};

export default function Carthistory({ title, tableData, tableLabels, ...other }) {
  console.log("tableDataa=", tableData);
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
    image,
    quantity,
    title,
    rows, createdAt } = row;
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <TableRow>
        <TableCell><Image
          disabledEffect
          alt={title}
          src={
            image !== undefined
              ? image
              : 'https://picsum.photos/seed/picsum/200/300'
          }
          sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
        /></TableCell>
        <TableCell>

          {title}
          {rows?.variantData.length > 0 ?
            <p><small>{rows?.variantData.map((ele) => `${ele.title.toUpperCase()}: ${ele.value.toUpperCase()}, `)}</small></p>
            : null}
        </TableCell>
        <TableCell align="center">{fCurrency(rows?.perProductPrice)}</TableCell>
        <TableCell align="center">{quantity}</TableCell>

        <TableCell align="center">{fCurrency(rows?.perProductPrice * quantity)}</TableCell>
        <TableCell>{moment(createdAt).format('DD MMM YYYY')}</TableCell>
      </TableRow>
    </>
  );
}
