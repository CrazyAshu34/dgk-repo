import { Button, Card, Container, Divider, Table, TableBody, TableContainer } from '@mui/material';
import CustomBreadcrumbs from 'components/custom-breadcrumbs';
import Iconify from 'components/iconify';
import LoadingScreen from 'components/loading-screen';
import Scrollbar from 'components/scrollbar';
import { useSettingsContext } from 'components/settings';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  emptyRows,
  getComparator,
  useTable,
} from 'components/table';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { BannerTableRow, BannerToolbar } from 'sections/@dashboard/banner';
import { useDeleteBannersById, useGetAllBanners } from 'services/bannerServices';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: 'ban_image', label: 'IMAGE', align: 'left' },
  { id: 'ban_title', label: 'TITLE', align: 'left', width: 180 },
  { id: 'ban_subtitle', label: 'SUB TITLE', align: 'left', width: 180 },
  { id: 'ban_type', label: 'TYPE', align: 'left' },
  { id: 'pro_link', label: 'LINK', align: 'left' },
  { id: '' },
];

const headers = [
  { label: 'IMAGE', key: 'ban_image' },
  { label: 'TITLE', key: 'ban_title' },
  { label: 'SUB TITLE', key: 'ban_title' },
  { label: 'TYPE', key: 'ban_type' },
  { label: 'LINK', key: 'pro_link' },
];

export default function BlogManagementListPage() {
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
  const [getDownload, setGetDownload] = useState([]);
  const [filterName, setFilterName] = useState('');

  const { data, isLoading: bannerIsLoading, isError: bannerIsError } = useGetAllBanners();
  const { DeleteBanner } = useDeleteBannersById();

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

  if (bannerIsLoading) return <LoadingScreen />;

  if (bannerIsError) return <BlankPage />;

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.banner.edit(id));
  };

  const handleDeleteRow = (id) => {
    DeleteBanner(id);
    const filterData = tableData.filter((item) => item._id !== id);
    setTableData(filterData);
  };

  return (
    <>
      <Helmet>
        <title>Banner</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Banner List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Banner', href: PATH_DASHBOARD.banner.root },
            { name: 'Blog List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.banner.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Banner
            </Button>
          }
        />

        <Card>
          <BannerToolbar
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
                      <BannerTableRow
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
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (filterName) {
    inputData = inputData?.filter(
      (item) => item?.bannerTitle?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1
    );
  }
  return inputData;
}
