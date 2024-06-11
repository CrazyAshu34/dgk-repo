import { Card, Divider, Table, TableBody, TableContainer } from '@mui/material';
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
import BlankPage from 'pages/dashboard/BlankPage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useEmptyAllDataCategories,
  useGetAllDeleteCategoriesRecyclebin,
  usePermanentlyDeleteCategoriesById,
  useReStoreAllDataCategories,
  useReStoreDataCategoriesById,
} from '../../../../services/categoryServices';
import CategoryTableRow from './CategoryTableRow';
import CategoryTableToolbar from './CategoryTableToolbar';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: 'icon', label: 'ICON', align: 'left' },
  { id: 'name', label: 'CATEGORY', align: 'left' },
  { id: '', label: 'ACTION', align: 'left' },
];

export default function CategoryListPage() {
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

  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');

  const {
    data,
    isLoading: categoryIsLoading,
    isError: categoryIsError,
  } = useGetAllDeleteCategoriesRecyclebin();
  const { ReStoreData } = useReStoreDataCategoriesById();
  const { ReStoreAllData } = useReStoreAllDataCategories();
  const { PermanentlyDeleteCategories } = usePermanentlyDeleteCategoriesById();
  const { EmptyAllData } = useEmptyAllDataCategories();

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

  if (categoryIsLoading) return <LoadingScreen />;

  if (categoryIsError) return <BlankPage />;

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
    PermanentlyDeleteCategories(id);
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
      <Card>
        {tableData.length ? (
          <>
            <CategoryTableToolbar
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
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <CategoryTableRow
                      key={row.id}
                      row={row}
                      index={index}
                      onDeletePermanentlyRow={() => handleDeletePermanentlyRow(row._id)}
                      onReStoreRow={() => handleReStoreRow(row._id)}
                    />
                  ))}

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

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
