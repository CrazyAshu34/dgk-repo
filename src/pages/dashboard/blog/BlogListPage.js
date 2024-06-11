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
import { BlogTableRow, BlogToolbar } from 'sections/@dashboard/blogmanagement';
import { useDeleteBlogById, useGetAllBlog } from 'services/blogServices';
import BlankPage from '../BlankPage';

const TABLE_HEAD = [
  { id: 'index', label: 'SNO', align: 'left' },
  { id: 'blogId', label: 'BLOG ID', align: 'left' },
  { id: 'title', label: 'TITLE', align: 'left' },
  { id: 'posted_by', label: 'POSTED BY', align: 'left' },
  { id: '' },
];

const headers = [
  { label: 'BANNER TYPE', key: 'banner_type' },
  { label: 'ATTACH IMAGE', key: 'attach_file' },
  { label: 'YOUTUBE LINK', key: 'youtube_link' },
  { label: 'TITLE', key: 'title' },
  { label: 'Posted By', key: 'posted_by' },
];

export default function BlogListPage() {
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

  const { data, isLoading: blogIsLoading, isError: blogIsError } = useGetAllBlog();
  const { DeleteBlog } = useDeleteBlogById();

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

  if (blogIsLoading) return <LoadingScreen />;

  if (blogIsError) return <BlankPage />;

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.blog.edit(id));
  };

  const handleDeleteRow = (id) => {
    DeleteBlog(id);
    const filterData = tableData.filter((item) => item._id !== id);
    setTableData(filterData);
  };

  const handleDetailRow = (id) => {
    navigate(PATH_DASHBOARD.blog.view(id));
  };

  return (
    <>
      <Helmet>
        <title>Blog</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Blog List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.root },
            { name: 'Blog List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.blog.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Blog
            </Button>
          }
        />

        <Card>
          <BlogToolbar
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
                        <BlogTableRow
                          key={row.id}
                          row={row}
                          index={index}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          onEditRow={() => handleEditRow(row._id)}
                          onDetails={() => handleDetailRow(row._id)}
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

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (item) => item?.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }
  return inputData;
}
