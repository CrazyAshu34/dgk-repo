import { CardHeader, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
import Scrollbar from '../../../components/scrollbar';
import { TableHeadCustom } from '../../../components/table';

Productshistory.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.array.isRequired,
  tableLabels: PropTypes.array.isRequired,
  cust_type: PropTypes.object,
};

export default function Productshistory({ cust_type, title, tableData, tableLabels, ...other }) {
  // console.log('ord_product?.cart123', tableData, cust_type);
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
                  <ProductshistoryRow key={row.id} row={row} cust_type={cust_type} />
                ))}
              </TableBody>
            ) : null}
          </Table>
        </TableContainer>
      </Scrollbar>
    </>
  );
}

ProductshistoryRow.propTypes = {
  row: PropTypes.object,
  cust_type: PropTypes.object,
};

function ProductshistoryRow({ row, cust_type }) {
  const { productId, title, images, b2cRows, b2bRows, count } = row;
  console.log('cust_type123', cust_type, row);
  return (
    <TableRow>
      <TableCell>{productId}</TableCell>

      {/* <TableCell sx={{ display: 'flex', alignItems: 'left' }}>
        {images[0]?.values[0]?.length > 0 ? (
          <Image
            disabledEffect
            alt=""
            src=""
            // eslint-disable-next-line react/jsx-no-duplicate-props
            alt={title}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            src={images[0]?.values[0]}
            sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
          />
        ) : null}
      </TableCell> */}

      <TableCell>{title}</TableCell>

      {cust_type === 'b2c' ? <TableCell>{b2cRows[0]?.mrp}</TableCell> : null}

      {cust_type === 'b2b' ? <TableCell>{b2bRows[0]?.mrp}</TableCell> : null}

      <TableCell>{count}</TableCell>
    </TableRow>
  );
}
