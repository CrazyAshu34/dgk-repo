import { Box, Button, Stack, Divider, TableCell, MenuItem, TableRow, Typography, IconButton } from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
// utils
// components
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import { CustomAvatar } from 'components/custom-avatar';
import { useEffect, useState } from 'react';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import MenuPopover from '../../../components/menu-popover/MenuPopover';

AmcTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onDeleteRow: PropTypes.func,
  handleAddEvent: PropTypes.func,
  handleOpenPModal: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};

export default function AmcTableRow({ row, index, onDeleteRow, handleAddEvent, handleOpenPModal, onViewRow, onEditRow }) {
  const { amc_id, status, customers, expiry_date, created_at, products, amc_type } = row;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [assigneeName, setAssigneeName] = useState('');
  useEffect(() => {
    if (customers) {
      const asiignee = customers[0]?.assignee?JSON.parse(customers[0]?.assignee):null;
      if(asiignee){
        setAssigneeName(asiignee[0].name)
      }
      console.log("asiignee=",asiignee);
    }
  }, [customers])

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  return (
    <>
      <TableRow hover>
        <TableCell align="left">{index + 1}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CustomAvatar name={customers[0]?.name} />

            <div>
              <Typography variant="subtitle2">{customers[0]?.name}</Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell>{customers[0]?.contact_no}</TableCell>

        <TableCell>{customers[0]?.city}</TableCell>

        <TableCell>{amc_id}</TableCell>
        <TableCell>{amc_type}</TableCell>


        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'All Amc' && 'primary') ||
              (status === 'Active AMC' && 'success') ||
              (status === 'InActive Amc' && 'warning') ||
              'error'
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="left">{moment(expiry_date).format('DD MMM YYYY')}</TableCell>

        {/* <TableCell>
          <Button variant="contained" onClick={handleAddEvent}>
            Upgrade
          </Button>
        </TableCell> */}
        <TableCell align="left">{assigneeName}</TableCell>
        {/* <TableCell onClick={()=>onViewRow()} >
            
            <Label style={{cursor:'pointer'}}
            variant="hard"
            color='primary'
          >
            View
          </Label> 
            </TableCell> */}

        {/* <TableCell align="center">
          <Box
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:trash-2-outline" />
          </Box>
        </TableCell> */}
        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Delete"
          content="Are you sure want to delete?"
          action={
            <Button style={{ cursor: 'pointer' }}
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
            handleAddEvent();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Upgrade
        </MenuItem>
        <MenuItem
          onClick={() => onViewRow()}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={(e) => {
            onDeleteRow(e);
            handleCloseConfirm();
          }}
        >
          {' '}
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}
