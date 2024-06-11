import { CardHeader, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
import Image from '../../../components/image';
import Scrollbar from '../../../components/scrollbar';
import { TableHeadCustom } from '../../../components/table';

Dealerhistory.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.array.isRequired,
  tableLabels: PropTypes.array.isRequired,
};

export default function Dealerhistory({ title, tableData, tableLabels, ...other }) {
  return (
    <>
      <CardHeader title={title} />
      <Scrollbar>
        <TableContainer>
          <Table>
            <TableHeadCustom headLabel={tableLabels} />

            {tableData?.length ? (
              <TableBody>
                {tableData?.map((row) => (
                  <DealerhistoryRow key={row.id} row={row} />
                ))}
              </TableBody>
            ) : null}
          </Table>
        </TableContainer>
      </Scrollbar>
    </>
  );
}

DealerhistoryRow.propTypes = {
  row: PropTypes.object,
};

function DealerhistoryRow({ row }) {
  const { productId, title, images, count, b2bRows } = row;
  return (
    <TableRow>
      <TableCell>{productId}</TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'left' }}>
        {images?.values[0].length > 0 ? (
          <Image
            disabledEffect
            // eslint-disable-next-line react/jsx-no-duplicate-props
            alt={title}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            src={images?.values[0]}
            sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
          />
        ) : null}
      </TableCell>

      <TableCell>{title}</TableCell>
      <TableCell>{b2bRows[0]?.mrp}</TableCell>
      <TableCell>{count}</TableCell>
    </TableRow>
  );
}
