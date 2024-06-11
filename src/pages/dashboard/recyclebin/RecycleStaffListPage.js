import { Card, Container, Table, TableBody, TableContainer } from '@mui/material';
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
    useEmptyAllDataStaff,
    useGetAllDeleteStaffRecyclebin,
    usePermanentlyDeleteStaffById,
    useReStoreAllDataStaff,
    useReStoreDataStaffById,
  } from 'services/staffServices'; 
import StaffTableRow from '../../../sections/@dashboard/recyclebin/StaffTableRow';
import StaffTableToolbar from '../../../sections/@dashboard/recyclebin/StaffTableToolbar';

import BlankPage from '../BlankPage';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: 'profile', label: 'PICTURE', align: 'left' },
  { id: 'name', label: 'NAME', align: 'left' },
  { id: 'designation', label: 'DESIGNATION', align: 'left' },
  { id: 'contact_no', label: 'CONTACT NO', align: 'left' },
  { id: 'email_id', label: 'EMAIL ID', align: 'left' },
  { id: '', label: 'ACTION', align: 'left' },
];

export default function AmcListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
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
    isLoading: staffIsLoading,
    isError: staffIsError,
  } = useGetAllDeleteStaffRecyclebin();
  const { ReStoreData } = useReStoreDataStaffById();
  const { ReStoreAllData } = useReStoreAllDataStaff();
  const { PermanentlyDeleteStaff } = usePermanentlyDeleteStaffById();
  const { EmptyAllData } = useEmptyAllDataStaff();

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

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  if (staffIsLoading) return <LoadingScreen />;

  if (staffIsError === true) return <BlankPage />;

  const handleReStoreRow = (id) => {
    ReStoreData(id);
    const filterData = tableData.filter((item) => item._id !== id);
    setTableData(filterData);
  };

  const handleDeletePermanentlyRow = (id) => {
    PermanentlyDeleteStaff(id);
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
      {' '}
      <Helmet>
        <title> Staff </title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Staff List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Staff', href: PATH_DASHBOARD.staff.root },
            { name: 'Staff List' },
          ]}
        />

        <Card>
          {tableData.length ? (
            <StaffTableToolbar
              filterName={filterName}
              onFilterName={handleFilterName}
              handleAllReStoreRow={() => handleAllReStoreRow()}
              handleEmptyAllData={() => handleEmptyAllData()}
            />
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
                      <StaffTableRow
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

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (item) =>
        item?.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.contact_no.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.email_id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
