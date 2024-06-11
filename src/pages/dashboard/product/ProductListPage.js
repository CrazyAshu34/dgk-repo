import { Button, Card, Container, Divider, Table, TableBody, TableContainer } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import Iconify from 'components/iconify';
import LoadingScreen from 'components/loading-screen';
import Scrollbar from 'components/scrollbar';
import { useSettingsContext } from 'components/settings';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'components/table';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { ProductTableRow, ProductToolbar } from 'sections/@dashboard/product';
import { useDeleteProductById, useGetAllProducts } from 'services/productServices';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { label: 'IMAGE', id: 'images', align: 'left' },
  { label: 'TITLE', id: 'title', align: 'left' },
  { label: 'MRP', id: 'mrp', align: 'center' },
  { label: 'PRICE', id: 'perProductPrice', align: 'center' },
  { label: 'QTY', id: 'qty', align: 'left' },
  { label: 'STATUS', id: 'isActive', align: 'left' },
  { label: 'TYPE', id: 'type', align: 'left' },
  // { label: 'STOCK', id: 'stock', align: 'left' },
  { id: '' },
];

const headers = [
  { label: 'IMAGE', key: 'images' },
  { label: 'TITLE', key: 'title' },
 
  { label: 'PRODUCT VISIBLE', key: '' },
  { label: 'MRP', key: 'mrp' },
  { label: 'PRICE', key: 'perProductPrice' },
  { label: 'QTY', key: 'qty' },
  { label: 'STATUS', key: 'isActive' },
  { label: 'TYPE', key: 'type' },
];

export default function ProductListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [tableData, setTableData] = useState([]);
  const [getDownload, setGetDownload] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [tabValue, setTabValue] = useState('b2c');

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const { data, isLoading: productIsLoading, isError: productIsError } = useGetAllProducts();
  const { deleteProduct } = useDeleteProductById();

  useEffect(() => {
    if (data) {
      setTableData(data);
      setGetDownload(data);
    }
  }, [data]);
  console.log(data);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName;

  if (productIsLoading) return <LoadingScreen />;

  if (productIsError) return <BlankPage />;

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.product.edit(id));
  };

  const handleDeleteRow = (id) => {
    deleteProduct(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(['_getGetAllProducts']);
      },
    });
  };

  const handleDetailRow = (id) => {
    navigate(PATH_DASHBOARD.product.view(id));
  };

  return (
    <>
      <Helmet>
        <title>Products</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Product List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Products', href: PATH_DASHBOARD.product.root },
            { name: 'Product List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.product.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Product
            </Button>
          }
        />

        <Card>
          <ProductToolbar
            handleChange={handleChange}
            filterName={filterName}
            onFilterName={handleFilterName}
            headers={headers}
            getDownload={getDownload}
          />
          <Divider />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {data !== null && data !== ''
                    ? dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <ProductTableRow
                            key={row?._id}
                            row={row}
                            index={index}
                            tabValue={tabValue}
                            onDeleteRow={() => handleDeleteRow(row?._id)}
                            onEditRow={() => handleEditRow(row?._id)}
                            onDetails={() => handleDetailRow(row?._id)}
                          />
                        ))
                    : null}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (filterName) {
    inputData = inputData?.filter(
      (item) => item?.title?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1
    );
  }
  return inputData;
}
