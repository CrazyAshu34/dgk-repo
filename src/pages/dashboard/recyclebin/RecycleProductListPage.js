import { Card, Container, Divider, Table, TableBody, TableContainer } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
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
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import {
    useEmptyAllDataProduct,
    useGetAllDeleteProductRecyclebin,
    usePermanentlyDeleteProductById,
    useReStoreAllDataProduct,
    useReStoreDataProductById,
  } from 'services/productServices';
import ProductToolbar from '../../../sections/@dashboard/recyclebin/ProductToolbar';
import ProductTableRow from '../../../sections/@dashboard/recyclebin/ProductTableRow';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { label: 'IMAGE', id: 'images', align: 'left' },
  { label: 'TITLE', id: 'title', align: 'left' },
  { label: 'PRODUCT VISIBLE', id: '', align: 'center' },
  { label: 'MRP', id: 'mrp', align: 'center' },
  { label: 'PRICE', id: 'perProductPrice', align: 'center' },
  { id: '', label: 'ACTION', align: 'left' },
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
  const [filterName, setFilterName] = useState('');
  const [tabValue, setTabValue] = useState('b2c');

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const {
    data,
    isLoading: productIsLoading,
    isError: productIsError,
  } = useGetAllDeleteProductRecyclebin();

  const { ReStoreData } = useReStoreDataProductById();
  const { ReStoreAllData } = useReStoreAllDataProduct();
  const { PermanentlyDeleteProduct } = usePermanentlyDeleteProductById();
  const { EmptyAllData } = useEmptyAllDataProduct();

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

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

  const handleReStoreRow = (id) => {
    ReStoreData(id);
    const filterData = tableData.filter((item) => item._id !== id);
    setTableData(filterData);
  };

  const handleDeletePermanentlyRow = (id) => {
    PermanentlyDeleteProduct(id);
    const filterData = tableData.filter((item) => item._id !== id);
    setTableData(filterData);
  };

  const handleAllReStoreRow = () => {
    ReStoreAllData();
  };

  const handleEmptyAllData = () => {
    EmptyAllData();
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
        />

        <Card>
          {tableData.length ? (
            <>
              <ProductToolbar
                filterName={filterName}
                onFilterName={handleFilterName}
                handleAllReStoreRow={() => handleAllReStoreRow()}
                handleEmptyAllData={() => handleEmptyAllData()}
              />
              <Divider />
            </>
          ) : null}
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
                            onDeletePermanentlyRow={() => handleDeletePermanentlyRow(row._id)}
                            onReStoreRow={() => handleReStoreRow(row._id)}
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
