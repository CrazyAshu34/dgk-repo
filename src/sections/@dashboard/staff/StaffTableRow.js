import { Button, Divider, IconButton, MenuItem, TableCell, TableRow } from '@mui/material';
import Select from '@mui/material/Select';
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Iconify from '../../../components/iconify';
import Image from '../../../components/image';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import { useStatusUpdateStaffById } from '../../../services/staffServices';

StaffTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onEditRow: PropTypes.func,
  handleDetailsView: PropTypes.func,
  handleChangePassword: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function StaffTableRow({
  row,
  index,
  onEditRow,
  handleChangePassword,
  handleDetailsView,
  onDeleteRow,
}) {
  const [statusPage, setStatusPage] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { _id, name, emailId, contactNo, designationName, profile, status } = row;

  const { updateStaff } = useStatusUpdateStaffById();

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  useEffect(() => {
    if (status === 'Active') {
      setStatusPage('Active');
    } else {
      setStatusPage('InActive');
    }
  }, [status]);

  const onSubmit = async (data) => {
    setStatusPage(data);
    const payload = {
      id: _id,
      status: data,
    };
    updateStaff(payload);
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
          onClick={() => handleDetailsView()}
        >
          {profile ? (
            <Image
              disabledEffect
              alt={name}
              src={profile}
              sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
            />
          ) : (
            <Image
              disabledEffect
              alt={name}
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
            />
          )}
        </TableCell>

        <TableCell onClick={() => handleDetailsView()} style={{ cursor: 'pointer' }}>
          {name}
        </TableCell>

        <TableCell onClick={() => handleDetailsView()} style={{ cursor: 'pointer' }}>
          {designationName}
        </TableCell>

        <TableCell onClick={() => handleDetailsView()} style={{ cursor: 'pointer' }}>
          {contactNo}
        </TableCell>
        <TableCell onClick={() => handleDetailsView()} style={{ cursor: 'pointer' }}>
          {emailId}
        </TableCell>

        <TableCell align="left">
          {designationName === 'Admin' ? (
            <MenuItem value="Active">Active</MenuItem>
          ) : (
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              onChange={(e) => onSubmit(e.target.value)}
              value={statusPage}
              sx={{ height: '40px', width: 120 }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="InActive">InActive</MenuItem>
            </Select>
          )}
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
        sx={{ width: 160 }}
      >
        {designationName === 'Admin' ? null : (
          <>
            <MenuItem
              onClick={() => {
                onEditRow();
                handleClosePopover();
              }}
            >
              Edit
            </MenuItem>
            <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
        >
          Delete
        </MenuItem>
          </>
        )}

        <MenuItem
          onClick={() => {
            handleChangePassword();
            handleClosePopover();
          }}
        >
          Change Password
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
