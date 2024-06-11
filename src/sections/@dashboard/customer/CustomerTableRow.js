import {
  Button,
  MenuItem,
  TableCell,
  TableRow
} from '@mui/material';
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { CustomAvatar } from '../../../components/custom-avatar';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover/MenuPopover';

StaffTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onDetails: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onAddAmcRow: PropTypes.func,
};

export default function StaffTableRow({ row, index, onEditRow, onDetails, onDeleteRow, onAddAmcRow, }) {
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { image, name, mobileNumber, emailId } = row;
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  return (
    <>
      <TableRow hover>
        <TableCell align="left">{index + 1}</TableCell>

        <TableCell
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => onDetails()}
        >
          <CustomAvatar name={name} />
        </TableCell>

        <TableCell onClick={() => onDetails()} sx={{ cursor: 'pointer' }}>
          {name}
        </TableCell>

        <TableCell onClick={() => onDetails()} sx={{ cursor: 'pointer' }}>
          {mobileNumber}
        </TableCell>
        <TableCell onClick={() => onDetails()} sx={{ cursor: 'pointer' }}>
          {emailId}
        </TableCell>
        {/* <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
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
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
        >
          {' '}
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>

      </MenuPopover>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={(e) => {
              onDeleteRow(e);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
