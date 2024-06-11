import { Button, Divider, IconButton, MenuItem, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { CustomAvatar } from 'components/custom-avatar';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ConfirmDialog from '../../../components/confirm-dialog/ConfirmDialog';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover/MenuPopover';

BlogTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
};

export default function BlogTableRow({ row, index, onEditRow, onDeleteRow }) {
  const [openPopover, setOpenPopover] = useState(null);
  // const { image, title, backlink } = row;
  const { _id, title, blogId, createdAt, postedBy } = row;
  const [openConfirm, setOpenConfirm] = useState(false);

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

        <TableCell>{blogId}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CustomAvatar name={title} />

            <div>
              <Typography variant="subtitle2" noWrap>
                {title}
              </Typography>
            </div>
          </Stack>
        </TableCell>



        <TableCell align="left">{postedBy}</TableCell>

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
        content="Are you sure want to delete this row?"
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
