import { Divider, IconButton, MenuItem, TableCell, Button, TableRow } from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Iconify from '../../../components/iconify';
import Image from '../../../components/image';
import MenuPopover from '../../../components/menu-popover/MenuPopover';

ProjectTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDetails: PropTypes.func,
  onOpenDialog: PropTypes.func,
};

export default function ProjectTableRow({
  row,
  index,
  onEditRow,
  onDeleteRow,
  onDetails,
  onOpenDialog,
}) {
  const [openPopover, setOpenPopover] = useState(null);
  const [image, setImage] = useState([]);

  const { name, cover_image, city } = row;

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  useEffect(() => {
    setImage(cover_image);
  }, [cover_image]);

  return (
    <>
      <TableRow hover>
        <TableCell align="left">{index + 1}</TableCell>

        <TableCell
          sx={{ display: 'flex', alignItems: 'left', cursor: 'pointer' }}
          onClick={() => onDetails()}
        >
          <Image
            disabledEffect
            alt={name}
            src={image}
            sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
          />
        </TableCell>

        <TableCell sx={{ cursor: 'pointer' }} onClick={() => onDetails()}>
          {name}
        </TableCell>

        <TableCell>{city}</TableCell>
        <TableCell sx={{ cursor: 'pointer' }}>
          <Button onClick={() => onOpenDialog()} type="submit" variant="contained">
            Add Images
          </Button>
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
      </MenuPopover>
    </>
  );
}
