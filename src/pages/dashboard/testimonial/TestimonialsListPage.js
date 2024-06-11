import { Button, Card, Container, Divider, Table, TableBody, TableContainer } from '@mui/material';
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
import { TestimonialsTableRow, TestimonialsToolbar } from 'sections/@dashboard/testimonials';
import { useDeleteTestimonialsById, useGetAllTestimonials } from 'services/testimonialsServices';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: 'image', label: 'Image', align: 'left' },
  { id: 'test_name', label: 'NAME', align: 'left', width: 180 },
  { id: 'test_comment', label: 'COMMENT', align: 'left', width: 300 },
  { id: 'designation', label: 'DESIGNATION', align: 'left' },
  { id: '' },
];

const headers = [
  { label: 'NAME', key: 'test_name' },
  { label: 'DESIGNATION', key: 'designation' },
  { label: 'COMMENT', key: 'test_comment' },
  // { label: 'REVIEW', key: 'test_rewiew' },
];

export default function TestimonialsListPage() {
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
  const [getDownload, setGetDownload] = useState([]);
  const [filterName, setFilterName] = useState('');

  const {
    data,
    isLoading: testimonialsIsLoading,
    isError: testimonialsIsError,
  } = useGetAllTestimonials();
  const { DeleteTestimonials } = useDeleteTestimonialsById();

  useEffect(() => {
    if (data) {
      setTableData(data);
      setGetDownload(data);
    }
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName;

  if (testimonialsIsLoading) return <LoadingScreen />;

  if (testimonialsIsError) return <BlankPage />;

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.testimonials.edit(id));
  };

  const handleDeleteRow = (id) => {
    DeleteTestimonials(id);
    const filterData = tableData.filter((item) => item._id !== id);
    setTableData(filterData);
  };

  return (
    <>
      <Helmet>
        <title> Testimonials </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Testimonials List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Testimonials', href: PATH_DASHBOARD.testimonials.root },
            { name: 'Testimonials List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.testimonials.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Testimonials
            </Button>
          }
        />

        <Card>
          <TestimonialsToolbar
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
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TestimonialsTableRow
                        key={row.id}
                        row={row}
                        index={index}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
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
      (item) => item.test_name?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1
    );
  }
  return inputData;
}
