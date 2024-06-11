import { Divider, IconButton, MenuItem, TableCell, TableRow } from '@mui/material';
// import moment from 'moment';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from '../../../components/iconify';
import Image from '../../../components/image';
import MenuPopover from '../../../components/menu-popover/MenuPopover';

ClientTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
};

export default function ClientTableRow({ row, index, onEditRow, onDeleteRow }) {
  const [openPopover, setOpenPopover] = useState(null);

  const { name, logo, link } = row;

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover>
        <TableCell align="left">{index + 1}</TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            disabledEffect
            alt={name}
            src={logo}
            sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
          />
        </TableCell>

        <TableCell align="left">{name}</TableCell>

        <TableCell align="left">
          {' '}
          <a href={link} style={{ textDecoration: 'none' }}>
            {link}
          </a>
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
