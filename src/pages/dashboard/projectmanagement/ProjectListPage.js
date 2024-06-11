import {
    Button,
    Card,
    Container,
    Dialog,
    DialogTitle,
    Divider,
    Table,
    TableBody,
    TableContainer,
  } from '@mui/material';
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
  import {
    ProjectTableRow,
    ProjectToolbar,
    DialogProject,
  } from 'sections/@dashboard/projectmanagement';
  import { useDeleteProjectById, useGetAllProject } from 'services/projectServices';
  import { onCloseModal, onOpenModal } from '../../../redux/slices/calendar';
  import { useDispatch, useSelector } from '../../../redux/store';
  import BlankPage from '../BlankPage';
  
  const TABLE_HEAD = [
    { id: 'index', label: 'SNO', align: 'left' },
    { id: 'cover_image', label: 'IMAGE', align: 'left' },
    { id: 'name', label: 'NAME', align: 'left' },
    { id: 'city', label: 'CITY', align: 'left' },
    { id: '', label: 'ACTION', align: 'left' },
    { id: '' },
  ];
  
  const headers = [
    { label: 'NAME', key: 'name' },
    { label: 'IMAGE', key: 'cover_image' },
    { label: 'CITY', key: 'city' },
    { label: 'ACTION', key: '' },
  ];
  
  export default function ProjectListPage() {
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
    const dispatch = useDispatch();
  
    const [tableData, setTableData] = useState([]);
    const [getDownload, setGetDownload] = useState([]);
    const [onChangeData, setOnChangeData] = useState({});
    const [filterName, setFilterName] = useState('');
    const [tabValue, setTabValue] = useState('details');
    const { openModal } = useSelector((state) => state.calendar);
    const { data, isLoading: blogIsLoading, isError: blogIsError } = useGetAllProject();
    const { DeleteProject } = useDeleteProjectById();
  
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
      navigate(PATH_DASHBOARD.project.edit(id));
    };
  
    const handleDeleteRow = (id) => {
      DeleteProject(id);
      const filterData = tableData.filter((item) => item._id !== id);
      setTableData(filterData);
    };
  
    const handleAddEvent = (value) => {
      setTabValue('images');
      setOnChangeData({
        images: value?.images || [],
        details: value?.details || '',
        _id: value?._id || '',
      });
      dispatch(onOpenModal());
    };
    const handleShowDetails = (value) => {
      setTabValue('details');
      setOnChangeData({
        images: value?.images || [],
        details: value?.details || '',
        _id: value?._id || '',
      });
      dispatch(onOpenModal());
    };
    const handleCloseModal = () => {
      dispatch(onCloseModal());
    };
    return (
      <>
        <Helmet>
          <title>Project</title>
        </Helmet>
  
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Project List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Project', href: PATH_DASHBOARD.project.root },
              { name: 'Project List' },
            ]}
            action={
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.project.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Project
              </Button>
            }
          />
  
          <Card>
            <ProjectToolbar
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
                            <ProjectTableRow
                              key={row.id}
                              row={row}
                              index={index}
                              onDeleteRow={() => handleDeleteRow(row._id)}
                              onEditRow={() => handleEditRow(row._id)}
                              onDetails={() => handleShowDetails(row)}
                              onOpenDialog={() => handleAddEvent(row)}
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
              dense={dense}
              onChangeDense={onChangeDense}
            />
          </Card>
        </Container>
        <Dialog fullWidth maxWidth="sm" open={openModal} onClose={handleCloseModal}>
          <DialogTitle>{tabValue === 'details' ? 'Details' : 'Images'}</DialogTitle>
          <DialogProject
            images={onChangeData?.images}
            tabValue={tabValue}
            _id={onChangeData?._id}
            details={onChangeData?.details}
            onCancel={handleCloseModal}
          />
        </Dialog>
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
          item?.name?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1 ||
          item?.city?.toLowerCase().indexOf(filterName?.toLowerCase()) !== -1
      );
    }
    return inputData;
  }
  