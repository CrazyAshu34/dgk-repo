import { Button, Divider, IconButton, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import { Stack } from '@mui/system';
// import { CustomAvatar } from 'components/custom-avatar';
import Image from 'components/image/Image';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ConfirmDialog from '../../../components/confirm-dialog/ConfirmDialog';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover/MenuPopover';

TestimonialsTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
};

export default function TestimonialsTableRow({ row, index, onEditRow, onDeleteRow }) {
  const [openPopover, setOpenPopover] = useState(null);
  const { comment, name, image, designation } = row;
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
        <TableCell>
          <Image src={image} sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <CustomAvatar name={name} /> */}

            <div>
              <Typography variant="subtitle2" noWrap textTransform="capitalize">
                {name}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography
            variant="subtitle2"
            style={{ lineHeight: '1.5em', height: '52px', overflow: 'hidden' }}
          >
            <p
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: comment,
              }}
            />
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="body2" noWrap textTransform="capitalize">
            {designation}
          </Typography>
        </TableCell>

        {/* <TableCell align="left">{test_rewiew}</TableCell> */}

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
