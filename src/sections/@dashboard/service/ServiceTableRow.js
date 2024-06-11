import * as React from 'react';
import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Stack } from '@mui/system';
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import { CustomAvatar } from 'components/custom-avatar';
import PropTypes from 'prop-types';
import { useState } from 'react';
import moment from "moment";
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import TestingStatus from './TestingStatus';


ServiceTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onDetails: PropTypes.func,
};

export default function ServiceTableRow({ row, index, onEditRow, onDeleteRow, onDetails }) {
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const { _id, service_id, customers, priority, assign_to, status, assignee, source, otp, review_status, comment, rating, created_at } = row;

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
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
        <TableCell align="left">{service_id}</TableCell>
        <TableCell sx={{ cursor: 'pointer' }} onClick={() => onDetails()}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CustomAvatar name={customers[0]?.name} />

            <div>
              <Typography variant="subtitle2" noWrap>
                {customers[0]?.name}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell align="left">{customers[0]?.city}</TableCell>
 
        <TableCell align="left">{assign_to ? assignee[0]?.name : '-'}</TableCell>
        <TableCell align="left">{priority}</TableCell>
        <TableCell align="left">
          <TestingStatus itemId={_id} status={status} />
          {/* {status=="On The Way"?
          <Button variant="outlined" onClick={onhandleOpen} style={{marginLeft:'10px'}} color="warning">
            View
          </Button>:null} */}
        </TableCell>
        <TableCell align="left">{otp}</TableCell>
        <TableCell align="left">{review_status === true ?
          <Tooltip title={comment} arrow><div> {rating}  </div></Tooltip> : null}
        </TableCell>
        <TableCell align="left">{source}</TableCell>
        <TableCell align="left">{moment(created_at).utcOffset("+05:30").format('DD-MMMM-YYYY H:m')}</TableCell>
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
