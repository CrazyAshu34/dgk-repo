import {
  Divider,
  IconButton,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useUpdateDealerStatusById } from 'services/dealerServices';
import {  useQueryClient } from '@tanstack/react-query';
import Iconify from '../../../components/iconify';
import LoadingScreen from '../../../components/loading-screen';
import MenuPopover from '../../../components/menu-popover/MenuPopover';

DealerTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDetails: PropTypes.func,
  handleChangePassword: PropTypes.func,
};

export default function DealerTableRow({ row, index, onEditRow, onDeleteRow, onDetails,handleChangePassword }) {
  const { _id, ret_id, dist_name, dist_com_name, dist_email, dist_contact, city, status } = row;

  const queryClient = useQueryClient();

  const [statusPage, setStatusPage] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);

  const { updateDealerStatus, isLoading: updateDealerIsLoading } = useUpdateDealerStatusById();

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  useEffect(() => {
  setStatusPage(status)
  }, [status]);
  const handleChange = (event) => {
    const payload = {
      _id,
      status: event.target.value,
    };
    updateDealerStatus(payload, {
      onSuccess: (res) => {
        if (res.data.status) {
          queryClient.invalidateQueries(['_getGetAllDealer']);
        }
      },
    });
  };

  // if (updateDealerIsLoading) return <LoadingScreen />;

  return (
    <>
      <TableRow hover>
        <TableCell align="left">{index + 1}</TableCell>

        <TableCell align="left" onClick={() => onDetails()} sx={{ cursor: 'pointer' }}>
          {ret_id}
        </TableCell>

        <TableCell onClick={() => onDetails()} sx={{ cursor: 'pointer' }}>
          {' '}
          <Typography variant="subtitle2" noWrap>
            {dist_com_name}
          </Typography>
        </TableCell>

        <TableCell onClick={() => onDetails()} sx={{ cursor: 'pointer' }}>
          {dist_name}
        </TableCell>

        <TableCell onClick={() => onDetails()} sx={{ cursor: 'pointer' }}>
          {city}
        </TableCell>
        <TableCell>{dist_contact}</TableCell>

        <TableCell>{dist_email}</TableCell>

        <TableCell>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={statusPage}
            onChange={handleChange}
            sx={{ height: '40px', width: '100%' }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
          </Select>
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 180 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            onDeleteRow();
            handleClosePopover();
          }}
        >
          {' '}
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem
          onClick={() => {
            handleChangePassword();
            handleClosePopover();
          }}
        >
          <Iconify icon="carbon:password" />
          Change Password
        </MenuItem>
      </MenuPopover>
    </>
  );
}
